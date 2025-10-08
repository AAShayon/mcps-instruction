'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

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
      const response = await api.put('/user', editData);
      setUserData({ ...userData, ...editData });
      // Update the first name and last name in address if it matches
      if (!addressData.first_name) {
        setAddressData({
          ...addressData,
          first_name: editData.name?.split(' ')[0] || '',
          last_name: editData.name?.split(' ').slice(1).join(' ') || '',
          email: editData.email,
          phone: editData.phone,
        });
      }
    } catch (error) {
      console.error('Error updating user data:', error);
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
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">User data not found. Please login again.</p>
          <button 
            onClick={() => router.push('/login')}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
      <div className="bg-red-600 text-white text-sm py-2">
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
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {/* Logo */}
              <div className="text-2xl font-bold text-red-600 mr-10">
                ansteches<span className="text-black">.shop</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <button 
                onClick={handleLogout}
                className="text-gray-700 hover:text-red-600 flex items-center"
              >
                <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-6 text-white">
              <div className="flex items-center">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-red-600 text-3xl font-bold mr-6">
                  {userData.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{userData.name}</h1>
                  <p className="text-red-100">{userData.email}</p>
                  <p className="text-red-100">Member since {new Date(userData.created_at).getFullYear()}</p>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Profile Information</h2>
                <button
                  onClick={handleEditToggle}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  {editing ? 'Save' : 'Edit Profile'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                  {editing ? (
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                  {editing ? (
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Phone Number</label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                    />
                  ) : (
                    <p className="text-gray-900">{userData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Account Type</label>
                  <p className="text-gray-900 capitalize">{userData.role}</p>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">Member Since</label>
                  <p className="text-gray-900">{new Date(userData.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-fit">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Account Actions</h3>
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
        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">Address Information</h2>
              <button
                onClick={handleAddressEditToggle}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                {editingAddress ? 'Save Address' : 'Edit Address'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">First Name</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="first_name"
                    value={addressData.first_name}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.first_name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Last Name</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="last_name"
                    value={addressData.last_name}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.last_name}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                {editingAddress ? (
                  <input
                    type="email"
                    name="email"
                    value={addressData.email}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.email}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Phone</label>
                {editingAddress ? (
                  <input
                    type="tel"
                    name="phone"
                    value={addressData.phone}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.phone}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Address Line 1</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="address_line_1"
                    value={addressData.address_line_1}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.address_line_1}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 text-sm font-medium mb-2">Address Line 2</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="address_line_2"
                    value={addressData.address_line_2}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.address_line_2 || 'N/A'}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">City</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="city"
                    value={addressData.city}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.city}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">State</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="state"
                    value={addressData.state}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.state}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Postal Code</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="postal_code"
                    value={addressData.postal_code}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.postal_code}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Country</label>
                {editingAddress ? (
                  <input
                    type="text"
                    name="country"
                    value={addressData.country}
                    onChange={handleAddressInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-600 text-gray-900"
                  />
                ) : (
                  <p className="text-gray-900">{addressData.country}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Default Address</label>
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
                  <p className="text-gray-900">{addressData.is_default ? 'Yes' : 'No'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2025 ansteches.shop. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}