import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
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
import templates from '../../components/Templates/index'

const ResumeBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  
  const [activeTab, setActiveTab] = useState('content')
  const [activeContentSection, setActiveContentSection] = useState('personal')
  
  // Get initial template from URL params, user preferences, or fallback
  const getInitialTemplate = () => {
    const searchParams = new URLSearchParams(location.search)
    const urlTemplate = searchParams.get('template')
    
    if (urlTemplate) {
      // Validate that the template exists
      const templateExists = templates.some(t => t.id === urlTemplate)
      if (templateExists) {
        return urlTemplate
      }
    }
    
    return user?.preferences?.defaultTemplate || 'modern-professional'
  }

  // Get template from URL params or use default
  const urlParams = new URLSearchParams(location.search)
  const templateFromUrl = urlParams.get('template')
  
  const [resumeData, setResumeData] = useState({
    title: '',
    template: templateFromUrl || getInitialTemplate(),
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
  const [showPreview, setShowPreview] = useState(true)
  const [lastSaveAttempt, setLastSaveAttempt] = useState(null)
  const [rateLimitCountdown, setRateLimitCountdown] = useState(0)

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
      
      // Check if response has the expected structure
      const resumeData = response.data?.data?.resume || response.data
      
      if (!resumeData) {
        throw new Error('Invalid response structure')
      }
      
      setResumeData(resumeData)
      setLastSaved(new Date())
    } catch (error) {
      console.error('Error loading resume:', error)
      console.error('Response structure:', response?.data)
      // Handle error (maybe show notification or redirect)
      alert('Failed to load resume data. Please try again.')
      navigate('/resumes')
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

  // Debounced auto-save - save 2 minutes after last change to prevent rate limiting
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const autoSaveTimeout = setTimeout(() => {
      if (hasUnsavedChanges) {
        saveResume(true) // Auto-save
      }
    }, 300000) // 5 minutes delay

    return () => clearTimeout(autoSaveTimeout)
  }, [hasUnsavedChanges, resumeData]) // Re-run when data changes

  // Update rate limit countdown
  useEffect(() => {
    if (!lastSaveAttempt) return

    const updateCountdown = () => {
      const now = new Date().getTime()
      const timeLeft = Math.max(0, 5000 - (now - lastSaveAttempt))
      setRateLimitCountdown(Math.ceil(timeLeft / 1000))
      
      if (timeLeft <= 0) {
        setLastSaveAttempt(null)
        setRateLimitCountdown(0)
      }
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [lastSaveAttempt])

  const saveResume = async (isAutoSave = false) => {
    // Prevent too frequent saves (minimum 5 seconds between saves)
    const now = new Date().getTime()
    if (lastSaveAttempt && (now - lastSaveAttempt) < 5000) {
      if (!isAutoSave) {
        alert('Please wait before saving again. Saves are limited to prevent server overload.')
      }
      return
    }
    
    setLastSaveAttempt(now)
    if (!isAutoSave) setIsSaving(true)
    
    try {
      // Prepare data with draft status
      const dataToSave = {
        ...resumeData,
        isDraft: true, // Mark as draft when saving
        lastModified: new Date().toISOString()
      }
      
      let response
      if (id && id !== 'new') {
        response = await resumeAPI.updateResume(id, dataToSave)
      } else {
        // For new resumes, first create with minimal data
        const createData = {
          title: resumeData.title || 'Untitled Resume',
          template: resumeData.template || 'modern-professional'
        }
        
        console.log('Creating resume with data:', createData)
        response = await resumeAPI.createResume(createData)
        
        // Check if response has the expected structure
        if (!response?.data?.data?.resume?._id) {
          console.error('Unexpected response structure:', response)
          throw new Error('Invalid response from server')
        }
        
        const newResumeId = response.data.data.resume._id
        
        // Update URL to reflect the new resume ID
        navigate(`/resume-builder/${newResumeId}`, { replace: true })
        
        // Then update with full data as draft
        response = await resumeAPI.updateResume(newResumeId, dataToSave)
      }
      
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
      
      if (!isAutoSave) {
        // Show success notification for draft save
        console.log('Resume draft saved successfully')
        alert('Resume saved as draft! You can continue editing anytime.')
      }
    } catch (error) {
      console.error('Error saving resume:', error)
      console.error('Error details:', error.response?.data)
      
      // Handle rate limiting specifically
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || 60
        if (!isAutoSave) {
          alert(`Rate limit exceeded. Please wait ${Math.ceil(retryAfter / 1000)} seconds before trying again.`)
        }
        // Set a longer delay before allowing next save
        setLastSaveAttempt(now + retryAfter)
        return
      }
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
      
      // Show user-friendly error message
      if (!isAutoSave) {
        if (error.response?.status === 400) {
          alert('Please check the form for validation errors and try again.')
        } else {
          alert('Failed to save resume. Please try again in a moment.')
        }
      }
    } finally {
      if (!isAutoSave) setIsSaving(false)
    }
  }

  const publishResume = async () => {
    // Check rate limiting for publish as well
    const now = new Date().getTime()
    if (lastSaveAttempt && (now - lastSaveAttempt) < 5000) {
      alert('Please wait before publishing. Operations are limited to prevent server overload.')
      return
    }
    
    setLastSaveAttempt(now)
    setIsSaving(true)
    
    try {
      // Validate required fields
      if (!resumeData.personalInfo?.fullName || !resumeData.personalInfo?.email) {
        alert('Please fill in at least your name and email before publishing.')
        return
      }

      // Prepare data for publishing (mark as not draft)
      const publishData = {
        ...resumeData,
        isDraft: false,
        publishedAt: new Date().toISOString()
      }
      
      let response
      if (id && id !== 'new') {
        response = await resumeAPI.updateResume(id, publishData)
      } else {
        // Create new resume if it doesn't exist
        const createData = {
          title: resumeData.title || 'My Resume',
          template: resumeData.template || 'modern'
        }
        
        response = await resumeAPI.createResume(createData)
        const newResumeId = response.data.resume._id
        
        navigate(`/dashboard/resume-builder/${newResumeId}`, { replace: true })
        response = await resumeAPI.updateResume(newResumeId, publishData)
      }
      
      setHasUnsavedChanges(false)
      setLastSaved(new Date())
      
      alert('Resume published successfully! It\'s now ready to share and download.')
      console.log('Resume published successfully')
      
    } catch (error) {
      console.error('Error publishing resume:', error)
      console.error('Error details:', error.response?.data)
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter || 60
        alert(`Rate limit exceeded. Please wait ${Math.ceil(retryAfter / 1000)} seconds before trying again.`)
        setLastSaveAttempt(now + retryAfter)
        return
      }
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
      
      alert('Failed to publish resume. Please check the form for errors and try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getCompletionPercentage = () => {
    if (!resumeData) return 0
    
    let completed = 0
    const total = 6 // Total sections

    // Check personal info section
    if (resumeData.personalInfo?.fullName && resumeData.personalInfo?.email) completed++
    
    // Check experience section
    if (resumeData.experience && resumeData.experience.length > 0) completed++
    
    // Check education section
    if (resumeData.education && resumeData.education.length > 0) completed++
    
    // Check skills section
    if (resumeData.skills && (
      (resumeData.skills.technical && resumeData.skills.technical.length > 0) || 
      (resumeData.skills.soft && resumeData.skills.soft.length > 0)
    )) completed++
    
    // Check projects section
    if (resumeData.projects && resumeData.projects.length > 0) completed++
    
    // Check template and settings
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
                  Draft saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
              
              {hasUnsavedChanges && (
                <div className="flex items-center text-sm text-amber-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Unsaved changes
                </div>
              )}
              
              {rateLimitCountdown > 0 && (
                <div className="flex items-center text-sm text-red-600">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Please wait {rateLimitCountdown}s before saving again
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
              disabled={isSaving || (!hasUnsavedChanges && id !== 'new') || (lastSaveAttempt && (new Date().getTime() - lastSaveAttempt) < 5000)}
              className="btn-secondary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving Draft...' : (id === 'new' ? 'Save Draft' : 'Save Draft')}
            </button>
            
            <button 
              onClick={() => publishResume()}
              disabled={isSaving || !resumeData.personalInfo?.fullName || !resumeData.personalInfo?.email || (lastSaveAttempt && (new Date().getTime() - lastSaveAttempt) < 5000)}
              className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
              title={(!resumeData.personalInfo?.fullName || !resumeData.personalInfo?.email) ? 'Please fill in at least your name and email to publish' : ''}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Publish Resume
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`grid gap-6 ${showPreview ? 'grid-cols-1 lg:grid-cols-5' : 'grid-cols-1'}`}>
          {/* Forms Panel */}
          <div className={`bg-white shadow-soft rounded-lg ${showPreview ? 'lg:col-span-2' : 'col-span-1'}`}>
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
            <div className="bg-white shadow-soft rounded-lg lg:col-span-3">
              <div className="p-4 h-full">
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