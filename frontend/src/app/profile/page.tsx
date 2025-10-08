'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { COLORS, COMPONENT_STYLES, GRADIENTS, TEXT_STYLES, ICON_STYLES, STYLE_UTILITIES } from '@/utils/colors';
import { TYPOGRAPHY } from '@/utils/typography';

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    email: '',
    phone: '',
    profile_image: null as File | null,
  });
  const [addressData, setAddressData] = useState({
    id: null,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Bangladesh', // Default country
    is_default: true,
  });
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await api.get('/user');
        setUserData(response.data);
        setEditData({
          name: response.data.name || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          profile_image: null, // Initialize as null for file input
        });
        
        // Fetch addresses
        const addressResponse = await api.get('/user-addresses');
        setAddresses(addressResponse.data.data || addressResponse.data || []);
        
        // Load first address if exists
        if ((addressResponse.data.data || addressResponse.data || []).length > 0) {
          const firstAddress = (addressResponse.data.data || addressResponse.data || [])[0];
          setAddressData({
            id: firstAddress.id,
            first_name: firstAddress.first_name || response.data.name?.split(' ')[0] || '',
            last_name: firstAddress.last_name || response.data.name?.split(' ').slice(1).join(' ') || '',
            email: firstAddress.email || response.data.email || '',
            phone: firstAddress.phone || response.data.phone || '',
            address_line_1: firstAddress.address_line_1 || '',
            address_line_2: firstAddress.address_line_2 || '',
            city: firstAddress.city || '',
            state: firstAddress.state || '',
            postal_code: firstAddress.postal_code || '',
            country: firstAddress.country || 'Bangladesh',
            is_default: firstAddress.is_default || true,
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [token, logout, router]);

  const handleEditToggle = () => {
    if (editing) {
      // Save profile changes
      handleSaveProfile();
    }
    setEditing(!editing);
  };

  const handleSaveProfile = async () => {
    try {
      // Create form data object to handle file uploads
      const formData = new FormData();
      
      // Ensure we use the current values from the form inputs
      // Using the editData values which should contain the current form state
      const nameValue = editData.name?.trim() || userData?.name?.trim() || '';
      const emailValue = editData.email?.trim() || userData?.email?.trim() || '';
      const phoneValue = editData.phone || userData?.phone || '';
      
      console.log('Profile update data:', { 
        name: nameValue, 
        email: emailValue, 
        phone: phoneValue, 
        hasProfileImage: !!editData.profile_image,
        editData: editData, // Log the entire editData for debugging
        userData: userData  // Log the entire userData for debugging
      });
      
      // Explicitly append all required fields to the form data
      formData.append('name', nameValue);
      formData.append('email', emailValue);
      formData.append('phone', phoneValue || ''); // Ensure it's a string
      
      // Only append profile image if a new one was selected
      if (editData.profile_image) {
        formData.append('profile_image', editData.profile_image);
        console.log('Adding profile image to form data:', editData.profile_image.name);
      }

      const response = await api.put('/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUserData({ ...userData, ...response.data });
      
      // Update the first name and last name in address if it matches
      if (!addressData.first_name) {
        setAddressData({
          ...addressData,
          first_name: response.data.name?.split(' ')[0] || '',
          last_name: response.data.name?.split(' ').slice(1).join(' ') || '',
          email: response.data.email,
          phone: response.data.phone,
        });
      }
      
      // Show success message
      alert('Profile updated successfully!');
    } catch (error: any) {
      console.error('Error updating user data:', error);
      let errorMessage = 'Error updating profile';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } 
      if (error.response?.data?.errors) {
        // Handle validation errors specifically
        const errors = error.response.data.errors;
        const errorMessages = [];
        for (const [field, messages] of Object.entries(errors)) {
          if (Array.isArray(messages)) {
            errorMessages.push(...messages);
          } else {
            errorMessages.push(messages);
          }
        }
        errorMessage = errorMessages.join(', ');
      }
      alert(errorMessage);
    }
  };

  const handleAddressEditToggle = () => {
    if (editingAddress) {
      // Save address changes
      handleSaveAddress();
    }
    setEditingAddress(!editingAddress);
  };

  const handleSaveAddress = async () => {
    try {
      let response;
      if (addressData.id) {
        // Update existing address
        response = await api.put(`/user-addresses/${addressData.id}`, addressData);
      } else {
        // Create new address
        response = await api.post('/user-addresses', addressData);
        // Update the address ID in state
        setAddressData({...response.data});
      }
      
      // Refresh addresses list
      const addressResponse = await api.get('/user-addresses');
      setAddresses(addressResponse.data.data || addressResponse.data || []);
      
      // Show success message
      alert('Address updated successfully!');
    } catch (error) {
      console.error('Error updating address:', error);
      alert('Error updating address: ' + (error.response?.data?.message || 'Please try again'));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddressData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className={`mt-4 ${COLORS.text.secondary}`}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className={`${COLORS.text.secondary}`}>User data not found. Please login again.</p>
          <button 
            onClick={() => router.push('/login')}
            className={`${COMPONENT_STYLES.button.primary} mt-4`}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

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
      <header className={`${COMPONENT_STYLES.card.base} shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Logo */}
              <div className={`text-2xl font-bold ${COLORS.primary.main} mr-10`}>
                ansteches<span className={`${COLORS.text.black}`}>.shop</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleLogout}
                className={`${COLORS.text.secondary} hover:text-red-600 flex items-center`}
              >
                <svg className={`w-6 h-6 mr-1 ${ICON_STYLES.primary}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info Card */}
          <div className={`${COMPONENT_STYLES.card.base} overflow-hidden`}>
            {/* Profile Header */}
            <div className={`${GRADIENTS.primary} p-6 ${COLORS.text.white}`}>
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-red-600 text-3xl font-bold mr-6">
                  {userData.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h1 className={`text-2xl font-bold`}>{userData.name}</h1>
                  <p className="text-red-100">{userData.email}</p>
                  <p className="text-red-100">Member since {new Date(userData.created_at).getFullYear()}</p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`${TYPOGRAPHY.fontSize.h3} font-bold ${COLORS.text.primary}`}>Profile Information</h2>
                <button
                  onClick={handleEditToggle}
                  className={`${COMPONENT_STYLES.button.primary}`}
                >
                  {editing ? 'Save' : 'Edit Profile'}
                </button>
              </div>

              <div className="flex flex-col items-center mb-6">
                <div className="relative">
                  {userData.profile_image ? (
                    <img 
                      src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${userData.profile_image}`} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-600">
                        {userData.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                  {editing && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow cursor-pointer">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setEditData({...editData, profile_image: file});
                            }
                          }}
                        />
                        <svg 
                          className="w-6 h-6 text-gray-600" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                          />
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </label>
                    </div>
                  )}
                </div>
                {editing && editData.profile_image && (
                  <p className="mt-2 text-sm text-gray-600">Selected: {editData.profile_image.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className={`${COMPONENT_STYLES.input.base}`}
                    />
                  ) : (
                    <p className={`${COLORS.text.primary}`}>{userData.name}</p>
                  )}
                </div>

                <div>
                  <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Email Address</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className={`${COMPONENT_STYLES.input.base}`}
                    />
                  ) : (
                    <p className={`${COLORS.text.primary}`}>{userData.email}</p>
                  )}
                </div>

                <div>
                  <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className={`${COMPONENT_STYLES.input.base}`}
                    />
                  ) : (
                    <p className={`${COLORS.text.primary}`}>{userData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Account Type</label>
                  <p className={`${COLORS.text.primary} capitalize`}>{userData.role}</p>
                </div>

                <div>
                  <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Member Since</label>
                  <p className={`${COLORS.text.primary}`}>{new Date(userData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions Card */}
          <div className={`${COMPONENT_STYLES.card.base} h-fit overflow-hidden`}>
            <div className="p-6">
              <h3 className={`${TYPOGRAPHY.fontSize.h4} font-medium ${COLORS.text.primary} mb-4`}>Account Actions</h3>
              <div className="space-y-4">
                <button 
                  onClick={() => router.push('/orders')}
                  className="w-full border border-gray-300 rounded-lg p-4 text-left hover:border-red-500 hover:text-red-600 transition-colors text-gray-700"
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                    </svg>
                    <span>My Orders</span>
                  </div>
                </button>
                <button 
                  onClick={() => router.push('/orders')}
                  className="w-full border border-gray-300 rounded-lg p-4 text-left hover:border-red-500 hover:text-red-600 transition-colors text-gray-700"
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Order History</span>
                  </div>
                </button>
                <button 
                  onClick={() => router.push('/profile')}
                  className="w-full border border-gray-300 rounded-lg p-4 text-left hover:border-red-500 hover:text-red-600 transition-colors text-gray-700"
                >
                  <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span>Settings</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information Section */}
        <div className={`${COMPONENT_STYLES.card.base} overflow-hidden mt-6`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`${TYPOGRAPHY.fontSize.h3} font-bold ${COLORS.text.primary}`}>Address Information</h2>
              <button
                onClick={handleAddressEditToggle}
                className={`${COMPONENT_STYLES.button.primary}`}
              >
                {editingAddress ? 'Save Address' : 'Edit Address'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>First Name</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="first_name"
                    value={addressData.first_name}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.first_name}</p>
                )}
              </div>

              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Last Name</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="last_name"
                    value={addressData.last_name}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.last_name}</p>
                )}
              </div>

              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Email</label>
                {editingAddress ? (
                  <input
                    type="email"
                    name="email"
                    value={addressData.email}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.email}</p>
                )}
              </div>

              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Phone</label>
                {editingAddress ? (
                  <input
                    type="tel"
                    name="phone"
                    value={addressData.phone}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Address Line 1</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="address_line_1"
                    value={addressData.address_line_1}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.address_line_1}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Address Line 2</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="address_line_2"
                    value={addressData.address_line_2}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.address_line_2 || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>City</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.city}</p>
                )}
              </div>

              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>State</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.state}</p>
                )}
              </div>

              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Postal Code</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="postal_code"
                    value={addressData.postal_code}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.postal_code}</p>
                )}
              </div>

              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Country</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressInputChange}
                    className={`${COMPONENT_STYLES.input.base}`}
                  />
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.country}</p>
                )}
              </div>

              <div>
                <label className={`block ${COLORS.text.secondary} ${TYPOGRAPHY.fontSize.small} font-medium mb-2`}>Default Address</label>
                {editingAddress ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_default"
                      checked={addressData.is_default}
                      onChange={(e) => setAddressData({...addressData, is_default: e.target.checked})}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-gray-700">Set as default</span>
                  </div>
                ) : (
                  <p className={`${COLORS.text.primary}`}>{addressData.is_default ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`${COLORS.background.footer} ${COLORS.text.white} py-8 mt-12`}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className={`${TYPOGRAPHY.fontSize.small}`}>&copy; 2025 ansteches.shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}