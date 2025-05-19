import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronLeft, Edit2, LogOut, History, Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toaster';

const Profile: React.FC = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
  }, [user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    
    updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address
    });
    
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
    toast.info('You have been logged out');
  };
  
  // Get order count from localStorage
  const getOrderCount = () => {
    if (!user) return 0;
    
    const orders = localStorage.getItem(`orders_${user.id}`);
    if (!orders) return 0;
    
    try {
      return JSON.parse(orders).length;
    } catch (error) {
      console.error('Error parsing orders:', error);
      return 0;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary-600 mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">My Profile</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 text-center border-b border-gray-200">
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
                  <User className="h-12 w-12 text-primary-600" />
                </div>
                <h2 className="text-xl font-semibold">{user?.name}</h2>
                <p className="text-gray-600 mt-1">{user?.email}</p>
                
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-600">{getOrderCount()}</p>
                    <p className="text-sm text-gray-600">Orders</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-accent-500">
                      {localStorage.getItem(`wishlist_${user?.id}`) 
                        ? JSON.parse(localStorage.getItem(`wishlist_${user?.id}`) || '[]').length 
                        : 0}
                    </p>
                    <p className="text-sm text-gray-600">Wishlist</p>
                  </div>
                </div>
                
                <div className="mt-6 space-y-3">
                  <Link 
                    to="/history" 
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <History className="h-5 w-5 mr-3 text-gray-500" />
                    <span>Order History</span>
                  </Link>
                  <Link 
                    to="/wishlist" 
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Heart className="h-5 w-5 mr-3 text-gray-500" />
                    <span>My Wishlist</span>
                  </Link>
                  <Link 
                    to="/cart" 
                    className="flex items-center p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <ShoppingBag className="h-5 w-5 mr-3 text-gray-500" />
                    <span>My Cart</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Profile Details / Edit Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">
                  {isEditing ? 'Edit Profile' : 'Profile Details'}
                </h2>
              </div>
              
              {isEditing ? (
                <form onSubmit={handleSubmit} className="p-6">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit mobile number"
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full p-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          // Reset form data to user data
                          if (user) {
                            setFormData({
                              name: user.name || '',
                              email: user.email || '',
                              phone: user.phone || '',
                              address: user.address || ''
                            });
                          }
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="p-6">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-4 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{user?.name}</dd>
                    </div>
                    <div className="py-4 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Email Address</dt>
                      <dd className="text-sm text-gray-900 col-span-2">{user?.email}</dd>
                    </div>
                    <div className="py-4 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {user?.phone || <span className="text-gray-400">Not provided</span>}
                      </dd>
                    </div>
                    <div className="py-4 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Address</dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {user?.address || <span className="text-gray-400">Not provided</span>}
                      </dd>
                    </div>
                    <div className="py-4 grid grid-cols-3">
                      <dt className="text-sm font-medium text-gray-500">Account Created</dt>
                      <dd className="text-sm text-gray-900 col-span-2">
                        {new Date().toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;