import { useState } from 'react'
import { Settings, Eye, EyeOff, Download, Share2, Lock, Globe, Link } from 'lucide-react'
import { FormSelect } from '../Forms'

const SettingsPanel = ({ data = {}, onChange, errors = {} }) => {
  const visibilityOptions = [
    { value: 'private', label: 'Private', description: 'Only you can see this resume' },
    { value: 'unlisted', label: 'Unlisted', description: 'Anyone with the link can view' },
    { value: 'public', label: 'Public', description: 'Searchable and discoverable by anyone' }
  ]

  const fontSizeOptions = [
    { value: 10, label: '10pt - Small' },
    { value: 11, label: '11pt - Default Small' },
    { value: 12, label: '12pt - Standard' },
    { value: 13, label: '13pt - Comfortable' },
    { value: 14, label: '14pt - Large' },
    { value: 15, label: '15pt - Extra Large' },
    { value: 16, label: '16pt - Maximum' }
  ]

  const settings = {
    visibility: data.visibility || 'private',
    allowPDFDownload: data.allowPDFDownload !== undefined ? data.allowPDFDownload : true,
    theme: {
      fontSize: data.theme?.fontSize || 12,
      ...data.theme
    },
    sections: {
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
      ...data.sections
    },
    ...data
  }

  const handleSettingChange = (field, value) => {
    onChange({
      target: {
        name: 'settings',
        value: {
          ...settings,
          [field]: value
        }
      }
    })
  }

  const handleSectionToggle = (section, enabled) => {
    onChange({
      target: {
        name: 'settings',
        value: {
          ...settings,
          sections: {
            ...settings.sections,
            [section]: enabled
          }
        }
      }
    })
  }

  const handleThemeChange = (field, value) => {
    onChange({
      target: {
        name: 'settings',
        value: {
          ...settings,
          theme: {
            ...settings.theme,
            [field]: value
          }
        }
      }
    })
  }

  const sectionOptions = [
    { key: 'showProfilePicture', label: 'Profile Picture', description: 'Display your profile photo' },
    { key: 'showProfessionalSummary', label: 'Professional Summary', description: 'Brief overview of your background' },
    { key: 'showExperience', label: 'Work Experience', description: 'Employment history and roles', required: true },
    { key: 'showEducation', label: 'Education', description: 'Educational background and degrees', required: true },
    { key: 'showSkills', label: 'Skills', description: 'Technical and soft skills', required: true },
    { key: 'showProjects', label: 'Projects', description: 'Personal and professional projects' },
    { key: 'showCertifications', label: 'Certifications', description: 'Professional certifications and licenses' },
    { key: 'showAchievements', label: 'Achievements', description: 'Awards and notable accomplishments' },
    { key: 'showVolunteerWork', label: 'Volunteer Work', description: 'Community service and volunteer activities' },
    { key: 'showReferences', label: 'References', description: 'Professional references' }
  ]

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Settings className="h-5 w-5 mr-2 text-primary-500" />
          Resume Settings
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure privacy, sharing options, and customize which sections to display
        </p>
      </div>

      {/* Privacy & Sharing */}
      <div className="space-y-6">
        <h4 className="text-md font-medium text-gray-900 flex items-center">
          <Lock className="h-4 w-4 mr-2" />
          Privacy & Sharing
        </h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume Visibility
            </label>
            <div className="space-y-3">
              {visibilityOptions.map((option) => (
                <label key={option.value} className="flex items-start">
                  <input
                    type="radio"
                    name="visibility"
                    value={option.value}
                    checked={settings.visibility === option.value}
                    onChange={(e) => handleSettingChange('visibility', e.target.value)}
                    className="mt-0.5 h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900">{option.label}</span>
                      {option.value === 'private' && <Lock className="h-3 w-3 ml-1 text-gray-500" />}
                      {option.value === 'unlisted' && <Link className="h-3 w-3 ml-1 text-gray-500" />}
                      {option.value === 'public' && <Globe className="h-3 w-3 ml-1 text-gray-500" />}
                    </div>
                    <p className="text-xs text-gray-500">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <Download className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
              <div>
                <h5 className="text-sm font-medium text-gray-900">Allow PDF Downloads</h5>
                <p className="text-xs text-gray-500">Let viewers download your resume as a PDF</p>
              </div>
            </div>
            <button
              onClick={() => handleSettingChange('allowPDFDownload', !settings.allowPDFDownload)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.allowPDFDownload ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.allowPDFDownload ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Typography</h4>
        
        <FormSelect
          label="Font Size"
          name="fontSize"
          value={settings.theme?.fontSize || 12}
          onChange={(e) => handleThemeChange('fontSize', parseInt(e.target.value))}
          options={fontSizeOptions}
        />
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 <strong>Tip:</strong> Standard resume font size is 11-12pt. Use larger sizes only if you have minimal content.
          </p>
        </div>
      </div>

      {/* Section Visibility */}
      <div className="space-y-6">
        <h4 className="text-md font-medium text-gray-900 flex items-center">
          <Eye className="h-4 w-4 mr-2" />
          Section Visibility
        </h4>
        
        <div className="space-y-4">
          {sectionOptions.map((section) => (
            <div key={section.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  {settings.sections[section.key] ? (
                    <Eye className="h-4 w-4 text-green-500" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <h5 className="text-sm font-medium text-gray-900">{section.label}</h5>
                    {section.required && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{section.description}</p>
                </div>
              </div>
              
              <button
                onClick={() => handleSectionToggle(section.key, !settings.sections[section.key])}
                disabled={section.required}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  section.required 
                    ? 'bg-gray-300 cursor-not-allowed'
                    : settings.sections[section.key] 
                      ? 'bg-primary-600' 
                      : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.sections[section.key] ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            ⚠️ <strong>Note:</strong> Required sections (Experience, Education, Skills) cannot be hidden as they are essential for a complete resume.
          </p>
        </div>
      </div>

      {/* Export Preferences */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Preferences
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 mb-2">PDF Settings</h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Letter size (8.5" × 11")</li>
              <li>• High-quality resolution</li>
              <li>• Embedded fonts</li>
              <li>• ATS-compatible format</li>
            </ul>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <h5 className="text-sm font-medium text-gray-900 mb-2">Sharing Options</h5>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Unique shareable links</li>
              <li>• View-only access</li>
              <li>• Download tracking</li>
              <li>• Password protection (Pro)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Pro Features Teaser */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
        <h5 className="text-sm font-medium text-purple-900 mb-2 flex items-center">
          <Share2 className="h-4 w-4 mr-2" />
          🚀 Pro Features Coming Soon
        </h5>
        <ul className="text-xs text-purple-800 space-y-1">
          <li>• Custom domain for resume links</li>
          <li>• Advanced analytics and tracking</li>
          <li>• Password-protected sharing</li>
          <li>• Custom branding and watermarks</li>
          <li>• Multiple export formats (Word, HTML)</li>
        </ul>
      </div>
    </div>
  )
}

export default SettingsPanel