import { FileText, Download, Eye, ExternalLink } from 'lucide-react'
import { templateRegistry } from '../Templates/index'

const ResumePreview = ({ data = {}, template = 'modern-professional' }) => {
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
  
  // Transform data to match template component format
  const transformedData = {
    personalInfo: {
      firstName: personalInfo.fullName?.split(' ')[0] || '',
      lastName: personalInfo.fullName?.split(' ').slice(1).join(' ') || '',
      title: personalInfo.title || '',
      email: personalInfo.email || '',
      phone: personalInfo.phone || '',
      location: personalInfo.address ? 
        [personalInfo.address.city, personalInfo.address.state].filter(Boolean).join(', ') : '',
      website: personalInfo.website || '',
      summary: personalInfo.professionalSummary || ''
    },
    experience: experience.map(exp => ({
      position: exp.position || '',
      company: exp.company || '',
      location: exp.location || '',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: exp.current || false,
      description: exp.description || ''
    })),
    education: education.map(edu => ({
      degree: edu.degree || '',
      institution: edu.institution || '',
      year: edu.graduationYear || edu.year || ''
    })),
    skills: Object.entries(skills).flatMap(([category, skillList]) => 
      Array.isArray(skillList) ? skillList.map(skill => ({
        name: typeof skill === 'string' ? skill : skill.name || '',
        level: typeof skill === 'object' ? skill.level || 'Intermediate' : 'Intermediate'
      })) : []
    ),
    projects: projects.map(project => ({
      name: project.name || '',
      description: project.description || '',
      technologies: project.technologies || ''
    }))
  }

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

  // If no data yet, show placeholder
  if (!personalInfo.fullName && experience.length === 0) {
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
          <button className="btn-sm btn-secondary flex items-center">
            <ExternalLink className="h-4 w-4 mr-1" />
            Full View
          </button>
          <button className="btn-sm btn-primary flex items-center">
            <Download className="h-4 w-4 mr-1" />
            Export PDF
          </button>
        </div>
      </div>
      
      {/* Template Component Preview */}
      <div className="bg-gray-100 p-4 rounded-lg overflow-hidden">
        <div className="transform scale-75 origin-top-left">
          <TemplateComponent 
            data={transformedData}
            colors={theme}
          />
        </div>
      </div>
      
      {/* Preview Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          📋 Live preview using selected template. Changes are reflected in real-time.
        </p>
      </div>
    </div>
  )
}

export default ResumePreview