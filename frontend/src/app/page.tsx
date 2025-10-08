'use client';

import { useState, useEffect, useRef } from 'react';
import { getProducts } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COLORS, COMPONENT_STYLES, GRADIENTS, TEXT_STYLES } from '@/utils/colors';
import { TYPOGRAPHY } from '@/utils/typography';

async function getProductsData() {
  try {
    // For server-side requests in Next.js, we should make direct HTTP calls
    // instead of using client-side libraries like axios 
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const apiUrl = `${baseUrl}/api`;
    
    // Using fetch for server-side data fetching
    const response = await fetch(`${apiUrl}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      // Ensure we're not caching server-side requests
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    // The backend returns the array directly, not in a data wrapper
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProductsData();
      setProducts(data);
      setLoading(false);
    }
    
    loadProducts();
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100">
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

      {/* Header */}
      <header className={`${COLORS.background.card} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Logo */}
              <div className={`text-2xl font-bold ${COLORS.primary.main} mr-10`}>
                ansteches<span className={`${COLORS.text.black}`}>.shop</span>
              </div>
              
              {/* Search Bar */}
              <div className="flex-grow max-w-2xl">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Find your favorite products"
                    className={`w-full px-4 py-2 border ${COLORS.border.main} rounded-l-lg focus:outline-none focus:ring-1 focus:ring-red-600 ${COLORS.text.secondary}`}
                  />
                  <button className={`bg-red-600 ${COLORS.text.white} px-6 py-2 rounded-r-lg hover:bg-red-700`}>
                    Search
                  </button>
                </div>
              </div>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <svg className={`w-6 h-6 mr-1 ${COLORS.text.secondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span className={`${COLORS.text.secondary}`}>Cart</span>
              </div>
              
              {token ? (
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="flex items-center cursor-pointer"
                    onClick={toggleDropdown}
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center ${COLORS.text.white} font-bold`}>
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                  </div>
                  
                  {/* Dropdown Menu - Now properly controlled by state */}
                  {dropdownOpen && (
                    <div className={`${COMPONENT_STYLES.dropdown.base}`}>
                      <Link href="/profile" className={`${COMPONENT_STYLES.dropdown.item}`} onClick={() => setDropdownOpen(false)}>Profile</Link>
                      <Link href="/orders" className={`${COMPONENT_STYLES.dropdown.item}`} onClick={() => setDropdownOpen(false)}>My Orders</Link>
                      <Link href="/settings" className={`${COMPONENT_STYLES.dropdown.item}`} onClick={() => setDropdownOpen(false)}>Settings</Link>
                      <button 
                        onClick={handleLogout}
                        className={`block w-full text-left px-4 py-2 text-sm ${COLORS.text.secondary} hover:bg-gray-100`}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className={`flex items-center ${COLORS.text.secondary} hover:text-red-600`}>
                  <svg className={`w-6 h-6 mr-1 ${COLORS.text.secondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  <span className={`${COLORS.text.secondary}`}>Login</span>
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 py-2">
            <div className="flex items-center">
              <svg className={`w-5 h-5 mr-2 ${COLORS.text.secondary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
              <span className={`font-medium ${COLORS.text.secondary}`}>All Categories</span>
            </div>
            <a href="#" className={`${COLORS.text.secondary} hover:text-red-600`}>Home</a>
            <a href="#" className={`${COLORS.text.secondary} hover:text-red-600`}>Deals</a>
            <a href="#" className={`${COLORS.text.secondary} hover:text-red-600`}>Electronics</a>
            <a href="#" className={`${COLORS.text.secondary} hover:text-red-600`}>Fashion</a>
            <a href="#" className={`${COLORS.text.secondary} hover:text-red-600`}>Home & Garden</a>
            <a href="#" className={`${COLORS.text.secondary} hover:text-red-600`}>Books</a>
            <a href="#" className={`${COLORS.text.secondary} hover:text-red-600`}>More</a>
          </div>
        </div>
      </header>

      <main>
        {/* Banner Carousel */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className={`${GRADIENTS.primary} rounded-lg p-8 ${COLORS.text.white}`}>
            <div className="max-w-md">
              <h1 className="text-3xl font-bold mb-2">Special Offers!</h1>
              <p className="text-lg mb-4">Get up to 50% off on selected items</p>
              <button className={`bg-white ${COLORS.primary.main} font-bold py-2 px-6 rounded hover:bg-gray-100`}>
                Shop Now
              </button>
            </div>
          </div>
        </div>

        {/* Featured Products */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`${TYPOGRAPHY.fontSize.h2} font-bold ${COLORS.text.primary}`}>Featured Products</h2>
            <a href="#" className={`${COLORS.primary.main} hover:underline`}>See All</a>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.map((product: any) => (
              <div key={product.id} className={`${COMPONENT_STYLES.card.base} ${COMPONENT_STYLES.card.hover}`}>
                <div className="p-4">
                  {product.image_path ? (
                    <img 
                      src={product.image_path} 
                      alt={product.name} 
                      className="w-full h-40 object-contain"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <span className={`${COLORS.text.tertiary}`}>No Image</span>
                    </div>
                  )}
                  <div className="mt-4">
                    <h3 className={`font-medium ${COLORS.text.primary} line-clamp-2 h-12`}>{product.name}</h3>
                    <p className={`${TYPOGRAPHY.fontSize.small} ${COLORS.text.tertiary} mt-1`}>by Daraz Mall</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-lg font-bold ${COLORS.primary.main}`}>${product.price}</span>
                      {product.discount_price && (
                        <span className={`ml-2 ${TYPOGRAPHY.fontSize.small} ${COLORS.text.tertiary} line-through`}>${product.price}</span>
                      )}
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                          </svg>
                        ))}
                      </div>
                      <span className={`text-xs ${COLORS.text.tertiary} ml-1`}>4.5</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h2 className={`${TYPOGRAPHY.fontSize.h2} font-bold ${COLORS.text.primary} mb-6`}>Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Beauty', 'Sports'].map((category, index) => (
              <div key={index} className={`${COMPONENT_STYLES.card.base} ${COMPONENT_STYLES.card.hover} text-center`}>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                  <span className={`${COLORS.text.secondary}`}>C{index+1}</span>
                </div>
                <p className="font-medium">{category}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${COLORS.background.footer} ${COLORS.text.white} py-12`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className={`${TYPOGRAPHY.fontSize.h3} font-bold mb-4`}>Help & Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Payment Methods</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Delivery</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Buyer Protection</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Customer Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`${TYPOGRAPHY.fontSize.h3} font-bold mb-4`}>About Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>About ansteches.shop</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Careers</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Terms & Conditions</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`${TYPOGRAPHY.fontSize.h3} font-bold mb-4`}>Follow Us</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Facebook</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Instagram</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>Twitter</a></li>
                <li><a href="#" className={`${COLORS.text.light} hover:text-white`}>YouTube</a></li>
              </ul>
            </div>
            <div>
              <h3 className={`${TYPOGRAPHY.fontSize.h3} font-bold mb-4`}>Payment Methods</h3>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'Master', 'PayPal', 'COD'].map((method, index) => (
                  <div key={index} className="bg-gray-700 px-3 py-1 rounded text-sm">
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p>&copy; 2025 ansteches.shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}