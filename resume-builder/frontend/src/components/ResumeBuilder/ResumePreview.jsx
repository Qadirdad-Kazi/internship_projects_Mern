import { FileText, Download, Eye, ExternalLink } from 'lucide-react'

const ResumePreview = ({ data = {}, template = 'modern' }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = {},
    projects = [],
    settings = {}
  } = data

  const theme = {
    primaryColor: '#2563eb',
    secondaryColor: '#64748b',
    fontFamily: 'Arial',
    fontSize: 12,
    ...settings.theme
  }

  const sections = {
    showProfilePicture: true,
    showProfessionalSummary: true,
    showExperience: true,
    showEducation: true,
    showSkills: true,
    showProjects: true,
    showCertifications: false,
    showAchievements: false,
    showVolunteerWork: false,
    showReferences: false,
    ...settings.sections
  }

  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const previewStyle = {
    fontFamily: theme.fontFamily,
    fontSize: `${theme.fontSize}px`,
    lineHeight: 1.4
  }

  // If no data yet, show placeholder
  if (!personalInfo.fullName && experience.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
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
          Live Preview
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

      {/* Resume Preview */}
      <div 
        className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm"
        style={previewStyle}
      >
        {/* Header Section */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 
                className="text-2xl font-bold mb-2" 
                style={{ color: theme.primaryColor }}
              >
                {personalInfo.fullName || 'Your Name'}
              </h1>
              
              <div className="text-sm text-gray-600 space-y-1">
                {personalInfo.email && (
                  <div>{personalInfo.email}</div>
                )}
                {personalInfo.phone && (
                  <div>{personalInfo.phone}</div>
                )}
                {personalInfo.address && (
                  <div>
                    {[
                      personalInfo.address.city,
                      personalInfo.address.state,
                      personalInfo.address.country
                    ].filter(Boolean).join(', ')}
                  </div>
                )}
                {(personalInfo.website || personalInfo.linkedin) && (
                  <div className="flex space-x-4">
                    {personalInfo.website && (
                      <span className="text-blue-600">{personalInfo.website}</span>
                    )}
                    {personalInfo.linkedin && (
                      <span className="text-blue-600">LinkedIn</span>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {sections.showProfilePicture && personalInfo.profilePicture && (
              <div className="ml-6">
                <img 
                  src={personalInfo.profilePicture} 
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {sections.showProfessionalSummary && personalInfo.professionalSummary && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-3" 
              style={{ color: theme.primaryColor }}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {personalInfo.professionalSummary}
            </p>
          </div>
        )}

        {/* Experience */}
        {sections.showExperience && experience.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-4" 
              style={{ color: theme.primaryColor }}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp, index) => (
                <div key={index} className="border-l-2 border-gray-100 pl-4">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {exp.jobTitle}
                      </h3>
                      <p className="text-gray-700">{exp.company}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(exp.startDate)} - {exp.isCurrentJob ? 'Present' : formatDate(exp.endDate)}
                    </div>
                  </div>
                  {exp.location && (
                    <p className="text-sm text-gray-600 mb-2">{exp.location}</p>
                  )}
                  {exp.description && (
                    <p className="text-sm text-gray-700 mb-2">{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                    <ul className="text-sm text-gray-700 space-y-1">
                      {exp.achievements.filter(Boolean).map((achievement, i) => (
                        <li key={i}>• {achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {sections.showEducation && education.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-4" 
              style={{ color: theme.primaryColor }}
            >
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.institution}</p>
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(edu.startDate)} - {edu.isCurrentlyEnrolled ? 'Present' : formatDate(edu.endDate)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {sections.showSkills && (skills.technical?.length > 0 || skills.soft?.length > 0) && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-4" 
              style={{ color: theme.primaryColor }}
            >
              Skills
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.technical && skills.technical.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {skills.soft && skills.soft.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.filter(Boolean).map((skill, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Projects */}
        {sections.showProjects && projects.length > 0 && (
          <div className="mb-6">
            <h2 
              className="text-lg font-semibold mb-4" 
              style={{ color: theme.primaryColor }}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <div className="text-sm text-gray-500">
                      {formatDate(project.startDate)} - {project.isOngoing ? 'Ongoing' : formatDate(project.endDate)}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-700 mb-2">{project.description}</p>
                  )}
                  {project.technologies && project.technologies.filter(Boolean).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {project.technologies.filter(Boolean).map((tech, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          📋 This is a simplified preview. The final PDF will include additional formatting and styling options.
        </p>
      </div>
    </div>
  )
}

export default ResumePreview