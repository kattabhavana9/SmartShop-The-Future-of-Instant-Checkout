import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Heart, ChevronLeft, Star, Share2, ArrowLeft, ArrowRight } from 'lucide-react';
import { getProductById, getRecommendedProducts } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { toast } from '../components/ui/Toaster';
import { Product } from '../types/product';
import ProductCard from '../components/product/ProductCard';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (!id) return;
    
    // Scroll to top when product changes
    window.scrollTo(0, 0);
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const foundProduct = getProductById(id);
      
      if (foundProduct) {
        setProduct(foundProduct);
        // Get similar products from same category
        const relatedProducts = getRecommendedProducts(foundProduct.category)
          .filter(p => p.id !== id);
        setSimilarProducts(relatedProducts);
      } else {
        toast.error('Product not found');
        navigate('/products');
      }
      
      setLoading(false);
    }, 500);
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(product, quantity);
    toast.success(`${quantity} ${quantity === 1 ? 'item' : 'items'} added to cart`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
            </div>
            <div className="md:w-1/2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
              <div className="h-12 bg-gray-200 rounded w-2/3"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <p className="mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link 
            to="/products" 
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm mb-6">
          <Link to="/products" className="text-gray-500 hover:text-primary-600 flex items-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <Link to={`/products?category=${product.category}`} className="text-gray-500 hover:text-primary-600">
            {product.category}
          </Link>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </nav>

        {/* Product Detail Section */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Product Image */}
          <div className="md:w-1/2">
            <div className="aspect-square overflow-hidden rounded-lg border border-gray-200">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
            
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating) ? 'text-accent-400 fill-accent-400' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-600">{product.rating} ({product.reviews} reviews)</span>
            </div>
            
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                {product.mrp && product.price < product.mrp && (
                  <>
                    <span className="ml-2 text-lg text-gray-500 line-through">₹{product.mrp}</span>
                    <span className="ml-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">Inclusive of all taxes</p>
            </div>
            
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-start">
                <div className="w-32 text-sm font-medium text-gray-900">Brand</div>
                <div className="text-sm text-gray-700">{product.brand}</div>
              </div>
              <div className="flex items-start mt-2">
                <div className="w-32 text-sm font-medium text-gray-900">Quantity</div>
                <div className="text-sm text-gray-700">{product.weight || product.unit}</div>
              </div>
              <div className="flex items-start mt-2">
                <div className="w-32 text-sm font-medium text-gray-900">Availability</div>
                <div className={`text-sm ${product.stock > 0 ? 'text-success-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                </div>
              </div>
            </div>
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-6">
              <div className="text-sm font-medium text-gray-900">Quantity</div>
              <div className="flex items-center border border-gray-300 rounded">
                <button 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-1 border-r border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  disabled={product.stock <= quantity}
                  className="px-3 py-1 border-l border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 flex items-center justify-center px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:bg-gray-400"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`flex items-center justify-center px-4 py-3 border rounded-lg transition-colors ${
                  isInWishlist(product.id)
                    ? 'bg-red-50 text-red-600 border-red-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Heart 
                  className={`h-5 w-5 mr-2 ${isInWishlist(product.id) ? 'fill-red-500' : ''}`} 
                />
                {isInWishlist(product.id) ? 'In Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
            
            {/* Share Button */}
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.name,
                    text: product.description,
                    url: window.location.href,
                  }).catch(err => {
                    console.error('Error sharing:', err);
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success('Link copied to clipboard');
                }
              }}
              className="inline-flex items-center text-sm text-primary-600 hover:text-primary-800"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share this product
            </button>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12 border-t border-gray-200">
          <div className="flex overflow-x-auto border-b border-gray-200 mt-8">
            <button
              onClick={() => setActiveTab('description')}
              className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                activeTab === 'description'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Description
            </button>
            {product.nutrition && (
              <button
                onClick={() => setActiveTab('nutrition')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'nutrition'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Nutrition Facts
              </button>
            )}
            {product.ingredients && (
              <button
                onClick={() => setActiveTab('ingredients')}
                className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                  activeTab === 'ingredients'
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Ingredients
              </button>
            )}
          </div>
          
          <div className="py-6">
            {activeTab === 'description' && (
              <div className="text-gray-800 leading-relaxed">
                <p>{product.description}</p>
                {product.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.tags.map(tag => (
                      <span key={tag} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'nutrition' && product.nutrition && (
              <div>
                <h3 className="text-lg font-medium mb-4">Nutrition Information</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Nutrient
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount per serving
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {product.nutrition.calories !== undefined && (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Calories
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.nutrition.calories} kcal
                          </td>
                        </tr>
                      )}
                      {product.nutrition.protein !== undefined && (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Protein
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.nutrition.protein}g
                          </td>
                        </tr>
                      )}
                      {product.nutrition.carbs !== undefined && (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Carbohydrates
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.nutrition.carbs}g
                          </td>
                        </tr>
                      )}
                      {product.nutrition.fat !== undefined && (
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            Fat
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.nutrition.fat}g
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  * Percent Daily Values are based on a 2,000 calorie diet.
                </p>
              </div>
            )}
            
            {activeTab === 'ingredients' && product.ingredients && (
              <div>
                <h3 className="text-lg font-medium mb-4">Ingredients</h3>
                <p className="text-gray-700">{product.ingredients}</p>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Similar Products</h2>
              <div className="flex space-x-2">
                <button 
                  id="prevSimilar" 
                  className="p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    document.getElementById('similarProductsContainer')?.scrollBy({
                      left: -280,
                      behavior: 'smooth'
                    });
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button 
                  id="nextSimilar" 
                  className="p-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    document.getElementById('similarProductsContainer')?.scrollBy({
                      left: 280,
                      behavior: 'smooth'
                    });
                  }}
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div 
              id="similarProductsContainer" 
              className="flex overflow-x-auto pb-6 space-x-4 hide-scrollbar"
              style={{ scrollbarWidth: 'none' }}
            >
              {similarProducts.map(product => (
                <div key={product.id} className="min-w-[250px] max-w-[250px]">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;