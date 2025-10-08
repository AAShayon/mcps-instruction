'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COLORS, COMPONENT_STYLES, GRADIENTS, TEXT_STYLES, ICON_STYLES } from '@/utils/colors';
import { TYPOGRAPHY } from '@/utils/typography';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [role, setRole] = useState('user'); // Default to 'user' to match backend expectations
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Registration attempt with:', { name, email }); // Debug log
    
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      console.log('Passwords do not match:', { 
        password: password.substring(0, 3) + '...', 
        passwordConfirmation: passwordConfirmation.substring(0, 3) + '...' 
      }); // Debug log
      return;
    }

    try {
      console.log('Initiating registration API call...'); // Debug log
      // Include all required fields for registration
      await register({ 
        name, 
        email, 
        password,
        password_confirmation: passwordConfirmation, // Add password confirmation
        role // Use the selected role from the form
      });
      console.log('Registration successful'); // Debug log
      setSuccess(true);
      // Redirect after a short delay to allow user to see success message
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Registration failed:', err); // Debug log
      setError(err.message || 'Registration failed');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className={`${COMPONENT_STYLES.card.base} text-center p-6`}>
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
              <span className={`${COLORS.text.white} text-2xl font-bold`}>✓</span>
            </div>
            <h2 className={`mt-6 ${TYPOGRAPHY.fontSize.h2} font-bold ${COLORS.text.primary}`}>Registration Successful!</h2>
            <p className={`mt-2 ${COLORS.text.secondary}`}>Redirecting to login page...</p>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Main Registration Card */}
        <div className={`${COMPONENT_STYLES.card.base} p-6`}>
          {/* Logo */}
          <div className="text-center">
            <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center">
              <span className={`${COLORS.text.white} text-2xl font-bold`}>A</span>
            </div>
            <h2 className={`mt-6 ${TYPOGRAPHY.fontSize.h1} font-bold ${COLORS.text.primary}`}>Create Account</h2>
            <p className={`mt-2 ${TYPOGRAPHY.fontSize.small} ${COLORS.text.secondary}`}>Sign up to get started</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && <div className={`${COLORS.status.error} ${TYPOGRAPHY.fontSize.small} text-center mb-4`}>{error}</div>}
            
            <div className="rounded-md shadow-sm space-y-4">
              <div>
                <label htmlFor="name" className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${COMPONENT_STYLES.input.base}`}
                />
              </div>
              <div>
                <label htmlFor="email" className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${COMPONENT_STYLES.input.base}`}
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${COMPONENT_STYLES.input.base}`}
                />
              </div>
              <div>
                <label htmlFor="passwordConfirmation" className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>
                  Confirm Password
                </label>
                <input
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  className={`${COMPONENT_STYLES.input.base}`}
                />
              </div>
              
              <div>
                <label htmlFor="role" className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className={`${COMPONENT_STYLES.input.base}`}
                >
                  <option value="user">Customer</option>
                  <option value="rider">Rider</option>
                  {/* Only admin can register as admin, so not including it in the options */}
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className={`ml-2 block ${TYPOGRAPHY.fontSize.small} ${COLORS.text.primary}`}>
                I agree to the <a href="#" className={`${COLORS.primary.main} font-medium hover:underline`}>Terms and Conditions</a>
              </label>
            </div>

            <div>
              <button
                type="submit"
                className={`${COMPONENT_STYLES.button.primary} w-full`}
                disabled={!name || !email || !password || !passwordConfirmation || !role}
              >
                Create Account
              </button>
            </div>
          </form>

          <div className={`mt-6 text-center ${TYPOGRAPHY.fontSize.small} ${COLORS.text.secondary}`}>
            <p>
              Already have an account?{' '}
              <Link href="/login" className={`${COLORS.primary.main} font-medium hover:underline transition-colors duration-300`}>
                Sign in
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
