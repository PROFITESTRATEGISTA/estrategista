import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import supabase from '../lib/supabase';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name: string;
  role?: 'user' | 'admin'; // Make role optional since it's not in database
  plan?: 'free' | 'starter' | 'pro' | 'master'; // Add 'free' as valid plan option
  createdAt: string;
  lastLogin?: string;
}

interface LocalStorageUser {
  id: string;
  email: string;
  name: string;
  password: string;
  role?: 'user' | 'admin';
  plan?: 'free' | 'starter' | 'pro' | 'master';
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  registerWithPhoneAndEmail: (phone: string, email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  resetPassword: (email: string) => Promise<boolean>;
  setPassword: (email: string, password: string) => Promise<boolean>;
  checkUserAuthMethods: (email: string) => Promise<{ exists: boolean; hasPassword: boolean; hasPhone: boolean }>;
  lastAuthError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to format phone number to E.164 format
export const formatPhoneToE164 = (phone: string): string | null => {
  // Remove all non-numeric characters except +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // If already starts with +, assume it's already in E.164 format
  if (cleaned.startsWith('+')) {
    return cleaned.length >= 10 ? cleaned : null;
  }
  
  // Handle Brazilian numbers (most common case for this app)
  if (cleaned.length === 11) {
    // Format: DDD + 9 digits (mobile) - add Brazil country code +55
    return `+55${cleaned}`;
  } else if (cleaned.length === 10) {
    // Format: DDD + 8 digits (landline) - add Brazil country code +55
    return `+55${cleaned}`;
  } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
    // Already has country code but missing +
    return `+${cleaned}`;
  }
  
  // If none of the above, return null (invalid format)
  return null;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [lastAuthError, setLastAuthError] = useState<string | null>(null);

  // Initialize with mock data and check localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check Supabase session first
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Fetch user data from public.users table
          try {
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name, plan, email')
              .eq('id', session.user.id)
              .single();

            if (userError) {
              console.warn('Failed to fetch user data during initialization:', userError);
            }

            const user: User = {
              id: session.user.id,
              email: userData?.email || session.user.email || '',
              name: userData?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
              role: session.user.email === 'pedropardal04@gmail.com' ? 'admin' : 'user',
              plan: userData?.plan || 'free',
              createdAt: session.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            
            setUser(user);
            setSupabaseUser(session.user);
            localStorage.setItem('profit_current_user', JSON.stringify(user));
            
            // Update last login
            updateLastLogin(session.user.id);
            setLoading(false);
            return;
          } catch (dbError) {
            console.error('Database query error during initialization:', dbError);
            // Fall back to basic session data
            const fallbackUser: User = {
              id: session.user.id,
              email: session.user.email || '',
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
              role: session.user.email === 'pedropardal04@gmail.com' ? 'admin' : 'user',
              plan: 'free',
              createdAt: session.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            
            setUser(fallbackUser);
            setSupabaseUser(session.user);
            localStorage.setItem('profit_current_user', JSON.stringify(fallbackUser));
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error('Error checking Supabase session:', error);
      }

      // Initialize mock users in localStorage if they don't exist
      const existingUsers = localStorage.getItem('profit_users');
      if (!existingUsers) {
        const mockUsers = [
          {
            id: '1',
            email: 'admin@profit.com',
            password: 'admin123',
            name: 'Administrador',
            role: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          },
          {
            id: '2',
            email: 'user@profit.com',
            password: 'user123',
            name: 'Usuário Teste',
            role: 'user',
            plan: 'pro',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          }
        ];
        localStorage.setItem('profit_users', JSON.stringify(mockUsers));
      }

      // Check if user is logged in
      const savedUser = localStorage.getItem('profit_current_user');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing saved user data:', error);
          localStorage.removeItem('profit_current_user');
        }
      }
      setLoading(false);
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state change:', event, 'session:', !!session?.user);
      if (event === 'SIGNED_IN' && session?.user) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || 
                (session.user as SupabaseUser).user_metadata?.name || 
                session.user.email?.split('@')[0] || 'Usuário',
          role: session.user.email === 'admin@profit.com' ? 'admin' : 'user',
          plan: session.user.user_metadata?.plan || 
                (session.user as SupabaseUser).user_metadata?.plan || 'free',
          createdAt: session.user.created_at || new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
        
        setUser(userData);
        setSupabaseUser(session.user);
        localStorage.setItem('profit_current_user', JSON.stringify(userData));
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setSupabaseUser(null);
        localStorage.removeItem('profit_current_user');
      }
    });

    initializeAuth();
    
    return () => subscription.unsubscribe();
  }, []);

  // Function to update last login timestamp
  const updateLastLogin = async (userId: string) => {
    try {
      const now = new Date().toISOString();
      
      // Update in Supabase
      const { error } = await supabase
        .from('users')
        .update({ last_login: now })
        .eq('id', userId);
      
      if (error) {
        console.warn('Failed to update last_login in Supabase:', error);
      } else {
        console.log('✅ Last login updated successfully for user:', userId);
      }
      
      // Update local storage
      const savedUser = localStorage.getItem('profit_current_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        userData.lastLogin = now;
        localStorage.setItem('profit_current_user', JSON.stringify(userData));
        setUser(prev => prev ? { ...prev, lastLogin: now } : null);
      }
    } catch (error) {
      console.error('Error updating last login:', error);
    }
  };

  const checkUserAuthMethods = async (email: string): Promise<{ exists: boolean; hasPassword: boolean; hasPhone: boolean }> => {
    try {
      console.log('🔍 checkUserAuthMethods called for:', email);
      
      // Use the database function to check user auth methods
      const { data, error } = await supabase.rpc('check_user_auth_methods', {
        user_email: email
      });

      console.log('🔍 Database function result:', { data, error });

      if (error) {
        console.warn('Error calling check_user_auth_methods function:', error);
        return { exists: false, hasPassword: false, hasPhone: false };
      }

      if (!data) {
        console.log('🔍 No data returned from function');
        return { exists: false, hasPassword: false, hasPhone: false };
      }

      console.log('🔍 checkUserAuthMethods final result:', { email, result: data });
      return data;
    } catch (error) {
      console.error('Error in checkUserAuthMethods:', error);
      return { exists: false, hasPassword: false, hasPhone: false };
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLastAuthError(null);
      
      // Try Supabase login first
      try {
        setLoading(true);
        console.log('🔐 Attempting Supabase login for:', email);
        console.log('🔐 Password length:', password.length);
        console.log('🔐 Password (first 3 chars):', password.substring(0, 3) + '...');
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        console.log('🔐 Supabase auth response:', { 
          hasUser: !!data.user, 
          userId: data.user?.id, 
          userEmail: data.user?.email,
          emailConfirmed: data.user?.email_confirmed_at ? true : false,
          hasError: !!error,
          errorMessage: error?.message,
          errorCode: error?.name
        });

        if (data.user && !error) {
          // Supabase login successful - now fetch user data from public.users
          try {
            console.log('✅ Supabase login successful, fetching user data for ID:', data.user.id);
            
            const { data: userData, error: userError } = await supabase
              .from('users')
              .select('name, plan, email')
              .eq('id', data.user.id)
              .single();

            console.log('👤 User data query result:', { 
              userData, 
              hasError: !!userError,
              errorMessage: userError?.message 
            });

            if (userError) {
              console.warn('Failed to fetch user data from public.users:', userError);
            }

            const user: User = {
              id: data.user.id,
              email: userData?.email || data.user.email || '',
              name: userData?.name || 
                    data.user.user_metadata?.name || 
                    data.user.email?.split('@')[0] || 'Usuário',
              role: data.user.email === 'admin@profit.com' ? 'admin' : 'user',
              plan: userData?.plan || 'free',
              createdAt: data.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };

            console.log('👤 Final user object created:', user);
            setUser(user);
            
            // Update last login for new registration
            updateLastLogin(data.user.id);
            setLoading(false);
            return true;
          } catch (dbError) {
            console.error('❌ Database query error:', dbError);
            // Still allow login even if user data fetch fails
            const fallbackUser: User = {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'Usuário',
              role: data.user.email === 'admin@profit.com' ? 'admin' : 'user',
              plan: 'free',
              createdAt: data.user.created_at || new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
            setUser(fallbackUser);
            setLoading(false);
            
            // Update last login for fallback user too
            updateLastLogin(data.user.id);
            return true;
          }
        } else if (error) {
          console.error('❌ Supabase login error:', error);
          
          // Enhanced error handling for specific scenarios
          if (error.message === 'Invalid login credentials') {
            console.log('🔍 Invalid login credentials detected, checking user auth methods for:', email);
            
            // Check if user exists but doesn't have password
            const authMethods = await checkUserAuthMethods(email);
            console.log('🔍 Auth methods check result:', authMethods);
            
            if (authMethods.exists && !authMethods.hasPassword) {
              setLastAuthError('PASSWORD_SETUP_REQUIRED');
              console.log('🔐 User exists but needs password setup');
              setLoading(false);
              return false;
            } else if (authMethods.exists && authMethods.hasPassword) {
              setLastAuthError('WRONG_PASSWORD');
              console.log('🔐 User exists but wrong password provided');
              setLoading(false);
              return false;
            } else if (!authMethods.exists) {
              setLastAuthError('USER_NOT_FOUND');
              console.log('🔐 User does not exist');
              setLoading(false);
              return false;
            } else {
              // Fallback case
              setLastAuthError('GENERIC_ERROR');
              console.log('🔐 Unexpected auth methods result:', authMethods);
              setLoading(false);
              return false;
            }
          }
          
          setLastAuthError('GENERIC_ERROR');
          setLoading(false);
          // Continue to localStorage fallback
        }
      } catch (authError) {
        console.error('❌ Supabase auth exception:', authError);
        setLastAuthError('NETWORK_ERROR');
        setLoading(false);
        // Continue to localStorage fallback
      }
      
      // If Supabase login fails, try mock users (for demo accounts)
      console.log('🔄 Supabase login failed, trying localStorage fallback');
      const users = JSON.parse(localStorage.getItem('profit_users') || '[]');
      console.log('📦 LocalStorage users found:', users.length);
      
      const foundUser = users.find((u: LocalStorageUser) => u.email === email && u.password === password);
      console.log('🔍 LocalStorage user search result:', { 
        searchEmail: email, 
        foundUser: foundUser ? 'Found' : 'Not found',
        userId: foundUser?.id 
      });
      
      if (foundUser) {
        console.log('✅ LocalStorage login successful');
        const userData: User = {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          role: foundUser.role,
          plan: foundUser.plan,
          createdAt: foundUser.createdAt,
          lastLogin: new Date().toISOString()
        };
        setUser(userData);
        localStorage.setItem('profit_current_user', JSON.stringify(userData));
        setLoading(false);
        
        // Update last login in localStorage users
        const users = JSON.parse(localStorage.getItem('profit_users') || '[]');
        const updatedUsers = users.map((u: LocalStorageUser) => 
          u.id === foundUser.id ? { ...u, lastLogin: new Date().toISOString() } : u
        );
        localStorage.setItem('profit_users', JSON.stringify(updatedUsers));
        
        setLastAuthError(null);
        return true;
      }

      console.log('❌ Login failed on both Supabase and localStorage');
      if (!lastAuthError) {
        setLastAuthError('GENERIC_ERROR');
      }
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLastAuthError('NETWORK_ERROR');
      setLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      // Try Supabase registration
      try {
        setLoading(true);
        console.log('🔐 Starting Supabase registration for:', email);
        console.log('🔐 Password length:', password.length);
        console.log('🔐 Name provided:', name);
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name || email.split('@')[0],
              plan: 'free',
              email: email // Explicitly include email in metadata
            }
          }
        });
        
        console.log('🔐 Supabase registration response:', {
          hasUser: !!data.user,
          userId: data.user?.id,
          userEmail: data.user?.email,
          hasIdentities: (data.user?.identities?.length || 0) > 0,
          hasError: !!error,
          errorMessage: error?.message,
          errorCode: error?.name
        });
        
        if (data.user && !error) {
          if (data.user.identities && data.user.identities.length === 0) {
            // User already exists in Supabase
            console.log('⚠️ User already exists in Supabase');
            setLoading(false);
            return false;
          }
          
          // Registration successful
          const userData: User = {
            id: data.user.id,
            email: data.user.email || '',
            name: name || data.user.email?.split('@')[0] || 'Usuário',
            role: 'user',
            plan: 'free',
            createdAt: data.user.created_at || new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          
          setUser(userData);
          setSupabaseUser(data.user);
          localStorage.setItem('profit_current_user', JSON.stringify(userData));
          
          // Update last login for new user
          updateLastLogin(data.user.id);
          
          // Update last login in database
          updateLastLogin(session.user.id);
          setLoading(false);
          return true;
        } else if (error) {
          console.warn('Supabase registration error:', error);
          // If it's a 500 error or database error, fall back to localStorage
          if (error.message?.includes('Database error') || error.message?.includes('unexpected_failure')) {
            console.log('Supabase backend issue detected, using localStorage fallback');
            throw new Error('supabase_backend_error');
          }
          throw error;
        }
      } catch (supabaseError) {
        console.warn('Supabase registration failed, trying localStorage fallback:', supabaseError);
        
        // Check if it's a backend error (500, database error, etc.)
        const isBackendError = supabaseError instanceof Error && 
          (supabaseError.message?.includes('Database error') || 
           supabaseError.message?.includes('unexpected_failure') ||
           supabaseError.message === 'supabase_backend_error');
           
        if (isBackendError) {
          console.log('Supabase backend temporarily unavailable, using localStorage');
        }
      }
      
      // If Supabase fails, fallback to localStorage (for development)
      const users = JSON.parse(localStorage.getItem('profit_users') || '[]');
      
      // Check if user already exists
      if (users.some((u: LocalStorageUser) => u.email === email)) {
        setLoading(false);
        return false;
      }
      
      const newUser = {
        id: Date.now().toString(),
        email,
        password,
        name,
        role: 'user' as const,
        plan: 'free' as const,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('profit_users', JSON.stringify(users));
      
      const userData: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        plan: newUser.plan,
        createdAt: newUser.createdAt,
        lastLogin: newUser.lastLogin
      };
      
      setUser(userData);
      localStorage.setItem('profit_current_user', JSON.stringify(userData));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      setLoading(false);
      return false;
    }
  };

  const registerWithPhoneAndEmail = async (phone: string, email: string, password: string, name: string): Promise<boolean> => {
    try {
      setLoading(true);
      console.log('🔐 Starting unified phone/email registration for:', { phone, email, name });
      
      // Convert phone to E.164 format (required by Supabase)
      const formattedPhone = formatPhoneToE164(phone);
      console.log('📱 Phone format conversion:', { original: phone, formatted: formattedPhone });
      
      if (!formattedPhone) {
        console.error('❌ Invalid phone number format');
        setLoading(false);
        return false;
      }
      
      // First, register via phone with SMS verification
      const { data: phoneData, error: phoneError } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          data: {
            email,
            name,
            phone: formattedPhone,
            plan: 'free'
          }
        }
      });
      
      console.log('📱 Phone registration response:', {
        hasUser: !!phoneData?.user,
        hasError: !!phoneError,
        errorMessage: phoneError?.message,
        errorCode: phoneError?.name
      });
      
      if (phoneError) {
        console.error('❌ Phone registration error:', phoneError);
        setLoading(false);
        return false;
      }
      
      // Phone registration successful, now we need to set the password
      // This will be handled in the UI flow where user enters SMS code
      // and then sets their password
      
      // For now, return true to indicate the phone registration was successful
      // The password will be set later via the setPassword function
      setLoading(false);
      console.log('✅ Phone registration successful. User should receive SMS code.');
      return true;
      
    } catch (error) {
      console.error('❌ Unified registration error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out from Supabase:', error);
    }
    
    // Clear local state
    setUser(null);
    setSupabaseUser(null);
    localStorage.removeItem('profit_current_user');
    sessionStorage.clear();
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('profit_current_user', JSON.stringify(updatedUser));
      
      // Update in Supabase if user is authenticated there
      if (supabaseUser && userData.plan) {
        supabase
          .from('users')
          .update({ plan: userData.plan })
          .eq('id', supabaseUser.id)
          .then(({ data, error }) => {
            if (error) {
              console.error('Error updating user plan in Supabase:', error);
            } else {
              console.log('Plan updated successfully in Supabase:', data);
            }
          });
      }
      
      // Update in users list
      const users = JSON.parse(localStorage.getItem('profit_users') || '[]');
      const updatedUsers = users.map((u: LocalStorageUser) => 
        u.id === user.id ? { ...u, ...userData } : u
      );
      localStorage.setItem('profit_users', JSON.stringify(updatedUsers));
    }
  };

  const resetPassword = async (email: string): Promise<boolean> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password?token=`, // Replace with your reset password page URL
      });

      if (error) {
        console.error('Supabase password reset error:', error);
        setLoading(false);
        return false;
      }

      if (data) {
        console.log('Supabase password reset initiated for:', email);
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('Password reset error:', error);
      setLoading(false);
      return false;
    }
  };

  const setPassword = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('🔐 Setting password for user:', email);
      setLoading(true);
      
      // Check if user is authenticated
      const { data: { user: currentUser }, error: getUserError } = await supabase.auth.getUser();
      
      if (getUserError || !currentUser) {
        console.error('❌ User not authenticated, cannot set password');
        throw new Error('Usuário não está autenticado');
      }
      
      console.log('🔐 Current authenticated user:', currentUser.email, 'Setting password for:', email);
      
      // Update password for the currently authenticated user
      const { data, error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        console.error('❌ Supabase set password error:', error);
        throw new Error(error.message || 'Erro ao definir senha');
      }

      if (data?.user) {
        console.log('✅ Password set successfully for:', email);
        
        // Update user state to reflect that they now have email/password capability
        if (user) {
          setUser({
            ...user,
            // User can now login with email/password
          });
        }
        
        setLoading(false);
        return true;
      }

      setLoading(false);
      return false;
    } catch (error) {
      console.error('❌ Set password error:', error);
      setLoading(false);
      throw error; // Re-throw to let the UI handle the error message
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    registerWithPhoneAndEmail,
    logout,
    updateUser,
    resetPassword,
    setPassword,
    checkUserAuthMethods,
    lastAuthError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};