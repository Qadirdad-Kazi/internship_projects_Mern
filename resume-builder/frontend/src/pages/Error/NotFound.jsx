import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Search } from 'lucide-react'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-200 mb-4">404</div>
          <div className="w-32 h-1 bg-primary-600 mx-auto rounded-full"></div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back on track.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary btn-lg w-full flex items-center justify-center"
          >
            <Home className="mr-2 h-5 w-5" />
            Go Home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-outline btn-lg w-full flex items-center justify-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Or try one of these pages:</p>
          <div className="space-y-2">
            <Link
              to="/dashboard"
              className="block text-sm text-primary-600 hover:text-primary-700"
            >
              Dashboard
            </Link>
            <Link
              to="/resumes"
              className="block text-sm text-primary-600 hover:text-primary-700"
            >
              My Resumes
            </Link>
            <Link
              to="/resume-builder"
              className="block text-sm text-primary-600 hover:text-primary-700"
            >
              Resume Builder
            </Link>
            <Link
              to="/help"
              className="block text-sm text-primary-600 hover:text-primary-700"
            >
              Help Center
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound