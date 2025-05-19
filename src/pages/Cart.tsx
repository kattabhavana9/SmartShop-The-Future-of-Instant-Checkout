import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash, ChevronLeft, AlertCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toaster';

const Cart: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
    toast.info('Item removed from cart');
  };

  const handleClearCart = () => {
    clearCart();
    toast.info('Cart cleared');
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed to checkout');
      navigate('/login');
      return;
    }
    
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    setLoading(true);
    
    // Simulating a checkout process
    setTimeout(() => {
      setLoading(false);
      navigate('/checkout');
    }, 1000);
  };

  // Calculate total items and savings
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalSavings = items.reduce((total, item) => {
    const product = item.product;
    if (product.mrp && product.price < product.mrp) {
      return total + ((product.mrp - product.price) * item.quantity);
    }
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary-600 mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6 flex justify-center">
              <ShoppingCart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">
                      Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
                    </h2>
                    <button
                      onClick={handleClearCart}
                      className="text-sm text-red-600 hover:text-red-800 flex items-center"
                    >
                      <Trash className="h-4 w-4 mr-1" />
                      Clear Cart
                    </button>
                  </div>
                </div>

                <ul className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <li key={item.product.id} className="p-6 flex flex-col sm:flex-row">
                      <div className="sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-md mb-4 sm:mb-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="sm:ml-6 flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-base font-medium text-gray-900">
                              <Link to={`/products/${item.product.id}`} className="hover:text-primary-600">
                                {item.product.name}
                              </Link>
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                            <p className="mt-1 text-sm text-gray-500">
                              {item.product.weight || item.product.unit}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-base font-medium text-gray-900">
                              ₹{item.product.price}
                            </p>
                            {item.product.mrp && item.product.price < item.product.mrp && (
                              <p className="text-sm text-gray-500 line-through">
                                ₹{item.product.mrp}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-end mt-4">
                          <div className="flex items-center border border-gray-300 rounded">
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                              className="px-3 py-1 border-r border-gray-300 text-gray-600 hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="px-4 py-1">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="px-3 py-1 border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="text-sm text-red-600 hover:text-red-800 flex items-center"
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Continue Shopping */}
              <div className="flex justify-between items-center">
                <Link to="/products" className="text-primary-600 hover:text-primary-800 flex items-center">
                  <ChevronLeft className="h-5 w-5 mr-1" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-base">
                    <p>Subtotal</p>
                    <p>₹{getTotalPrice().toFixed(2)}</p>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-success-600">
                      <p>Savings</p>
                      <p>-₹{totalSavings.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold">
                    <p>Total (incl. taxes)</p>
                    <p>₹{getTotalPrice().toFixed(2)}</p>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading || items.length === 0}
                  className={`mt-6 w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    (loading || items.length === 0) ? 'opacity-70 cursor-not-allowed' : ''
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
                    'Proceed to Checkout'
                  )}
                </button>

                {!isAuthenticated && (
                  <div className="mt-4 flex items-start bg-yellow-50 p-4 rounded-md text-sm">
                    <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                    <p>
                      You need to{' '}
                      <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-800">
                        login
                      </Link>{' '}
                      to complete your purchase.
                    </p>
                  </div>
                )}

                <div className="mt-6 text-sm text-gray-500">
                  <p className="mb-2">We accept:</p>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 border border-gray-300 rounded text-xs">Razorpay</span>
                    <span className="px-2 py-1 border border-gray-300 rounded text-xs">UPI</span>
                    <span className="px-2 py-1 border border-gray-300 rounded text-xs">Cards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;