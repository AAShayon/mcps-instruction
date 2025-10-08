'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COLORS, COMPONENT_STYLES, GRADIENTS, TEXT_STYLES, ICON_STYLES } from '@/utils/colors';
import { TYPOGRAPHY } from '@/utils/typography';

export default function Login() {
  const [loginInput, setLoginInput] = useState(''); // Can be email or phone
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted with:', { loginInput, password: '***' }); // Don't log actual password
    
    try {
      console.log('Initiating login API call...'); // Debug log
      await login(loginInput, password);
      console.log('Login successful, redirecting to home...');
      router.push('/'); // Redirect to home after login
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Top Bar */}
        <div className={`${COLORS.background.main} ${COLORS.text.white} text-sm py-2`}>
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <span>Sell on ansteches</span>
              <span>|</span>
              <span>Help & Support</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>Customer Service</span>
              <span>|</span>
              <span>Download App</span>
            </div>
          </div>
        </div>

        {/* Main Login Card */}
        <div className={`${COMPONENT_STYLES.card.base} p-6`}>
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center">
              <span className={`${COLORS.text.white} text-2xl font-bold`}>A</span>
            </div>
            <h2 className={`mt-6 ${TYPOGRAPHY.fontSize.h1} font-bold ${COLORS.text.primary}`}>Welcome Back</h2>
            <p className={`mt-2 ${TYPOGRAPHY.fontSize.small} ${COLORS.text.secondary}`}>Sign in to your account</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className={`${COLORS.status.error} ${TYPOGRAPHY.fontSize.small} text-center mb-4`}>{error}</div>}
            
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="login" className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>
                  Email or Phone
                </label>
                <input
                  id="login"
                  name="login"
                  type="text"
                  autoComplete="username"
                  required
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className={`${COMPONENT_STYLES.input.base}`}
                  placeholder="Enter email or phone number"
                />
              </div>
              <div>
                <label htmlFor="password" className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${COMPONENT_STYLES.input.base}`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className={`ml-2 block ${TYPOGRAPHY.fontSize.small} ${COLORS.text.primary}`}>
                  Remember me
                </label>
              </div>
              <div className={`${TYPOGRAPHY.fontSize.small}`}>
                <a href="#" className={`${COLORS.primary.main} hover:underline`}>Forgot Password?</a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className={`${COMPONENT_STYLES.button.primary} w-full`}
                disabled={!loginInput || !password}
              >
                Sign In
              </button>
            </div>
          </form>

          <div className={`mt-6 text-center ${TYPOGRAPHY.fontSize.small} ${COLORS.text.secondary}`}>
            <p>
              Don't have an account?{' '}
              <Link href="/register" className={`${COLORS.primary.main} font-medium hover:underline`}>
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className={`${COLORS.background.footer} ${COLORS.text.white} py-8 mt-12`}>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className={`${TYPOGRAPHY.fontSize.small}`}>© 2025 ansteches.shop. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
