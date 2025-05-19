import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ChevronLeft, Trash2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { toast } from '../components/ui/Toaster';

const Wishlist: React.FC = () => {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    removeFromWishlist(productId);
    toast.info(`${productName} removed from wishlist`);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.info('Wishlist cleared');
  };

  const handleAddToCart = (productId: string) => {
    const product = items.find(item => item.id === productId);
    if (product) {
      addToCart(product, 1);
      toast.success(`${product.name} added to cart`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link to="/" className="text-gray-500 hover:text-primary-600 mr-2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Your Wishlist</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="mb-6 flex justify-center">
              <Heart className="h-16 w-16 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your wishlist yet.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Explore Products
            </Link>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                {items.length} {items.length === 1 ? 'item' : 'items'} in your wishlist
              </p>
              <button
                onClick={handleClearWishlist}
                className="text-sm text-red-600 hover:text-red-800 flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Wishlist
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <Link to={`/products/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover"
                      />
                    </Link>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id, product.name)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </button>
                  </div>

                  <div className="p-4">
                    <Link to={`/products/${product.id}`}>
                      <h3 className="text-lg font-medium text-gray-900 hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">{product.brand}</p>
                    
                    <div className="mt-2 flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold text-gray-900">₹{product.price}</p>
                        {product.mrp && product.price < product.mrp && (
                          <p className="text-sm text-gray-500 line-through">₹{product.mrp}</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;