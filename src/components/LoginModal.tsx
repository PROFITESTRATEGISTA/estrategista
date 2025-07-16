import React, { useState } from 'react';
import { X, Eye, EyeOff, Phone, Mail, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import supabase from '../lib/supabase';
import { useAuth, formatPhoneToE164 } from '../contexts/AuthContext';
import { SetPasswordModal } from './SetPasswordModal';

// RD Station integration
declare global {
  interface Window {
    RdIntegration?: unknown;
  }
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const { login, register, registerWithPhoneAndEmail, resetPassword, lastAuthError } = useAuth();
  
  // Get persistent state from localStorage to survive modal remounts
  const getPersistedState = () => {
    try {
      const saved = localStorage.getItem('loginModal_state');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };
  
  const persistedState = getPersistedState();
  
  const [email, setEmail] = useState(persistedState.email || '');
  const [password, setPassword] = useState(persistedState.password || '');
  const [phone, setPhone] = useState(persistedState.phone || '');
  const [name, setName] = useState(persistedState.name || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(persistedState.isRegister || false);
  const [isPhoneAuth, setIsPhoneAuth] = useState(persistedState.isPhoneAuth || false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  
  // Resend code state management
  const [resendCooldown, setResendCooldown] = useState(0);
  const [lastResendTime, setLastResendTime] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false);

  React.useEffect(() => {
    // Load RD Station script
    if (!window.RdIntegration) {
      const script = document.createElement('script');
      script.src = 'https://d335luupugsy2.cloudfront.net/js/rdstation-forms/stable/rdstation-forms.min.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  React.useEffect(() => {
    console.log('🔄 LoginModal mounted/updated - isPhoneAuth:', isPhoneAuth, 'isRegister:', isRegister);
    return () => {
      console.log('🔄 LoginModal unmounting');
    };
  }, [isPhoneAuth, isRegister]);

  // Clear persisted state when modal closes successfully
  React.useEffect(() => {
    if (!isOpen) {
      // Only clear if we're not in phone auth mode (successful completion)
      const saved = localStorage.getItem('loginModal_state');
      if (saved) {
        const state = JSON.parse(saved);
        if (!state.isPhoneAuth) {
          localStorage.removeItem('loginModal_state');
        }
      }
    }
  }, [isOpen]);

  // Countdown timer effect for resend cooldown
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [resendCooldown]);

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'PASSWORD_SETUP_REQUIRED':
        return {
          type: 'info' as const,
          title: 'Configure sua senha',
          message: 'Você se cadastrou usando seu telefone. Para fazer login com email e senha, você precisa configurar uma senha primeiro.',
          action: 'Configurar Senha'
        };
      case 'WRONG_PASSWORD':
        return {
          type: 'error' as const,
          title: 'Senha incorreta',
          message: 'A senha informada está incorreta. Verifique e tente novamente.',
          action: 'Esqueci minha senha'
        };
      case 'USER_NOT_FOUND':
        return {
          type: 'error' as const,
          title: 'Usuário não encontrado',
          message: 'Não encontramos uma conta com este email. Verifique o email ou crie uma nova conta.',
          action: 'Criar Conta'
        };
      case 'NETWORK_ERROR':
        return {
          type: 'error' as const,
          title: 'Erro de conexão',
          message: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
          action: 'Tentar Novamente'
        };
      default:
        return {
          type: 'error' as const,
          title: 'Erro no login',
          message: 'Ocorreu um erro inesperado. Tente novamente.',
          action: 'Tentar Novamente'
        };
    }
  };

  // Alternative approach: Direct password update (requires user to be logged in)
  const forcePasswordUpdate = async (email: string, newPassword: string) => {
    try {
      console.log('🔐 Attempting direct password update for:', email);
      
      // Try to sign in with phone OTP first to get authenticated
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: formatPhoneToE164(phone) || '',
        options: {
          channel: 'sms'
        }
      });
      
      if (otpError) {
        console.error('❌ OTP error:', otpError);
        setError('Erro ao enviar código SMS. Tente novamente.');
        return false;
      }
      
      setError('Código SMS enviado. Após verificar, a senha será atualizada.');
      setIsPhoneAuth(true);
      setIsRegister(false);
      // Store the new password to set after verification
      setPassword(newPassword);
      return true;
    } catch (error) {
      console.error('❌ Force password update error:', error);
      return false;
    }
  };

  const handleErrorAction = async (errorType: string) => {
    switch (errorType) {
      case 'PASSWORD_SETUP_REQUIRED':
        setShowSetPasswordModal(true);
        break;
      case 'WRONG_PASSWORD':
        // For wrong password, offer SMS verification to reset password
        try {
          // Get user's phone number using the database function
          const { data: authMethods } = await supabase.rpc('check_user_auth_methods', {
            user_email: email
          });
          
          if (authMethods?.hasPhone) {
            console.log('🔐 User has phone, using SMS verification to reset password');
            // Get the actual phone number from public table (using service role)
            const { data: userData } = await supabase
              .from('users')
              .select('phone')
              .eq('email', email)
              .single();
            
            if (userData?.phone) {
              setPhone(userData.phone);
              await forcePasswordUpdate(email, '123456789');
            } else {
              setIsPasswordReset(true);
            }
          } else {
            // Fallback to email reset
            setIsPasswordReset(true);
          }
        } catch (error) {
          console.error('❌ Error getting user auth methods:', error);
          setIsPasswordReset(true);
        }
        break;
      case 'USER_NOT_FOUND':
        setIsRegister(true);
        break;
      default:
        // For other errors, just clear the error
        setError('');
        break;
    }
  };

  const handleSendSMS = async () => {
    if (!phone) {
      setError('Número de telefone é obrigatório');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formattedPhone = formatPhoneToE164(phone);
      
      if (!formattedPhone) {
        setError('Número de telefone inválido');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: {
            name: name || 'Usuário',
            phone: formattedPhone,
            email: email || ''
          }
        }
      });

      if (error) {
        console.error('SMS error:', error);
        setError('Erro ao enviar SMS. Verifique o número e tente novamente.');
        setIsLoading(false);
        return;
      }

      if (data) {
        console.log('✅ SMS sent successfully');
        setIsPhoneAuth(true);
        setError('');
        
        // Persist state to survive modal remounts
        localStorage.setItem('loginModal_state', JSON.stringify({
          isPhoneAuth: true,
          isRegister,
          email,
          phone,
          name,
          password // Add password to localStorage state
        }));
        
        // Set resend cooldown
        const cooldownTime = 60; // 60 seconds
        setResendCooldown(cooldownTime);
        setLastResendTime(Date.now());
      }
    } catch (error) {
      console.error('SMS sending error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao enviar SMS';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // Check if cooldown is still active
    const now = Date.now();
    const timeSinceLastResend = now - lastResendTime;
    const cooldownMs = 60000; // 60 seconds

    if (timeSinceLastResend < cooldownMs) {
      const remainingSeconds = Math.ceil((cooldownMs - timeSinceLastResend) / 1000);
      setError(`Aguarde ${remainingSeconds} segundos antes de solicitar um novo código`);
      return;
    }

    if (!phone) {
      setError('Número de telefone não encontrado');
      return;
    }

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      // Format phone number to E.164 format
      const internationalPhone = formatPhoneToE164(phone);
      
      if (!internationalPhone) {
        setError('Formato de telefone inválido');
        setIsResending(false);
        return;
      }

      // Prepare user data payload - include email if provided
      const userData: {
        name: string;
        phone: string;
        plan: string;
        email?: string;
      } = {
        name: name || `Usuário ${phone.replace(/\D/g, '').slice(-4)}`,
        phone: internationalPhone,
        plan: 'free'
      };

      // Only include email if it's provided and not empty
      if (email && email.trim()) {
        userData.email = email.trim();
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: internationalPhone,
        options: {
          data: userData
        }
      });

      if (error) throw error;

      // Update resend state
      setLastResendTime(now);
      setResendCooldown(60); // Start 60-second countdown
      setVerificationCode(''); // Clear previous code
      setResendSuccess(true);
      
      console.log('SMS code resent successfully to:', internationalPhone);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);

    } catch (error: unknown) {
      console.error('Resend SMS error:', error);
      const errorMessage = (error as { message?: string })?.message || '';
      
      if (errorMessage.includes('rate limit')) {
        setError('Muitas tentativas de SMS. Aguarde alguns minutos antes de tentar novamente.');
      } else if (errorMessage.includes('invalid phone')) {
        setError('Número de telefone inválido. Verifique o formato.');
      } else {
        setError('Erro ao reenviar código SMS. Tente novamente em alguns minutos.');
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Por favor, digite o código de 6 dígitos');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formatPhoneToE164(phone) || '',
        token: verificationCode,
        type: 'sms'
      });

      if (error) {
        console.error('Verification error:', error);
        setError('Código inválido ou expirado. Tente novamente.');
        setIsVerifying(false);
        return;
      }

      if (data?.user) {
        console.log('✅ Phone verification successful');
        
        // If this is a registration flow and we have email/password, set the password now
        if (isRegister && email && password) {
          try {
            console.log('🔐 Setting password for email/password login:', email);
            console.log('🔐 Password setup conditions:', { isRegister, email: !!email, password: !!password, passwordValue: password });
            
            // Use Supabase's updateUser to set the password for the authenticated user
            const { error: passwordError } = await supabase.auth.updateUser({
              password: password
            });
            
            if (passwordError) {
              console.error('❌ Password setup error:', passwordError);
              setError('Erro ao configurar senha. Tente novamente.');
              setIsVerifying(false);
              return;
            }
            
            console.log('✅ Password set successfully for email/password login');
          } catch (passwordError) {
            console.error('❌ Password setup error:', passwordError);
            setError('Erro ao configurar senha. Tente novamente.');
            setIsVerifying(false);
            return;
          }
        } else {
          console.log('🔐 Password setup skipped - conditions not met:', { isRegister, email: !!email, password: !!password });
        }

        // Success - user is now logged in
        onLogin();
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError('Erro na verificação. Tente novamente.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setError('Por favor, digite seu email primeiro');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      const success = await resetPassword(email);
      if (success) {
        setResetEmailSent(true);
        setIsPasswordReset(false);
      } else {
        setError('Erro ao enviar email de recuperação. Tente novamente.');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Erro ao enviar email de recuperação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔄 handleSubmit called - isPhoneAuth:', isPhoneAuth, 'isRegister:', isRegister, 'phone:', phone, 'email:', email);
    
    if (isLoading) return;
    
    setError('');
    setIsLoading(true);

    try {
      if (isPasswordReset) {
        if (!email) {
          setError('Por favor, informe seu email');
          setIsLoading(false);
          return;
        }

        const success = await resetPassword(email);
        if (success) {
          setResetEmailSent(true);
          setError('');
        } else {
          setError('Não foi possível enviar o email de recuperação. Verifique o email informado.');
        }
        setIsLoading(false);
        return;
      }

      if (isPhoneAuth) {
        // If we're in phone verification mode, verify the code
        await handleVerifyCode();
      } else if (isRegister) {
        // If registering with both phone and email, use unified registration
        if (phone && email) {
          try {
            setIsLoading(true);
            setError('');
            console.log('🔄 Before unified registration - isPhoneAuth:', isPhoneAuth);
            const success = await registerWithPhoneAndEmail(phone, email, password, name);
            console.log('🔄 After unified registration - success:', success);
            if (success) {
              console.log('🔄 Setting isPhoneAuth to true');
              console.log('🔄 Current state before setIsPhoneAuth(true):', { isPhoneAuth, isRegister });
              setIsPhoneAuth(true);
              setError('');
              
              // Persist state to survive modal remounts
              localStorage.setItem('loginModal_state', JSON.stringify({
                isPhoneAuth: true,
                isRegister: true,
                email,
                phone,
                name,
                password // Add password to localStorage state
              }));
              
              console.log('🔄 After setIsPhoneAuth(true) - isPhoneAuth should be true');
              // Success message will be shown in phone auth mode
            } else {
              setError('Erro ao criar conta. Tente novamente.');
            }
          } catch (error) {
            console.error('Unified registration error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
            setError(errorMessage);
          } finally {
            console.log('🔄 Unified registration finally block - setting isLoading to false');
            setIsLoading(false);
          }
        } else if (phone) {
          // If only phone is provided, use phone auth
          await handleSendSMS();
        } else {
          // Otherwise use email/password registration
          try {
            setIsLoading(true);
            setError('');
            await register(email, password, name);
            onLogin();
            onClose();
            resetForm();
          } catch (error) {
            console.error('Registration error:', error);
            const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
            if (errorMessage.includes('Database error') || errorMessage.includes('unexpected_failure')) {
              setError('Serviço temporariamente indisponível. Sua conta foi criada localmente e será sincronizada quando o serviço for restaurado.');
            } else {
              setError(errorMessage);
            }
          } finally {
            setIsLoading(false);
          }
        }
      } else {
        // Login logic
        const success = await login(email, password);
        if (success) {
          // Clear all form data on successful login
          setEmail('');
          setPassword('');
          setPhone('');
          setName('');
          setError('');
          localStorage.removeItem('loginModal_state');
          onLogin();
          onClose();
        } else {
          // Handle specific error cases
          if (lastAuthError === 'PASSWORD_SETUP_REQUIRED') {
            // This will be handled by the error display
            setError('');
          } else {
            setError('Email ou senha incorretos');
          }
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    console.log('🔄 resetForm() called - resetting isPhoneAuth to false');
    console.trace('Stack trace for resetForm call:');
    setEmail('');
    setPassword('');
    setPhone('');
    setName('');
    setVerificationCode('');
    setIsPhoneAuth(false);
    setError('');
    
    // Clear persisted state
    localStorage.removeItem('loginModal_state');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  console.log('🔄 Rendering LoginModal - isPhoneAuth:', isPhoneAuth, 'isRegister:', isRegister, 'isLoading:', isLoading);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {isPhoneAuth ? 'Verificar Telefone' : isRegister ? 'Criar Conta' : 'Fazer Login'}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Hidden RD Station fields */}
              <input type="hidden" name="token_rdstation" value="57e7abbb49395ca58551fe103433f9da" />
              <input type="hidden" name="identificador" value="registro-usuario" />
              
              {/* Enhanced Error Display */}
              {(error || lastAuthError) && (
                <div className={`mb-4 p-4 rounded-lg border ${
                  getErrorMessage(lastAuthError).type === 'error' 
                    ? 'bg-red-50 border-red-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {getErrorMessage(lastAuthError).type === 'error' ? (
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-blue-400" />
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <h3 className={`text-sm font-medium ${
                        getErrorMessage(lastAuthError).type === 'error' 
                          ? 'text-red-800' 
                          : 'text-blue-800'
                      }`}>
                        {getErrorMessage(lastAuthError).title}
                      </h3>
                      <p className={`mt-1 text-sm ${
                        getErrorMessage(lastAuthError).type === 'error' 
                          ? 'text-red-700' 
                          : 'text-blue-700'
                      }`}>
                        {error || getErrorMessage(lastAuthError).message}
                      </p>
                      {lastAuthError && (
                        <button
                          onClick={() => handleErrorAction(lastAuthError)}
                          className={`mt-2 text-sm font-medium underline ${
                            getErrorMessage(lastAuthError).type === 'error' 
                              ? 'text-red-600 hover:text-red-500' 
                              : 'text-blue-600 hover:text-blue-500'
                          }`}
                        >
                          {getErrorMessage(lastAuthError).action}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Phone Verification Mode */}
              {isPhoneAuth && (
                <>
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Código enviado via SMS
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Digite o código de 6 dígitos enviado para {phone}
                    </p>
                  </div>

                  <div>
                    <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-2">
                      Código de Verificação
                    </label>
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifying || verificationCode.length !== 6}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isVerifying ? 'Verificando...' : 'Verificar Código'}
                  </button>

                  {/* Resend Success Message */}
                  {resendSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                      Novo código enviado com sucesso!
                    </div>
                  )}

                  {/* Resend Code Section */}
                  <div className="text-center space-y-2">
                    <p className="text-sm text-gray-600">
                      Não recebeu o código?
                    </p>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={isResending || resendCooldown > 0}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                      aria-label={resendCooldown > 0 ? `Aguarde ${resendCooldown} segundos para reenviar` : 'Reenviar código SMS'}
                    >
                      {isResending ? (
                        'Reenviando...'
                      ) : resendCooldown > 0 ? (
                        `Reenviar em ${resendCooldown}s`
                      ) : (
                        'Reenviar código'
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('🔄 Back to registration button clicked - setting isPhoneAuth to false');
                        setIsPhoneAuth(false);
                        setVerificationCode('');
                        setError('');
                        setResendCooldown(0);
                        setLastResendTime(0);
                        setResendSuccess(false);
                      }}
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                    >
                      Voltar e alterar telefone
                    </button>
                  </div>
                </>
              )}

              {/* Normal Form Fields */}
              {!isPhoneAuth && (
                <>
                  {/* Registration Name Field */}
                  {isRegister && (
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nome (opcional)
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="Seu nome"
                      />
                    </div>
                  )}

                  {/* Phone Field - Required for Registration */}
                  {isRegister && (
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-1" />
                        WhatsApp *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => {
                          // Format phone number as user types
                          const value = e.target.value.replace(/\D/g, '');
                          let formatted = value;
                          if (value.length >= 2) {
                            formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}`;
                            if (value.length > 7) {
                              formatted += `-${value.slice(7, 11)}`;
                            }
                          }
                          setPhone(formatted);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="(11) 99999-9999"
                        required
                        maxLength={15}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Será usado para autenticação via SMS
                      </p>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email {isRegister ? '(opcional, mas recomendado)' : ''}
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="seu@email.com"
                      required={!isRegister}
                    />
                    {isRegister && (
                      <p className="text-xs text-gray-500 mt-1">
                        Facilita recuperação de conta e recebimento de notificações importantes
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Senha
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                        placeholder="••••••••"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {isRegister && (
                      <p className="text-xs text-gray-500 mt-1">
                        Mínimo 6 caracteres
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      isRegister ? (phone ? 'Enviando SMS...' : 'Criando conta...') : 'Entrando...'
                    ) : (
                      isRegister ? (phone ? 'Enviar Código SMS' : 'Criar Conta Grátis') : 'Entrar'
                    )}
                  </button>

                  {/* Password Reset Success Message */}
                  {resetEmailSent && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-center">
                      <p className="font-medium">Email de recuperação enviado!</p>
                      <p className="text-sm">Verifique sua caixa de entrada e spam.</p>
                    </div>
                  )}

                  {/* Password Reset Link - Only show for login mode */}
                  {!isRegister && !resetEmailSent && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={handlePasswordReset}
                        disabled={isLoading}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
                      >
                        Esqueceu sua senha?
                      </button>
                    </div>
                  )}

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      {isRegister ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          console.log('🔄 Toggle button clicked - setting isRegister to', !isRegister);
                          setIsRegister(!isRegister);
                          setError('');
                          setEmail('');
                          setPassword('');
                          setPhone('');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {isRegister ? 'Fazer Login' : 'Cadastre-se'}
                      </button>
                    </p>
                  </div>

                  {/* Registration Info */}
                  {isRegister && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        <strong>Autenticação Segura:</strong> Usamos SMS para verificar sua identidade e garantir a segurança da sua conta.
                      </p>
                    </div>
                  )}

                  {/* Login Options - Only for login mode */}
                  {!isRegister && (
                    <div className="text-center pt-4 border-t border-gray-200 space-y-3">
                      <button 
                        type="button"
                        onClick={() => window.open('https://wa.me/5511911560276', '_blank')}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Esqueceu a senha? Fale conosco
                      </button>
                      
                      <div className="text-sm text-gray-600">
                        ou
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => {
                          setPhone('');
                          setIsPhoneAuth(false);
                          setIsRegister(true);
                          setError('');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Fazer login com SMS
                      </button>
                    </div>
                  )}
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Password Setup Modal */}
      {showSetPasswordModal && email && (
        <SetPasswordModal
          isOpen={showSetPasswordModal}
          onClose={() => {
            setShowSetPasswordModal(false);
            // After password is set, try to login automatically
            if (password) {
              login(email, password).then((success) => {
                if (success) {
                  onLogin();
                  onClose();
                }
              });
            }
          }}
          userEmail={email}
        />
      )}
    </>
  );
};

export default LoginModal;