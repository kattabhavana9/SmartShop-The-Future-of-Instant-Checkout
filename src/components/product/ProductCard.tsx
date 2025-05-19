import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../../types/product';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { toast } from '../ui/Toaster';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };
  
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };
  
  // Calculate discount percentage if both MRP and price are available
  const discountPercentage = product.mrp && product.price < product.mrp 
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) 
    : null;
  
  return (
    <Link 
      to={`/products/${product.id}`}
      className={`group block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden animate-scale-in ${
        compact ? 'h-full' : ''
      }`}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className={`w-full object-cover ${compact ? 'h-40' : 'h-56'}`}
        />
        <div className="absolute top-2 right-2 space-y-2">
          <button
            onClick={handleToggleWishlist}
            className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <Heart 
              className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
            />
          </button>
        </div>
        {discountPercentage && (
          <div className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
            {discountPercentage}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className={`font-medium text-gray-900 group-hover:text-primary-600 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
              {product.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">{product.brand}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center">
              <span className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-base'}`}>
                ₹{product.price}
              </span>
              {product.mrp && product.price < product.mrp && (
                <span className="ml-2 text-xs text-gray-500 line-through">
                  ₹{product.mrp}
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500 mt-1">
              {product.weight || product.unit}
            </span>
          </div>
        </div>
        
        {!compact && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.description}
            </p>
          </div>
        )}
        
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? 'text-accent-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 15.585l-6.327 3.323 1.209-7.04L.292 6.477l7.056-1.025L10 0l2.652 5.452 7.056 1.025-4.59 4.391 1.209 7.04z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-500">({product.reviews})</span>
          </div>
          
          <button
            onClick={handleAddToCart}
            className="p-2 bg-primary-600 rounded-full text-white hover:bg-primary-700 transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;