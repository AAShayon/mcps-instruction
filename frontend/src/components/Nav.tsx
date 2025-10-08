'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { COLORS, COMPONENT_STYLES, GRADIENTS, TEXT_STYLES, ICON_STYLES } from '@/utils/colors';
import { TYPOGRAPHY } from '@/utils/typography';

export default function Nav() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className={`${COMPONENT_STYLES.card.base} shadow-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className={`text-xl font-bold ${COLORS.text.primary}`}>
              ansteches.shop
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {token ? (
              <>
                <Link href="/profile" className={`${COLORS.text.secondary} hover:text-gray-900`}>
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className={`${COLORS.text.secondary} hover:text-gray-900`}
                >
                  Logout
                </button>
                <Link href="/profile" className="flex-shrink-0">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                    <span className={`${COLORS.text.secondary}`}>{user?.name?.charAt(0) || 'U'}</span>
                  </div>
                </Link>
              </>
            ) : (
              <Link href="/login" className={`${COLORS.text.secondary} hover:text-gray-900`}>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                  <span className={`${COLORS.text.secondary}`}>Login</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}