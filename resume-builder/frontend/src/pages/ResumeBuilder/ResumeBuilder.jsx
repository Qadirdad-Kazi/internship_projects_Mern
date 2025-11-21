import { useState } from 'react'
import { Palette, FileText, Settings, Save } from 'lucide-react'

const ResumeBuilder = () => {
  const [activeTab, setActiveTab] = useState('content')
  
  const tabs = [
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'template', name: 'Template', icon: Palette },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
          <p className="text-gray-600 mt-1">Create and customize your professional resume</p>
        </div>
        <button className="btn-primary mt-4 sm:mt-0">
          <Save className="h-5 w-5 mr-2" />
          Save Resume
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow-soft rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'content' && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Content Editor</h3>
              <p className="text-gray-600">
                This will contain forms for personal info, experience, education, skills, etc.
              </p>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="text-center py-12">
              <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Template Selection</h3>
              <p className="text-gray-600">
                Choose from various professional resume templates and customize colors.
              </p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Resume Settings</h3>
              <p className="text-gray-600">
                Configure privacy, sharing options, and export preferences.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder