import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, TrendingUp, Scan, Package, ChevronRight } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import CategoryCard from '../components/product/CategoryCard';
import { categories } from '../data/categories';
import { getPopularProducts, getRecommendedProducts } from '../data/products';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [popularProducts, setPopularProducts] = useState(getPopularProducts());
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);

  useEffect(() => {
    // Simulate getting recommended products based on user's past purchases
    // In a real app, this would be based on user's purchase history
    if (isAuthenticated && user) {
      // Just getting random category recommendations for demo
      const randomCategory = categories[Math.floor(Math.random() * categories.length)].name;
      setRecommendedProducts(getRecommendedProducts(randomCategory));
    }
  }, [isAuthenticated, user]);

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="relative bg-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-primary-800 opacity-90"></div>
        <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 space-y-6 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight animate-slide-in">
                Shop Smarter<span className="text-accent-400"></span>
              </h1>
              <p className="text-lg text-white/80 max-w-xl animate-slide-up">
                Discover products, scan barcodes, and streamline your in-store shopping experience with SmartShop.
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start animate-slide-up delay-100">
                <Link
                  to="/products"
                  className="bg-accent-500 hover:bg-accent-600 text-white px-5 py-3 rounded-lg font-medium flex items-center shadow-lg hover:shadow-xl transition-all"
                >
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Explore Products
                </Link>
                <Link
                  to="/scanner"
                  className="bg-white hover:bg-gray-100 text-primary-800 px-5 py-3 rounded-lg font-medium flex items-center shadow-lg hover:shadow-xl transition-all"
                >
                  <Scan className="mr-2 h-5 w-5" />
                  Scan Products
                </Link>
              </div>
            </div>
            <div className="hidden md:block w-1/2">
              <img
                src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="In-store shopping with SmartShop"
                className="object-cover rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">How SmartShop Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Scan className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Scan In-Store</h3>
              <p className="text-gray-600">Use our barcode scanner to instantly get product information while shopping in-store.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Plan Before Visit</h3>
              <p className="text-gray-600">Browse products and build your shopping list before visiting the supermarket.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-7 w-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Recommendations</h3>
              <p className="text-gray-600">Receive personalized product recommendations based on your shopping habits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Shop by Category</h2>
            <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
              View all categories <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Products */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Popular Products</h2>
            <Link to="/products?sort=popular" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
              View all popular <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {popularProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Products (only shown for authenticated users) */}
      {isAuthenticated && recommendedProducts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recommended for You</h2>
              <Link to="/products" className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium">
                More recommendations <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-accent-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Your Shopping Experience?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Join thousands of smart shoppers in India who use SmartShop to make better purchase decisions.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to={isAuthenticated ? "/scanner" : "/register"}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium flex items-center shadow-lg hover:shadow-xl transition-all"
            >
              {isAuthenticated ? (
                <>
                  <Scan className="mr-2 h-5 w-5" />
                  Scan Now
                </>
              ) : (
                <>
                  <Package className="mr-2 h-5 w-5" />
                  Get Started
                </>
              )}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;