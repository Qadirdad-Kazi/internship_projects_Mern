import { Mail, Phone, MapPin, Globe, Calendar, Building, Palette, Code } from 'lucide-react'

const CreativeTemplate = ({ data, colors = { primary: '#7c3aed', secondary: '#a78bfa', accent: '#c4b5fd' } }) => {
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
      <div className="flex">
        {/* Left Sidebar */}
        <div 
          className="w-1/3 p-8 text-white relative overflow-hidden"
          style={{ backgroundColor: primaryColor }}
        >
          {/* Decorative elements */}
          <div 
            className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
            style={{ backgroundColor: accentColor }}
          ></div>
          <div 
            className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-20"
            style={{ backgroundColor: secondaryColor }}
          ></div>
          
          <div className="relative z-10">
            {/* Profile Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {personalInfo.firstName}
                <br />
                {personalInfo.lastName}
              </h1>
              <p className="text-lg opacity-90">{personalInfo.title}</p>
            </div>

            {/* Contact Info */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                Contact
              </h3>
              <div className="space-y-3 text-sm">
                {personalInfo.email && (
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 opacity-70" />
                    <span className="break-all">{personalInfo.email}</span>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 opacity-70" />
                    {personalInfo.phone}
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 opacity-70" />
                    {personalInfo.location}
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 opacity-70" />
                    <span className="break-all">{personalInfo.website}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills Section */}
            {skills.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Code className="h-5 w-5 mr-2" />
                  Skills
                </h3>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs opacity-80">{skill.level}</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-white transition-all duration-300"
                          style={{ 
                            width: `${skill.level === 'Expert' ? 90 : skill.level === 'Advanced' ? 75 : skill.level === 'Intermediate' ? 60 : 40}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {education.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Palette className="h-5 w-5 mr-2" />
                  Education
                </h3>
                <div className="space-y-4">
                  {education.map((edu, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-sm">{edu.degree}</h4>
                      <p className="text-sm opacity-90">{edu.institution}</p>
                      <p className="text-xs opacity-70">{edu.year}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Content */}
        <div className="w-2/3 p-8">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <section className="mb-8">
              <div className="flex items-center mb-4">
                <div 
                  className="w-1 h-8 mr-4"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                  About Me
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section className="mb-8">
              <div className="flex items-center mb-6">
                <div 
                  className="w-1 h-8 mr-4"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                  Experience
                </h2>
              </div>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <div key={index} className="relative pl-6">
                    {/* Timeline dot */}
                    <div 
                      className="absolute left-0 top-2 w-3 h-3 rounded-full"
                      style={{ backgroundColor: secondaryColor }}
                    ></div>
                    {index < experience.length - 1 && (
                      <div 
                        className="absolute left-1.5 top-5 w-0.5 h-full"
                        style={{ backgroundColor: accentColor }}
                      ></div>
                    )}
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{exp.position}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <Building className="h-4 w-4 mr-1" />
                            <span className="font-medium">{exp.company}</span>
                            {exp.location && <span className="ml-2">• {exp.location}</span>}
                          </div>
                        </div>
                        <div 
                          className="px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: accentColor + '30', 
                            color: primaryColor 
                          }}
                        >
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <div 
                  className="w-1 h-8 mr-4"
                  style={{ backgroundColor: primaryColor }}
                ></div>
                <h2 className="text-2xl font-bold" style={{ color: primaryColor }}>
                  Featured Projects
                </h2>
              </div>
              <div className="grid gap-6">
                {projects.map((project, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    style={{ borderColor: accentColor }}
                  >
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                    <p className="text-gray-700 leading-relaxed mb-3">{project.description}</p>
                    {project.technologies && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.split(',').map((tech, i) => (
                          <span 
                            key={i} 
                            className="px-3 py-1 text-xs rounded-full font-medium"
                            style={{ 
                              backgroundColor: primaryColor + '20', 
                              color: primaryColor 
                            }}
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
      </div>
    </div>
  )
}

export default CreativeTemplate