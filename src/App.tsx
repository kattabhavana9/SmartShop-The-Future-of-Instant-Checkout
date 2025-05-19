import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Scanner from './pages/Scanner';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import History from './pages/History';
import Checkout from './pages/Checkout';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path="scanner" element={<Scanner />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;