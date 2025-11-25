import { useState } from 'react'
import { FileText, Plus, Filter, Search, Grid, List, Eye, Download, Edit, Trash2, Calendar, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { resumeAPI } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'
import { useCache } from '../../components/Cache/CacheProvider'
import toast from 'react-hot-toast'

const ResumeList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const { invalidateResumeCache } = useCache()

  // Delete mutation
  const deleteMutation = useMutation(resumeAPI.deleteResume, {
    onMutate: async (deletedResumeId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['resumes'] })
      
      // Snapshot the previous value
      const previousResumes = queryClient.getQueryData(['resumes', searchTerm, selectedTemplate])
      
      // Optimistically update to remove the deleted resume
      queryClient.setQueryData(['resumes', searchTerm, selectedTemplate], (old) => {
        if (!old?.data?.data?.resumes) return old
        return {
          ...old,
          data: {
            ...old.data,
            data: {
              ...old.data.data,
              resumes: old.data.data.resumes.filter(resume => resume._id !== deletedResumeId),
              total: (old.data.data.total || 0) - 1
            }
          }
        }
      })
      
      return { previousResumes }
    },
    onSuccess: (data, variables) => {
      // Invalidate all resume queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['resumes'], exact: false })
      // Also invalidate API cache
      resumeAPI.invalidateResume(variables)
      // Clear resume cache
      invalidateResumeCache(variables)
      toast.success('Resume deleted successfully!')
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousResumes) {
        queryClient.setQueryData(['resumes', searchTerm, selectedTemplate], context.previousResumes)
      }
      toast.error(error.response?.data?.message || 'Failed to delete resume')
    }
  })

  // Fetch resumes
  const { data: resumesData, isLoading, error, refetch } = useQuery(
    ['resumes', searchTerm, selectedTemplate],
    () => resumeAPI.getResumes({ 
      search: searchTerm || undefined,
      template: selectedTemplate || undefined,
      limit: 20
    }),
    {
      select: (response) => response.data.data,
      enabled: !!user
    }
  )

  const resumes = resumesData?.resumes || []
  const total = resumesData?.total || 0
  const pagination = resumesData?.pagination

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleTemplateFilter = (e) => {
    setSelectedTemplate(e.target.value)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleDeleteResume = async (resumeId, resumeTitle) => {
    if (window.confirm(`Are you sure you want to delete "${resumeTitle}"? This action cannot be undone.`)) {
      try {
        await deleteMutation.mutateAsync(resumeId)
      } catch (error) {
        // Error handled by mutation
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-1">Manage and organize all your resumes</p>
        </div>
        <Link
          to="/resume-builder"
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Resume
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-soft rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resumes..."
                className="input pl-10"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <select className="input" value={selectedTemplate} onChange={handleTemplateFilter}>
              <option value="">All Templates</option>
              <option value="modern-professional">Modern Professional</option>
              <option value="executive-classic">Executive Classic</option>
              <option value="minimal-clean">Minimal Clean</option>
              <option value="creative-portfolio">Creative Portfolio</option>
              <option value="tech-innovator">Tech Innovator</option>
              <option value="corporate-elite">Corporate Elite</option>
              <option value="simple-effective">Simple & Effective</option>
              <option value="design-studio">Design Studio</option>
            </select>

            <div className="flex rounded-md shadow-sm">
              <button 
                className={`btn-outline rounded-r-none ${viewMode === 'grid' ? 'bg-primary-50 border-primary-300' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button 
                className={`btn-ghost rounded-l-none border-l-0 ${viewMode === 'list' ? 'bg-primary-50 border-primary-300' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white shadow-soft rounded-lg p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your resumes...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white shadow-soft rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load resumes</h3>
          <p className="text-gray-600 mb-6">
            There was an error loading your resumes. Please try again.
          </p>
          <button onClick={() => refetch()} className="btn-primary">
            Try Again
          </button>
        </div>
      )}

      {/* Resume Grid/List */}
      {!isLoading && !error && resumes.length > 0 && (
        <div className="bg-white shadow-soft rounded-lg p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {resumes.length} of {total} resumes
            </p>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resumes.map((resume) => (
                <ResumeCard 
                  key={resume._id} 
                  resume={resume} 
                  onDelete={handleDeleteResume}
                  isDeleting={deleteMutation.isLoading}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {resumes.map((resume) => (
                <ResumeListItem 
                  key={resume._id} 
                  resume={resume} 
                  onDelete={handleDeleteResume}
                  isDeleting={deleteMutation.isLoading}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && resumes.length === 0 && (
        <div className="bg-white shadow-soft rounded-lg p-12 text-center">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedTemplate ? 'No matching resumes' : 'No resumes yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || selectedTemplate 
              ? 'Try adjusting your search or filter criteria.'
              : 'Get started by creating your first resume. It only takes a few minutes!'
            }
          </p>
          <Link to="/resume-builder" className="btn-primary">
            <Plus className="h-5 w-5 mr-2" />
            Create Your First Resume
          </Link>
        </div>
      )}
    </div>
  )
}

// Resume Card Component for Grid View
const ResumeCard = ({ resume, onDelete, isDeleting }) => {
  const getTemplateColor = (template) => {
    const colors = {
      'modern-professional': 'bg-blue-100 text-blue-800',
      'executive-classic': 'bg-gray-100 text-gray-800',
      'minimal-clean': 'bg-green-100 text-green-800',
      'creative-portfolio': 'bg-purple-100 text-purple-800',
      'tech-innovator': 'bg-emerald-100 text-emerald-800',
      'corporate-elite': 'bg-indigo-100 text-indigo-800',
      'simple-effective': 'bg-slate-100 text-slate-800',
      'design-studio': 'bg-red-100 text-red-800'
    }
    return colors[template] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
      {/* Resume Preview Placeholder */}
      <div className="aspect-[3/4] bg-gray-50 rounded-lg mb-4 flex items-center justify-center">
        <FileText className="h-8 w-8 text-gray-400" />
      </div>

      {/* Resume Info */}
      <div className="space-y-2">
        <h3 className="font-medium text-gray-900 truncate">{resume.title}</h3>
        
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTemplateColor(resume.template)}`}>
            {resume.template.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          
          {resume.isDraft && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Draft
            </span>
          )}
        </div>

        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          Updated {formatDate(resume.updatedAt)}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-2 pt-2">
          <Link
            to={`/resumes/${resume._id}/edit`}
            className="flex-1 btn-primary text-xs py-1.5"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Link>
          
          <Link
            to={`/resumes/${resume._id}`}
            className="btn-outline text-xs py-1.5 px-2"
          >
            <Eye className="h-3 w-3" />
          </Link>
          
          <button 
            onClick={() => onDelete(resume._id, resume.title)}
            disabled={isDeleting}
            className="btn-outline text-xs py-1.5 px-2 text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Resume List Item Component for List View
const ResumeListItem = ({ resume, onDelete, isDeleting }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center">
          <FileText className="h-6 w-6 text-gray-400" />
        </div>
        
        <div>
          <h3 className="font-medium text-gray-900">{resume.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
            <span>{resume.template.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
            <span>Updated {formatDate(resume.updatedAt)}</span>
            {resume.isDraft && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Draft
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Link
          to={`/resumes/${resume._id}/edit`}
          className="btn-primary text-sm"
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Link>
        
        <Link
          to={`/resumes/${resume._id}`}
          className="btn-outline text-sm"
        >
          <Eye className="h-4 w-4 mr-1" />
          View
        </Link>
        
        <button 
          onClick={() => onDelete(resume._id, resume.title)}
          disabled={isDeleting}
          className="btn-outline text-sm text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

export default ResumeList