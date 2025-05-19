import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Check} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toaster';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [orderProcessed, setOrderProcessed] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'razorpay'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // Redirect if cart is empty
    if (items.length === 0 && !orderProcessed) {
      toast.error('Your cart is empty');
      navigate('/cart');
    }
  }, [items, navigate, orderProcessed]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Enter a valid 10-digit phone number';
    
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Enter a valid 6-digit PIN code';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly');
      return;
    }
    
    if (formData.paymentMethod === 'razorpay') {
      initiateRazorpayPayment();
    }
  };

  const initiateRazorpayPayment = () => {
    setLoading(true);
    
    // In a real app, you would make an API call to your backend to create an order
    // For demo purposes, we'll simulate this process
    setTimeout(() => {
      const totalAmount = getTotalPrice();
      
      // Razorpay options
      const options = {
        key: 'rzp_live_GIBslYsNBw95Lg', // Replace with your actual Razorpay key
        amount: totalAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'SmartShop',
        description: 'Purchase from SmartShop',
        image: 'https://images.pexels.com/photos/8566657/pexels-photo-8566657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: formData.address,
          items: JSON.stringify(items.map(item => ({
            id: item.product.id,
            name: item.product.name,
            quantity: item.quantity
          })))
        },
        theme: {
          color: '#4F46E5'
        },
        handler: function(response: any) {
          handlePaymentSuccess(response);
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast.info('Payment cancelled');
          }
        }
      };
      
      try {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } catch (error) {
        console.error('Razorpay error:', error);
        toast.error('Failed to initialize payment. Please try again.');
        setLoading(false);
      }
    }, 1000);
  };

  const handlePaymentSuccess = (response: any) => {
    const paymentId = response.razorpay_payment_id;
    setPaymentId(paymentId);
    
    // Save order to localStorage
    const orderData = {
      id: `order-${Date.now()}`,
      userId: user?.id,
      items: items.map(item => ({
        product: item.product,
        quantity: item.quantity,
        price: item.product.price
      })),
      totalAmount: getTotalPrice(),
      paymentId: paymentId,
      paymentMethod: 'Razorpay',
      status: 'success',
      date: new Date().toISOString(),
      shippingAddress: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    };
    
    // Get existing orders or initialize empty array
    const existingOrders = JSON.parse(localStorage.getItem(`orders_${user?.id}`) || '[]');
    localStorage.setItem(`orders_${user?.id}`, JSON.stringify([...existingOrders, orderData]));
    
    // Clear cart
    clearCart();
    
    // Show success state
    setOrderProcessed(true);
    setLoading(false);
    toast.success('Payment successful! Your order has been placed.');
  };

  if (orderProcessed) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-success-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your payment has been processed successfully.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">{paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium">₹{getTotalPrice().toFixed(2)}</span>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8">
              You can visit the store and show this confirmation to collect your items.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/history')}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                View Order History
              </button>
              <button
                onClick={() => navigate('/products')}
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Contact Information</h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className={`w-full p-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              <div className="p-6 border-t border-b border-gray-200">
                <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Address*
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={`w-full p-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City*
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                        State*
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full p-2 border rounded-md ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                      >
                        <option value="">Select State</option>
                        <option value="Andhra Pradesh">Andhra Pradesh</option>
                        <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                        <option value="Assam">Assam</option>
                        <option value="Bihar">Bihar</option>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Goa">Goa</option>
                        <option value="Gujarat">Gujarat</option>
                        <option value="Haryana">Haryana</option>
                        <option value="Himachal Pradesh">Himachal Pradesh</option>
                        <option value="Jharkhand">Jharkhand</option>
                        <option value="Karnataka">Karnataka</option>
                        <option value="Kerala">Kerala</option>
                        <option value="Madhya Pradesh">Madhya Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Manipur">Manipur</option>
                        <option value="Meghalaya">Meghalaya</option>
                        <option value="Mizoram">Mizoram</option>
                        <option value="Nagaland">Nagaland</option>
                        <option value="Odisha">Odisha</option>
                        <option value="Punjab">Punjab</option>
                        <option value="Rajasthan">Rajasthan</option>
                        <option value="Sikkim">Sikkim</option>
                        <option value="Tamil Nadu">Tamil Nadu</option>
                        <option value="Telangana">Telangana</option>
                        <option value="Tripura">Tripura</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Uttarakhand">Uttarakhand</option>
                        <option value="West Bengal">West Bengal</option>
                      </select>
                      {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                        PIN Code*
                      </label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="6-digit PIN code"
                        className={`w-full p-2 border rounded-md ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                      />
                      {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 border border-primary-200 bg-primary-50 rounded-lg cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={formData.paymentMethod === 'razorpay'}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <div className="ml-3 flex items-center">
                      <CreditCard className="h-5 w-5 text-primary-600 mr-2" />
                      <span className="font-medium">Pay with Razorpay</span>
                    </div>
                    <div className="ml-auto flex items-center space-x-2">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">UPI</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">Cards</span>
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">NetBanking</span>
                    </div>
                  </label>
                  
                  
                </div>
              </div>
            </form>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              
              <div className="max-h-80 overflow-y-auto mb-4">
                {items.map((item) => (
                  <div key={item.product.id} className="flex py-3 border-b border-gray-100">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="text-sm">{item.product.name}</h3>
                          <p className="ml-4">₹{item.product.price}</p>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{item.product.brand}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-xs">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                        <p className="text-gray-500">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <p>Subtotal</p>
                  <p>₹{getTotalPrice().toFixed(2)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>Shipping</p>
                  <p className="text-success-600">Free</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>Taxes</p>
                  <p>Included</p>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                  <p>Total</p>
                  <p>₹{getTotalPrice().toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay ₹{getTotalPrice().toFixed(2)}
                    </>
                  )}
                </button>
              </div>
              
              <div className="mt-6 flex items-center">
                <Truck className="h-5 w-5 text-gray-400 mr-2" />
                <p className="text-sm text-gray-600">
                  Visit the store to collect your items after payment
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;