import { useState } from 'react'
import { X } from 'lucide-react'
import templates from './index'

const TemplatePreview = ({ templateId, isOpen, onClose, onUseTemplate }) => {
  const template = templates.find(t => t.id === templateId)
  
  // Sample data for preview
  const sampleData = {
    personalInfo: {
      firstName: 'John',
      lastName: 'Doe',
      title: 'Senior Software Engineer',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      website: 'johndoe.dev',
      summary: 'Experienced software engineer with 5+ years of expertise in full-stack development. Passionate about creating scalable applications and leading cross-functional teams to deliver high-quality solutions.'
    },
    experience: [
      {
        position: 'Senior Software Engineer',
        company: 'Tech Corp',
        location: 'New York, NY',
        startDate: '2021',
        endDate: 'Present',
        current: true,
        description: 'Led development of microservices architecture serving 1M+ users. Mentored junior developers and improved deployment efficiency by 40% through CI/CD implementation.'
      },
      {
        position: 'Software Engineer',
        company: 'StartupXYZ',
        location: 'San Francisco, CA',
        startDate: '2019',
        endDate: '2021',
        current: false,
        description: 'Built responsive web applications using React and Node.js. Collaborated with product team to deliver features that increased user engagement by 25%.'
      }
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Stanford University',
        year: '2019'
      }
    ],
    skills: [
      { name: 'JavaScript', level: 'Expert' },
      { name: 'React', level: 'Advanced' },
      { name: 'Node.js', level: 'Advanced' },
      { name: 'Python', level: 'Intermediate' },
      { name: 'AWS', level: 'Intermediate' }
    ],
    projects: [
      {
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform with React, Node.js, and MongoDB. Implemented payment processing and inventory management.',
        technologies: 'React, Node.js, MongoDB, Stripe API'
      },
      {
        name: 'Task Management App',
        description: 'Developed a collaborative task management application with real-time updates using WebSocket technology.',
        technologies: 'Vue.js, Express.js, Socket.io, PostgreSQL'
      }
    ]
  }

  if (!isOpen || !template) return null

  const TemplateComponent = template.component

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{template.name}</h2>
            <p className="text-gray-600">{template.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onUseTemplate(template)}
              className="btn-primary"
            >
              Use This Template
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>
        
        {/* Preview Content */}
        <div className="overflow-auto max-h-[calc(90vh-120px)] bg-gray-100 p-8">
          <div className="flex justify-center">
            <div className="transform scale-75 origin-top">
              <TemplateComponent 
                data={sampleData} 
                colors={template.colors}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplatePreview