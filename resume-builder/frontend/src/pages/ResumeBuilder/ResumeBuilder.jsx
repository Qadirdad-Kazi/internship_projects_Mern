import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Palette, FileText, Settings, Save, Eye, AlertCircle, CheckCircle, Users, BookOpen, Code, FolderOpen, Briefcase } from 'lucide-react'
import { 
  PersonalInfoForm, 
  ExperienceForm, 
  EducationForm, 
  SkillsForm, 
  ProjectsForm, 
  TemplateSelection, 
  SettingsPanel, 
  ResumePreview 
} from '../../components/ResumeBuilder'
import { resumeAPI } from '../../services/api'
import { useAuthStore } from '../../stores/authStore'

const ResumeBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  
  const [activeTab, setActiveTab] = useState('content')
  const [activeContentSection, setActiveContentSection] = useState('personal')
  const [resumeData, setResumeData] = useState({
    title: '',
    template: 'modern',
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      website: '',
      linkedin: '',
      github: '',
      portfolio: '',
      profilePicture: '',
      professionalSummary: ''
    },
    experience: [],
    education: [],
    skills: {
      technical: [],
      soft: [],
      languages: []
    },
    projects: [],
    certifications: [],
    achievements: [],
    volunteerWork: [],
    references: [],
    customSections: [],
    settings: {
      visibility: 'private',
      allowPDFDownload: true,
      theme: {
        primaryColor: '#2563eb',
        secondaryColor: '#64748b',
        fontFamily: 'Arial',
        fontSize: 12
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
        showReferences: false
      }
    }
  })
  
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)
  const [showPreview, setShowPreview] = useState(false)

  // Auto-save functionality
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const tabs = [
    { id: 'content', name: 'Content', icon: FileText },
    { id: 'template', name: 'Template', icon: Palette },
    { id: 'settings', name: 'Settings', icon: Settings }
  ]

  const contentSections = [
    { id: 'personal', name: 'Personal Info', icon: Users, required: true },
    { id: 'experience', name: 'Experience', icon: Briefcase, required: true },
    { id: 'education', name: 'Education', icon: BookOpen, required: true },
    { id: 'skills', name: 'Skills', icon: Code, required: true },
    { id: 'projects', name: 'Projects', icon: FolderOpen, required: false }
  ]

  // Load existing resume data
  useEffect(() => {
    if (id && id !== 'new') {
      loadResumeData()
    } else if (user) {
      // Pre-populate with user data for new resume
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          fullName: user.fullName || '',
          email: user.email || ''
        },
        title: `${user.fullName || 'My'} Resume`
      }))
    }
  }, [id, user])

  const loadResumeData = async () => {
    setIsLoading(true)
    try {
      const response = await resumeAPI.getResumeById(id)
      setResumeData(response.data)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error loading resume:', error)
      // Handle error (maybe show notification)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle form changes
  const handleDataChange = useCallback((e) => {
    const { name, value } = e.target
    
    setResumeData(prev => {
      if (name.includes('.')) {
        // Handle nested properties
        const keys = name.split('.')
        const newData = { ...prev }
        let current = newData
        
        for (let i = 0; i < keys.length - 1; i++) {
          current[keys[i]] = { ...current[keys[i]] }
          current = current[keys[i]]
        }
        
        current[keys[keys.length - 1]] = value
        return newData
      } else {
        return {
          ...prev,
          [name]: value
        }
      }
    })
    
    setHasUnsavedChanges(true)
    // Clear any existing error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }))
    }
  }, [errors])

  // Auto-save every 30 seconds if there are unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const autoSaveInterval = setInterval(() => {
      if (hasUnsavedChanges) {
        saveResume(true) // Auto-save
      }
    }, 30000) // 30 seconds

    return () => clearInterval(autoSaveInterval)
  }, [hasUnsavedChanges])

  const saveResume = async (isAutoSave = false) => {
    if (!isAutoSave) setIsSaving(true)
    
    try {
      let response
      if (id && id !== 'new') {
        response = await resumeAPI.updateResume(id, resumeData)
      } else {
        response = await resumeAPI.createResume(resumeData)
        // Update URL to reflect the new resume ID
        navigate(`/dashboard/resume-builder/${response.data._id}`, { replace: true })
      }
      
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
      
      if (!isAutoSave) {
        // Show success notification
        console.log('Resume saved successfully')
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      // Handle validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      if (!isAutoSave) setIsSaving(false)
    }
  }

  const getCompletionPercentage = () => {
    let completed = 0
    const total = 6 // Total sections

    if (resumeData.personalInfo.fullName && resumeData.personalInfo.email) completed++
    if (resumeData.experience.length > 0) completed++
    if (resumeData.education.length > 0) completed++
    if (resumeData.skills.technical.length > 0 || resumeData.skills.soft.length > 0) completed++
    if (resumeData.projects.length > 0) completed++
    if (resumeData.template && resumeData.settings) completed++

    return Math.round((completed / total) * 100)
  }

  const renderContentForm = () => {
    switch (activeContentSection) {
      case 'personal':
        return (
          <PersonalInfoForm 
            data={resumeData.personalInfo}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      case 'experience':
        return (
          <ExperienceForm 
            data={resumeData.experience}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      case 'education':
        return (
          <EducationForm 
            data={resumeData.education}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      case 'skills':
        return (
          <SkillsForm 
            data={resumeData.skills}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      case 'projects':
        return (
          <ProjectsForm 
            data={resumeData.projects}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
            <p className="text-gray-600 mt-1">
              Create and customize your professional resume
            </p>
            
            {/* Progress & Status */}
            <div className="flex items-center space-x-4 mt-3">
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600">{getCompletionPercentage()}% complete</span>
              </div>
              
              {lastSaved && (
                <div className="flex items-center text-sm text-gray-500">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
              
              {hasUnsavedChanges && (
                <div className="flex items-center text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Unsaved changes
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 lg:mt-0">
            <button 
              onClick={() => setShowPreview(!showPreview)}
              className="btn-secondary flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            <button 
              onClick={() => saveResume()}
              disabled={isSaving || !hasUnsavedChanges}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Resume'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Forms Panel */}
          <div className="bg-white shadow-soft rounded-lg">
            {/* Main Tabs */}
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

            {/* Content Sections Sub-navigation (only for content tab) */}
            {activeTab === 'content' && (
              <div className="border-b border-gray-200 bg-gray-50">
                <div className="px-6 py-3">
                  <div className="flex flex-wrap gap-2">
                    {contentSections.map((section) => {
                      const Icon = section.icon
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveContentSection(section.id)}
                          className={`px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                            activeContentSection === section.id
                              ? 'bg-primary-100 text-primary-700'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-1" />
                          {section.name}
                          {section.required && (
                            <span className="ml-1 text-red-500">*</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'content' && renderContentForm()}
              
              {activeTab === 'template' && (
                <TemplateSelection 
                  data={resumeData}
                  onChange={handleDataChange}
                  errors={errors}
                />
              )}

              {activeTab === 'settings' && (
                <SettingsPanel 
                  data={resumeData.settings}
                  onChange={handleDataChange}
                  errors={errors}
                />
              )}
            </div>
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="bg-white shadow-soft rounded-lg">
              <div className="p-6">
                <ResumePreview 
                  data={resumeData}
                  template={resumeData.template}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder