import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export const SetPasswordModal: React.FC<SetPasswordModalProps> = ({
  isOpen,
  onClose,
  userEmail,
}) => {
  const { setPassword } = useAuth();
  const [password, setPasswordValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Password strength validation
  const validatePasswordStrength = (pwd: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (pwd.length >= 8) {
      score += 1;
    } else {
      feedback.push('Pelo menos 8 caracteres');
    }

    if (/[A-Z]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('Uma letra maiúscula');
    }

    if (/[a-z]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('Uma letra minúscula');
    }

    if (/\d/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('Um número');
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      score += 1;
    } else {
      feedback.push('Um caractere especial');
    }

    const colors = ['text-red-600', 'text-red-500', 'text-yellow-500', 'text-yellow-400', 'text-green-500'];
    const color = colors[Math.min(score, 4)];

    return { score, feedback, color };
  };

  const passwordStrength = validatePasswordStrength(password);
  const isPasswordValid = passwordStrength.score >= 4;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!isPasswordValid) {
      setError('A senha deve atender aos requisitos de segurança');
      return;
    }

    if (!passwordsMatch) {
      setError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    try {
      await setPassword(userEmail, password);
      setSuccess(true);
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setPasswordValue('');
        setConfirmPassword('');
      }, 2000);
    } catch (err: unknown) {
      console.error('Password setting error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao definir senha. Tente novamente.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
      setPasswordValue('');
      setConfirmPassword('');
      setError('');
      setSuccess(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Definir Senha
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Senha Definida com Sucesso!
              </h3>
              <p className="text-gray-600">
                Agora você pode fazer login com seu email e senha.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  Defina uma senha para sua conta para poder fazer login com email e senha.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    <strong>Email:</strong> {userEmail}
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Nova Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPasswordValue(e.target.value)}
                      className="block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Digite sua nova senha"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1">
                          <div 
                            className={`h-1 rounded-full transition-all duration-300 ${
                              passwordStrength.score >= 1 ? 'bg-red-500' : ''
                            } ${
                              passwordStrength.score >= 2 ? 'bg-yellow-500' : ''
                            } ${
                              passwordStrength.score >= 4 ? 'bg-green-500' : ''
                            }`}
                            style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-medium ${passwordStrength.color}`}>
                          {passwordStrength.score < 2 && 'Fraca'}
                          {passwordStrength.score >= 2 && passwordStrength.score < 4 && 'Média'}
                          {passwordStrength.score >= 4 && 'Forte'}
                        </span>
                      </div>
                      
                      {passwordStrength.feedback.length > 0 && (
                        <div className="text-xs text-gray-600">
                          <p className="mb-1">Necessário:</p>
                          <ul className="list-disc list-inside space-y-0.5">
                            {passwordStrength.feedback.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`block w-full px-3 py-2 pr-10 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        confirmPassword.length > 0
                          ? passwordsMatch
                            ? 'border-green-300'
                            : 'border-red-300'
                          : 'border-gray-300'
                      }`}
                      placeholder="Confirme sua nova senha"
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {confirmPassword.length > 0 && (
                    <div className="mt-1">
                      {passwordsMatch ? (
                        <p className="text-xs text-green-600 flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Senhas coincidem
                        </p>
                      ) : (
                        <p className="text-xs text-red-600 flex items-center">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Senhas não coincidem
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center">
                      <AlertCircle className="w-4 h-4 text-red-600 mr-2" />
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || !isPasswordValid || !passwordsMatch}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Definindo...' : 'Definir Senha'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 