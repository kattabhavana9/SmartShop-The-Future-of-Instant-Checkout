import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Calendar, Clock, CreditCard, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Transaction } from '../types/product';

const History: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // Load orders from localStorage
      const storedOrders = localStorage.getItem(`orders_${user.id}`);
      if (storedOrders) {
        try {
          const parsedOrders = JSON.parse(storedOrders);
          // Sort orders by date (newest first)
          parsedOrders.sort((a: Transaction, b: Transaction) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          );
          setOrders(parsedOrders);
        } catch (error) {
          console.error('Error parsing orders:', error);
        }
      }
      setLoading(false);
    }
  }, [user]);

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary-600 mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Order History</h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6 flex justify-center">
              <ShoppingBag className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't placed any orders yet. Start shopping to see your order history.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <h2 className="text-lg font-semibold">Order #{order.id.split('-')[1]}</h2>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{formatDate(order.date)}</span>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-success-100 text-success-800">
                        <Check className="h-4 w-4 mr-1" />
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Items</h3>
                  <ul className="divide-y divide-gray-200">
                    {order.items.map((item) => (
                      <li key={item.product.id} className="py-3 flex">
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
                              <h4>
                                <Link to={`/products/${item.product.id}`} className="hover:text-primary-600">
                                  {item.product.name}
                                </Link>
                              </h4>
                              <p className="ml-4">₹{item.product.price}</p>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">{item.product.brand}</p>
                          </div>
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.quantity}</p>
                            <p className="text-gray-500">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Payment Information</h3>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center mb-1">
                        <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
                        <span>{order.paymentMethod}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Payment ID: {order.paymentId}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Pickup Information</h3>
                    <div className="text-sm text-gray-600">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-gray-400" />
                        <span>Visit the store to collect your items</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;