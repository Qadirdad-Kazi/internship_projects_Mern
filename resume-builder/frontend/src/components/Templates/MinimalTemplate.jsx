import { Mail, Phone, MapPin, Globe } from 'lucide-react'

const MinimalTemplate = ({ data, colors = { primary: '#000000', secondary: '#525252', accent: '#737373' } }) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    projects = []
  } = data || {}

  const primaryColor = colors.primary
  const secondaryColor = colors.secondary

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="p-12">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-5xl font-light mb-4" style={{ color: primaryColor }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-2xl font-light mb-8" style={{ color: secondaryColor }}>
            {personalInfo.title}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm" style={{ color: secondaryColor }}>
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

        {/* Professional Summary */}
        {personalInfo.summary && (
          <section className="mb-12">
            <h2 className="text-sm font-medium uppercase tracking-wide mb-6" style={{ color: primaryColor }}>
              About
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg font-light">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-medium uppercase tracking-wide mb-6" style={{ color: primaryColor }}>
              Experience
            </h2>
            <div className="space-y-8">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="md:col-span-2">
                      <h3 className="text-xl font-light text-gray-900 mb-1">{exp.position}</h3>
                      <p className="font-medium" style={{ color: secondaryColor }}>
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-sm font-light" style={{ color: secondaryColor }}>
                      {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-light">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-medium uppercase tracking-wide mb-6" style={{ color: primaryColor }}>
              Education
            </h2>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <h3 className="text-lg font-light text-gray-900">{edu.degree}</h3>
                    <p className="font-medium" style={{ color: secondaryColor }}>{edu.institution}</p>
                  </div>
                  <div className="text-sm font-light" style={{ color: secondaryColor }}>
                    {edu.year}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-12">
            <h2 className="text-sm font-medium uppercase tracking-wide mb-6" style={{ color: primaryColor }}>
              Skills
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <div key={index}>
                  <p className="text-gray-700 font-light">{skill.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section>
            <h2 className="text-sm font-medium uppercase tracking-wide mb-6" style={{ color: primaryColor }}>
              Projects
            </h2>
            <div className="space-y-8">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-xl font-light text-gray-900 mb-2">{project.name}</h3>
                  <p className="text-gray-700 leading-relaxed font-light mb-3">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm font-light" style={{ color: secondaryColor }}>
                      {project.technologies}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default MinimalTemplate