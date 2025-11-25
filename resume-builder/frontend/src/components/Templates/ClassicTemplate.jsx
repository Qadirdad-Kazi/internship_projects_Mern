import { Mail, Phone, MapPin, Globe, Calendar, Building, GraduationCap } from 'lucide-react'

const ClassicTemplate = ({ data, colors = { primary: '#1f2937', secondary: '#6b7280', accent: '#374151' } }) => {
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
    <div className="w-full max-w-4xl mx-auto bg-white shadow-lg" style={{ fontFamily: 'Times, serif' }}>
      {/* Header Section */}
      <div className="px-8 py-6 border-b-2" style={{ borderColor: primaryColor }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2" style={{ color: primaryColor }}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-xl mb-4" style={{ color: secondaryColor }}>
            {personalInfo.title}
          </p>
          
          <div className="flex justify-center items-center space-x-6 text-sm">
            {personalInfo.email && (
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" style={{ color: secondaryColor }} />
                {personalInfo.email}
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" style={{ color: secondaryColor }} />
                {personalInfo.phone}
              </div>
            )}
            {personalInfo.location && (
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" style={{ color: secondaryColor }} />
                {personalInfo.location}
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-2" style={{ color: secondaryColor }} />
                {personalInfo.website}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-8">
        {/* Professional Summary */}
        {personalInfo.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-3 pb-2 border-b" style={{ color: primaryColor }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">{personalInfo.summary}</p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ color: primaryColor }}>
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{exp.position}</h3>
                      <div className="flex items-center text-gray-700 font-semibold">
                        <Building className="h-4 w-4 mr-1" />
                        <span>{exp.company}</span>
                        {exp.location && <span className="ml-2">| {exp.location}</span>}
                      </div>
                    </div>
                    <div className="text-sm font-semibold" style={{ color: secondaryColor }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-justify">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ color: primaryColor }}>
              EDUCATION
            </h2>
            <div className="space-y-4">
              {education.map((edu, index) => (
                <div key={index} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                    <p className="text-gray-700">{edu.institution}</p>
                  </div>
                  <div className="text-sm font-semibold" style={{ color: secondaryColor }}>
                    {edu.year}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ color: primaryColor }}>
              CORE COMPETENCIES
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {skills.map((skill, index) => (
                <div key={index} className="text-gray-700">
                  • {skill.name}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ color: primaryColor }}>
              KEY PROJECTS
            </h2>
            <div className="space-y-4">
              {projects.map((project, index) => (
                <div key={index}>
                  <h3 className="text-lg font-bold text-gray-900">{project.name}</h3>
                  <p className="text-gray-700 leading-relaxed text-justify">{project.description}</p>
                  {project.technologies && (
                    <p className="text-sm mt-1" style={{ color: secondaryColor }}>
                      <strong>Technologies:</strong> {project.technologies}
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

export default ClassicTemplate