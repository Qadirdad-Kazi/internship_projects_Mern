import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, Download, Eye, BarChart3, Clock, User } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { resumeAPI } from '../../services/api'
import { useQuery } from 'react-query'

const Dashboard = () => {
  const { user, getUserStats } = useAuthStore()
  const userStats = getUserStats()

  // Fetch recent resumes
  const { data: resumesData, isLoading } = useQuery(
    'recent-resumes',
    () => resumeAPI.getResumes({ page: 1, limit: 5, sort: '-updatedAt' }),
    {
      select: (response) => response.data.data
    }
  )

  const recentResumes = resumesData?.resumes || []

  const stats = [
    {
      name: 'Total Resumes',
      value: userStats?.resumeCount || 0,
      max: userStats?.maxResumes || 3,
      icon: FileText,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'Total Views',
      value: recentResumes.reduce((sum, resume) => sum + (resume.metadata?.totalViews || 0), 0),
      icon: Eye,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: 'PDF Downloads',
      value: recentResumes.reduce((sum, resume) => sum + (resume.metadata?.totalDownloads || 0), 0),
      icon: Download,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    },
    {
      name: 'Profile Complete',
      value: calculateProfileCompleteness(user),
      suffix: '%',
      icon: User,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white shadow-soft rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your resumes today.
            </p>
          </div>
          <Link
            to="/resume-builder"
            className="btn-primary flex items-center"
            disabled={!userStats?.canCreateResume}
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Resume
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="bg-white shadow-soft rounded-lg p-6">
              <div className="flex items-center">
                <div className={`${stat.bgColor} rounded-lg p-3`}>
                  <Icon className={`h-6 w-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                      {stat.suffix && <span className="text-lg">{stat.suffix}</span>}
                    </p>
                    {stat.max && (
                      <p className="text-sm text-gray-500 ml-1">/ {stat.max}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Resumes */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow-soft rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Recent Resumes</h2>
                <Link
                  to="/resumes"
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  View all
                </Link>
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : recentResumes.length > 0 ? (
                <div className="space-y-4">
                  {recentResumes.map((resume) => (
                    <div
                      key={resume._id}
                      className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/resumes/${resume._id}`}
                          className="text-sm font-medium text-gray-900 hover:text-primary-600"
                        >
                          {resume.title}
                        </Link>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">
                            Updated {new Date(resume.updatedAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Eye className="h-3 w-3 mr-1" />
                            {resume.metadata?.totalViews || 0} views
                          </span>
                          <span className="flex items-center text-xs text-gray-500">
                            <Download className="h-3 w-3 mr-1" />
                            {resume.metadata?.totalDownloads || 0} downloads
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`badge ${getTemplateColor(resume.template)}`}>
                          {resume.template}
                        </span>
                        <span className={`badge ${getCompletenessColor(resume.completenessPercentage || 0)}`}>
                          {resume.completenessPercentage || 0}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No resumes yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating your first resume.
                  </p>
                  <div className="mt-6">
                    <Link to="/resume-builder" className="btn-primary">
                      <Plus className="h-5 w-5 mr-2" />
                      Create Resume
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white shadow-soft rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6 space-y-3">
              <Link
                to="/resume-builder"
                className="flex items-center w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Create New Resume</p>
                  <p className="text-xs text-gray-500">Start with a template</p>
                </div>
              </Link>

              <Link
                to="/resumes"
                className="flex items-center w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <FileText className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">View All Resumes</p>
                  <p className="text-xs text-gray-500">Manage your resumes</p>
                </div>
              </Link>

              <Link
                to="/profile"
                className="flex items-center w-full p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <User className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Update Profile</p>
                  <p className="text-xs text-gray-500">Complete your information</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Pro Tips */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium">Pro Tip</h3>
                <p className="mt-2 text-sm text-primary-100">
                  Keep your resume updated regularly. Employers prefer recent and relevant information.
                </p>
                <div className="mt-4">
                  <Link
                    to="/tips"
                    className="text-sm font-medium text-white hover:text-primary-100 underline"
                  >
                    View more tips →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Status */}
          {userStats?.subscriptionPlan === 'free' && (
            <div className="bg-white shadow-soft rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Upgrade Your Plan</h3>
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>✨ Unlimited resumes</p>
                <p>✨ Premium templates</p>
                <p>✨ Advanced export options</p>
                <p>✨ Priority support</p>
              </div>
              <button className="btn-primary w-full">
                Upgrade to Premium
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function calculateProfileCompleteness(user) {
  if (!user) return 0
  
  let completeness = 0
  const fields = [
    'name',
    'email',
    'profile.firstName',
    'profile.lastName',
    'profile.phone',
    'profile.address.city',
    'profile.address.country'
  ]
  
  fields.forEach(field => {
    const value = field.split('.').reduce((obj, key) => obj?.[key], user)
    if (value) completeness += 1
  })
  
  return Math.round((completeness / fields.length) * 100)
}

function getTemplateColor(template) {
  const colors = {
    modern: 'badge-primary',
    classic: 'badge-gray',
    minimal: 'badge-success',
    creative: 'badge-warning'
  }
  return colors[template] || 'badge-gray'
}

function getCompletenessColor(percentage) {
  if (percentage >= 80) return 'badge-success'
  if (percentage >= 60) return 'badge-warning'
  return 'badge-danger'
}

export default Dashboard