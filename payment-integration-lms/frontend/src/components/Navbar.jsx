import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  User, 
  LogOut, 
  ShoppingCart, 
  Crown,
  Menu,
  X,
  Home,
  Search
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useState } from 'react';

const Navbar = () => {
  const { user, isAuthenticated, logout, hasPremiumAccess } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/courses', label: 'Courses', icon: BookOpen },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-xl text-gray-900">PaymentLMS</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Premium Badge */}
                {hasPremiumAccess() && (
                  <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    <Crown className="h-3 w-3" />
                    <span>Premium</span>
                  </div>
                )}

                {/* Dashboard Link */}
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  Dashboard
                </Link>

                {/* Profile Dropdown */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {user?.avatar?.url ? (
                        <img 
                          src={user.avatar.url} 
                          alt={user.name} 
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile Settings
                      </Link>
                      <Link
                        to="/subscription"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Subscription
                      </Link>
                      {user?.role === 'instructor' && (
                        <Link
                          to="/instructor"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Instructor Panel
                        </Link>
                      )}
                      {user?.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Admin Panel
                        </Link>
                      )}
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 inline mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    isActive(path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}

              {isAuthenticated ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center px-3 py-2">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                      {user?.avatar?.url ? (
                        <img 
                          src={user.avatar.url} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-base font-medium text-gray-800">{user?.name}</div>
                      <div className="text-sm text-gray-500">{user?.email}</div>
                    </div>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-1">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;