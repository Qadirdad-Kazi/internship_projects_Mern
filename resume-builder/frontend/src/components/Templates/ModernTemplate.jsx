import { Mail, Phone, MapPin, Globe, Calendar, Building, GraduationCap, Award } from 'lucide-react'

const ModernTemplate = ({ data, colors = { primary: '#2563eb', secondary: '#64748b', accent: '#06b6d4' } }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = []
  } = data || {}

  const primaryColor = colors.primary
  const secondaryColor = colors.secondary
  const accentColor = colors.accent

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header Section */}
      <div 
        className="px-8 py-6 text-white"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-xl opacity-90 mb-4">{personalInfo.title}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              {personalInfo.email && (
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {personalInfo.email}
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {personalInfo.phone}
                </div>
              )}
              {personalInfo.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {personalInfo.location}
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  {personalInfo.website}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Left Column */}
        <div className="w-2/3 p-8">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-3" style={{ color: primaryColor }}>
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
                Professional Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building className="h-4 w-4 mr-1" />
                          <span className="font-medium">{exp.company}</span>
                          {exp.location && <span className="ml-2">• {exp.location}</span>}
                        </div>
                      </div>
                      <div className="flex items-center text-sm" style={{ color: secondaryColor }}>
                        <Calendar className="h-4 w-4 mr-1" />
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-gray-700 leading-relaxed mb-2">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.split(',').map((tech, i) => (
                          <span 
                            key={i} 
                            className="px-2 py-1 text-xs rounded"
                            style={{ backgroundColor: accentColor + '20', color: primaryColor }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="w-1/3 bg-gray-50 p-6">
          {/* Education */}
          {education.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>
                <GraduationCap className="h-5 w-5 inline mr-2" />
                Education
              </h2>
              <div className="space-y-4">
                {education.map((edu, index) => (
                  <div key={index}>
                    <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-600 text-sm">{edu.institution}</p>
                    <p className="text-gray-500 text-xs">{edu.year}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4" style={{ color: primaryColor }}>
                <Award className="h-5 w-5 inline mr-2" />
                Skills
              </h2>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                      <span className="text-xs text-gray-500">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          backgroundColor: accentColor,
                          width: `${skill.level === 'Expert' ? 90 : skill.level === 'Advanced' ? 75 : skill.level === 'Intermediate' ? 60 : 40}%`
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}

export default ModernTemplate