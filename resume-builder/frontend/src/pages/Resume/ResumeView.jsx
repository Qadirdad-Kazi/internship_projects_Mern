import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { 
  Edit, 
  Download, 
  Share2, 
  Eye, 
  ArrowLeft, 
  Calendar, 
  FileText,
  Loader2,
  AlertCircle,
  ExternalLink,
  Copy,
  CheckCircle
} from 'lucide-react'
import { resumeAPI } from '../../services/api'
import { templateRegistry } from '../../components/Templates/index'
import toast from 'react-hot-toast'

const ResumeView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [shareUrl, setShareUrl] = useState('')
  const [showShareModal, setShowShareModal] = useState(false)
  const [copied, setCopied] = useState(false)

  // Fetch resume data
  const { data: resumeData, isLoading, error } = useQuery(
    ['resume', id],
    () => resumeAPI.getResumeById(id),
    {
      select: (response) => response.data.data.resume,
      enabled: !!id
    }
  )

  const handleGenerateShareLink = async () => {
    try {
      const response = await resumeAPI.generateShareLink(id)
      const shareId = response.data.data.shareId
      const url = `${window.location.origin}/resume/${shareId}`
      setShareUrl(url)
      setShowShareModal(true)
    } catch (error) {
      toast.error('Failed to generate share link')
    }
  }

  const copyShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const handleDownloadPDF = async () => {
    try {
      const response = await resumeAPI.generatePDF(id)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${resumeData?.title || 'resume'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('PDF downloaded successfully!')
    } catch (error) {
      toast.error('Failed to generate PDF')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-soft rounded-lg p-12 text-center">
          <Loader2 className="h-12 w-12 text-primary-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading Resume</h3>
          <p className="text-gray-600">Please wait while we fetch your resume...</p>
        </div>
      </div>
    )
  }

  if (error || !resumeData) {
    return (
      <div className="space-y-6">
        <div className="bg-white shadow-soft rounded-lg p-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Not Found</h3>
          <p className="text-gray-600 mb-6">
            The resume you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Link to="/resumes" className="btn-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Resumes
          </Link>
        </div>
      </div>
    )
  }

  // Get the template component
  const TemplateComponent = templateRegistry[resumeData.template] || templateRegistry['modern-professional']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-soft rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate('/resumes')}
              className="btn-ghost p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{resumeData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  Last updated: {formatDate(resumeData.updatedAt)}
                </div>
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" />
                  Template: {resumeData.template.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                {resumeData.isDraft && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Draft
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateShareLink}
              className="btn-outline"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </button>
            
            <button
              onClick={handleDownloadPDF}
              className="btn-outline"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </button>
            
            <Link
              to={`/resumes/${id}/edit`}
              className="btn-primary"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Resume
            </Link>
          </div>
        </div>
      </div>

      {/* Resume Preview */}
      <div className="bg-white shadow-soft rounded-lg p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Resume Preview</h2>
          <div className="text-sm text-gray-500">
            <Eye className="h-4 w-4 inline mr-1" />
            {resumeData.metadata?.totalViews || 0} views
          </div>
        </div>

        {/* Template Rendered Resume */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-600">Resume Preview - Full Size</p>
          </div>
          
          <div className="p-8 bg-white" style={{ minHeight: '297mm' }}>
            {TemplateComponent && (
              <TemplateComponent data={resumeData} />
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Your Resume</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Public Share Link
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 input text-sm"
                  />
                  <button
                    onClick={copyShareUrl}
                    className="btn-outline px-3 py-2"
                  >
                    {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <ExternalLink className="h-4 w-4 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Public Link</p>
                    <p className="text-blue-700">Anyone with this link can view your resume.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => window.open(shareUrl, '_blank')}
                  className="flex-1 btn-outline"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="flex-1 btn-primary"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumeView