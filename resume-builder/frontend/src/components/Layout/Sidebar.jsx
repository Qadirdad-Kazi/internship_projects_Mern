import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  User, 
  Settings, 
  HelpCircle,
  X
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import clsx from 'clsx'

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation()
  const { user } = useAuthStore()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and quick actions'
    },
    {
      name: 'My Resumes',
      href: '/resumes',
      icon: FileText,
      description: 'Manage your resumes'
    },
    {
      name: 'Create Resume',
      href: '/resume-builder',
      icon: Plus,
      description: 'Build a new resume'
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
      description: 'Manage your account'
    }
  ]

  const secondaryNavigation = [
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle
    }
  ]

  const isActiveLink = (href) => {
    if (href === '/dashboard') {
      return location.pathname === href
    }
    return location.pathname.startsWith(href)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:border-r lg:border-gray-200 lg:bg-white">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0 px-6">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Resume Builder</span>
            </Link>
          </div>

          {/* User info */}
          <div className="mt-6 px-6">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.subscription?.plan} Plan</p>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="mt-8 flex-1 px-3 space-y-1">
            {navigation.map((item) => {
              const isActive = isActiveLink(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={clsx(
                    'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150',
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <item.icon
                    className={clsx(
                      'mr-3 h-5 w-5 flex-shrink-0',
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    )}
                  />
                  <div className="flex-1">
                    <div>{item.name}</div>
                    {item.description && (
                      <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                    )}
                  </div>
                </Link>
              )
            })}
          </nav>

          {/* Secondary Navigation */}
          <div className="px-3 mt-6">
            <div className="space-y-1">
              {secondaryNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Subscription Status */}
          <div className="mt-6 px-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {user?.subscription?.features?.maxResumes - (user?.resumes?.length || 0)} resumes left
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.subscription?.plan === 'free' ? 'Upgrade to create more' : 'Premium features available'}
                  </p>
                </div>
              </div>
              {user?.subscription?.plan === 'free' && (
                <button className="mt-3 w-full bg-primary-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-primary-700 transition-colors">
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={clsx(
        'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex flex-col h-full">
          {/* Mobile header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center space-x-3" onClick={onClose}>
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Resume Builder</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile content - same as desktop but with onClose handlers */}
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
            {/* User info */}
            <div className="px-6">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.subscription?.plan} Plan</p>
                </div>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="mt-8 flex-1 px-3 space-y-1">
              {navigation.map((item) => {
                const isActive = isActiveLink(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className={clsx(
                      'group flex items-center px-3 py-2 text-sm font-medium rounded-md',
                      isActive
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <item.icon
                      className={clsx(
                        'mr-3 h-5 w-5 flex-shrink-0',
                        isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                      )}
                    />
                    <div className="flex-1">
                      <div>{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      )}
                    </div>
                  </Link>
                )
              })}
            </nav>

            {/* Mobile Secondary Navigation */}
            <div className="px-3 mt-6">
              <div className="space-y-1">
                {secondaryNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={onClose}
                    className="group flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900"
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Subscription Status */}
            <div className="mt-6 px-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.subscription?.features?.maxResumes - (user?.resumes?.length || 0)} resumes left
                    </p>
                    <p className="text-xs text-gray-500">
                      {user?.subscription?.plan === 'free' ? 'Upgrade to create more' : 'Premium features available'}
                    </p>
                  </div>
                </div>
                {user?.subscription?.plan === 'free' && (
                  <button className="mt-3 w-full bg-primary-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-primary-700">
                    Upgrade Plan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sidebar