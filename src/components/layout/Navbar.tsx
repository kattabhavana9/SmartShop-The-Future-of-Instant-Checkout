import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { ShoppingBag, Heart, User, QrCode, Search, Menu, X, LogOut, History } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close menu when location changes
    setIsMenuOpen(false);
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white bg-opacity-95'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <div className="flex items-center text-primary-600">
            <ShoppingBag className="h-7 w-7" />
            <span className="ml-2 text-xl font-bold">SmartShop</span>
          </div>
        </Link>

        {/* Search Bar (desktop) */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-md mx-6 relative"
        >
          <input
            type="text"
            placeholder="Search for products, brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 pl-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <button 
            type="submit"
            className="absolute right-3 p-1 rounded-full bg-primary-600 text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/scanner" className="flex flex-col items-center text-gray-700 hover:text-primary-600 transition-colors">
            <QrCode className="h-6 w-6" />
            <span className="text-xs mt-1">Scanner</span>
          </Link>
          <Link to="/wishlist" className="flex flex-col items-center text-gray-700 hover:text-primary-600 transition-colors">
            <Heart className="h-6 w-6" />
            <span className="text-xs mt-1">Wishlist</span>
          </Link>
          <Link to="/cart" className="flex flex-col items-center text-gray-700 hover:text-primary-600 transition-colors relative">
            <ShoppingBag className="h-6 w-6" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
            <span className="text-xs mt-1">Cart</span>
          </Link>
          {isAuthenticated ? (
            <div className="relative group">
              <button className="flex flex-col items-center text-gray-700 hover:text-primary-600 transition-colors">
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">{user?.name?.split(' ')[0] || 'Account'}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  My Profile
                </Link>
                <Link to="/history" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <History className="h-4 w-4 mr-2" />
                  Order History
                </Link>
                <button
                  onClick={logout}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="flex flex-col items-center text-gray-700 hover:text-primary-600 transition-colors"
            >
              <User className="h-6 w-6" />
              <span className="text-xs mt-1">Login</span>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={toggleMenu} 
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 px-4 pl-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <button 
            type="submit"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-primary-600 text-white"
          >
            <Search className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-slide-up">
          <div className="px-4 py-2 space-y-3 divide-y divide-gray-100">
            <Link to="/scanner" className="flex items-center py-3 text-gray-700">
              <QrCode className="h-5 w-5 mr-3" />
              <span>Scanner</span>
            </Link>
            <Link to="/wishlist" className="flex items-center py-3 text-gray-700">
              <Heart className="h-5 w-5 mr-3" />
              <span>Wishlist</span>
            </Link>
            <Link to="/cart" className="flex items-center py-3 text-gray-700">
              <ShoppingBag className="h-5 w-5 mr-3" />
              <span>Cart ({getTotalItems()})</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="flex items-center py-3 text-gray-700">
                  <User className="h-5 w-5 mr-3" />
                  <span>My Profile</span>
                </Link>
                <Link to="/history" className="flex items-center py-3 text-gray-700">
                  <History className="h-5 w-5 mr-3" />
                  <span>Order History</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full py-3 text-red-500"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="flex items-center py-3 text-gray-700">
                <User className="h-5 w-5 mr-3" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;