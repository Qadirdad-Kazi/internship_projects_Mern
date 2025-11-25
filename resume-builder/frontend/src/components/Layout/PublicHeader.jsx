import { Link } from 'react-router-dom'
import { FileText, Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Resume Builder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Features
            </Link>
            <Link
              to="/templates"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Templates
            </Link>
            <Link
              to="/pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/help"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Help
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                >
                  <User className="h-4 w-4 mr-1" />
                  Dashboard
                </Link>
                <Link
                  to="/resume-builder"
                  className="btn-primary"
                >
                  Create Resume
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-3">
              <Link
                to="/features"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/templates"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Templates
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/help"
                className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                Help
              </Link>
              <div className="pt-4 border-t border-gray-200 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    <Link
                      to="/resume-builder"
                      className="block px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Create Resume
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default PublicHeader