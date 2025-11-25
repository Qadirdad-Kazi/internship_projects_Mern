import { FileText, Download, Eye, ExternalLink } from 'lucide-react'
import { templateRegistry } from '../Templates/index'
import { pdfAPI } from '../../services/api'
import toast from 'react-hot-toast'

const ResumePreview = ({ data = {}, template = 'modern-professional', resumeId = null, onFullView = null }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = {},
    projects = [],
    settings = {}
  } = data

  // Get the template component
  const TemplateComponent = templateRegistry[template]

  // PDF export handler
  const handleExportPDF = async () => {
    console.log('[PDF DEBUG] Starting PDF export for resume ID:', resumeId)
    
    if (!resumeId || resumeId === 'new') {
      console.log('[PDF DEBUG] Invalid resume ID, cannot export')
      toast.error('Please save your resume first before exporting to PDF')
      return
    }

    try {
      console.log('[PDF DEBUG] Making API call to generate PDF...')
      toast.loading('Generating PDF...', { id: 'pdf-export' })
      const response = await pdfAPI.generatePDF(resumeId)
      console.log('[PDF DEBUG] PDF API response:', response)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${data.title || 'resume'}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      toast.success('PDF exported successfully!', { id: 'pdf-export' })
    } catch (error) {
      console.error('PDF export error:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      
      let errorMessage = 'Failed to export PDF. Please try again.'
      
      // Handle Blob error responses (JSON error messages)
      if (error.response?.data instanceof Blob && error.response.data.type.includes('json')) {
        try {
          const errorText = await error.response.data.text()
          console.log('[PDF DEBUG] Blob error content:', errorText)
          const errorData = JSON.parse(errorText)
          console.log('[PDF DEBUG] Parsed error data:', errorData)
          errorMessage = errorData.message || errorMessage
        } catch (blobError) {
          console.error('[PDF DEBUG] Failed to parse blob error:', blobError)
        }
      } else if (error.response?.status === 401) {
        errorMessage = 'Please log in again to export PDF.'
      } else if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || 'PDF export not allowed.'
      } else if (error.response?.status === 404) {
        errorMessage = 'Resume not found. Please save your resume first.'
      } else if (error.response?.status === 429) {
        errorMessage = 'Too many PDF export requests. Please wait a moment.'
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      toast.error(errorMessage, { id: 'pdf-export' })
    }
  }
  
  // Debug logging for skills
  console.log('[PREVIEW DEBUG] Original skills data:', skills)
  
  // Transform data to match template component format
  const transformedData = {
    personalInfo: {
      firstName: personalInfo.fullName?.split(' ')[0] || '',
      lastName: personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
      fullName: personalInfo.fullName || '',
      title: personalInfo.title || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      address: personalInfo.address || {},
      location: personalInfo.address ? 
        [personalInfo.address.city, personalInfo.address.state].filter(Boolean).join(', ') : '',
      website: personalInfo.website || '',
      linkedin: personalInfo.linkedin || '',
      github: personalInfo.github || '',
      portfolio: personalInfo.portfolio || '',
      summary: personalInfo.professionalSummary || '',
      professionalSummary: personalInfo.professionalSummary || ''
    },
    experience: experience.map(exp => ({
      jobTitle: exp.jobTitle || '',
      position: exp.jobTitle || exp.position || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.isCurrentJob || exp.current || false,
      isCurrentJob: exp.isCurrentJob || false,
      description: exp.description || '',
      achievements: exp.achievements || [],
      technologies: exp.technologies || []
    })),
    education: education.map(edu => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      location: edu.location || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || '',
      graduationYear: edu.graduationYear || edu.year || '',
      year: edu.graduationYear || edu.year || '',
      gpa: edu.gpa || '',
      honors: edu.honors || [],
      relevantCoursework: edu.relevantCoursework || []
    })),
    skills: [
      // Transform technical skills
      ...(skills.technical || []).map(skill => ({
        name: typeof skill === 'string' ? skill : skill.name || '',
        level: typeof skill === 'object' ? skill.level || 'Intermediate' : 'Intermediate',
        category: 'Technical'
      })),
      // Transform soft skills  
      ...(skills.soft || []).map(skill => ({
        name: skill,
        level: 'Intermediate', // Default level for soft skills
        category: 'Soft Skills'
      })),
      // Transform languages
      ...(skills.languages || []).map(lang => ({
        name: typeof lang === 'string' ? lang : lang.language || '',
        level: typeof lang === 'object' ? lang.proficiency || 'Conversational' : 'Conversational',
        category: 'Languages'
      }))
    ],
    projects: projects.map(project => ({
      name: project.name || '',
      description: project.description || '',
      technologies: project.technologies || [],
      url: project.url || '',
      github: project.github || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      achievements: project.achievements || []
    }))
  }
  
  // Debug logging for transformed skills
  console.log('[PREVIEW DEBUG] Transformed skills for template:', transformedData.skills)

  const theme = {
    primary: settings.theme?.primaryColor || '#2563eb',
    secondary: settings.theme?.secondaryColor || '#64748b',
    accent: settings.theme?.accentColor || '#06b6d4'
  }

  // If no template component found, show error
  if (!TemplateComponent) {
    return (
      <div className="bg-red-50 border-2 border-dashed border-red-300 rounded-lg p-12 text-center">
        <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Template Not Found</h3>
        <p className="text-red-600 mb-4">
          The selected template "{template}" could not be loaded.
        </p>
      </div>
    )
  }

  // Show placeholder only if absolutely no data
  const hasAnyData = personalInfo.fullName || personalInfo.email || experience.length > 0 || education.length > 0 || projects.length > 0 || 
    (skills.technical && skills.technical.length > 0) || (skills.soft && skills.soft.length > 0) || (skills.languages && skills.languages.length > 0)
  
  if (!hasAnyData) {
    return (
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Preview</h3>
        <p className="text-gray-600 mb-4">
          Start filling out your information to see a live preview of your resume
        </p>
        <div className="text-sm text-gray-500">
          Your resume will appear here as you add content
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Eye className="h-5 w-5 mr-2" />
          Live Preview - {template.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
        </h3>
        <div className="flex space-x-2">
          <button 
            className="btn-sm btn-secondary flex items-center"
            onClick={onFullView}
            disabled={!onFullView}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Full View
          </button>
          <button 
            className="btn-sm btn-primary flex items-center"
            onClick={handleExportPDF}
            disabled={!resumeId || resumeId === 'new'}
          >
            <Download className="h-4 w-4 mr-1" />
            Export PDF
          </button>
        </div>
      </div>
      
      {/* Template Component Preview */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="w-full h-auto max-w-none" style={{ minHeight: '600px' }}>
          <TemplateComponent 
            data={transformedData}
            colors={theme}
            className="w-full h-full"
          />
        </div>
      </div>
      
      {/* Preview Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center justify-between text-xs text-blue-800">
          <span>📋 Live preview - Changes appear automatically</span>
          <span>Template: {template.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
        </div>
      </div>
    </div>
  )
}

export default ResumePreview