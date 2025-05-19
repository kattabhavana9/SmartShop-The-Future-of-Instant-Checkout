import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-6">
            <Link to="/" className="flex items-center">
              <ShoppingBag className="h-6 w-6 text-accent-500" />
              <span className="ml-2 text-xl font-bold">SmartShop</span>
            </Link>
            <p className="mt-4 text-gray-400">
              Your smart shopping companion. Scan, explore, and shop smarter.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-400">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/products?category=Groceries" className="text-gray-400 hover:text-white transition-colors">Groceries</Link></li>
              <li><Link to="/products?category=Dairy Products" className="text-gray-400 hover:text-white transition-colors">Dairy Products</Link></li>
              <li><Link to="/products?category=Fruits & Vegetables" className="text-gray-400 hover:text-white transition-colors">Fruits & Vegetables</Link></li>
              <li><Link to="/products?category=Snacks & Beverages" className="text-gray-400 hover:text-white transition-colors">Snacks & Beverages</Link></li>
              <li><Link to="/products?category=Home Care" className="text-gray-400 hover:text-white transition-colors">Home Care</Link></li>
              <li><Link to="/products?category=Personal Care" className="text-gray-400 hover:text-white transition-colors">Personal Care</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-400">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/products" className="text-gray-400 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/scanner" className="text-gray-400 hover:text-white transition-colors">Scanner</Link></li>
              <li><Link to="/wishlist" className="text-gray-400 hover:text-white transition-colors">Wishlist</Link></li>
              <li><Link to="/cart" className="text-gray-400 hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent-400">Customer Support</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: support@smartshop.in</li>
              <li className="text-gray-400">Phone: +91 1234567890</li>
              <li className="text-gray-400">Hours: 9:00 AM - 6:00 PM (IST)</li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} SmartShop | All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;