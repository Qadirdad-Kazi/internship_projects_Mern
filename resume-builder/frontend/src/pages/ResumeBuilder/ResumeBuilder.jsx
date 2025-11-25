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
import toast from 'react-hot-toast'
import templates from '../../components/Templates/index'

const ResumeBuilder = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuthStore()
  
  // Clean resume data for backend validation
  const cleanResumeData = (data) => {
    const cleaned = { ...data }
    
    // Clean personalInfo
    if (cleaned.personalInfo) {
      // Remove empty email if not valid
      if (cleaned.personalInfo.email && !cleaned.personalInfo.email.includes('@')) {
        cleaned.personalInfo.email = ''
      }
      
      // Clean URLs - add https if missing but preserve the value
      const urlFields = ['website', 'linkedin', 'github', 'portfolio']
      urlFields.forEach(field => {
        if (cleaned.personalInfo[field]) {
          const value = cleaned.personalInfo[field].trim()
          if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
            cleaned.personalInfo[field] = `https://${value}`
          }
        }
      })
      
      console.log('Cleaned personalInfo URLs:', {
        website: cleaned.personalInfo.website,
        linkedin: cleaned.personalInfo.linkedin,
        github: cleaned.personalInfo.github,
        portfolio: cleaned.personalInfo.portfolio
      })
    }
    
    // Clean experience dates and arrays (preserve structure)
    if (cleaned.experience) {
      console.log('[DEBUGGING] Cleaning Experience Data:', {
        originalExperience: cleaned.experience,
        experienceCount: cleaned.experience.length,
        locationFields: cleaned.experience.map((exp, i) => ({ index: i, location: exp.location }))
      })
      
      cleaned.experience = cleaned.experience.map(exp => ({
        ...exp,
        startDate: exp.startDate ? new Date(exp.startDate).toISOString() : null,
        endDate: exp.endDate && !exp.isCurrentJob ? new Date(exp.endDate).toISOString() : null,
        achievements: exp.achievements ? exp.achievements.filter(item => item && item.trim()) : [],
        technologies: exp.technologies ? exp.technologies.filter(item => item && item.trim()) : []
      }))
      
      console.log('[DEBUGGING] Cleaned Experience Data:', {
        cleanedExperience: cleaned.experience,
        cleanedExperienceCount: cleaned.experience.length,
        cleanedLocationFields: cleaned.experience.map((exp, i) => ({ index: i, location: exp.location }))
      })
    } else {
      // Preserve empty array structure
      cleaned.experience = []
    }
    
    // Clean education dates  
    if (cleaned.education) {
      cleaned.education = cleaned.education.map(edu => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
        endDate: edu.endDate && !edu.isCurrentlyEnrolled ? new Date(edu.endDate).toISOString() : null
      }))
    }
    
    // Clean projects
    if (cleaned.projects) {
      console.log('[DEBUGGING] Cleaning Projects Data:', {
        originalProjects: cleaned.projects,
        projectsCount: cleaned.projects.length
      })
      
      cleaned.projects = cleaned.projects.map(project => ({
        ...project,
        startDate: project.startDate ? new Date(project.startDate).toISOString() : null,
        endDate: project.endDate && !project.isOngoing ? new Date(project.endDate).toISOString() : null,
        // Ensure technologies is array and filter empty strings
        technologies: Array.isArray(project.technologies) ? 
          project.technologies.filter(tech => tech && tech.trim()) : 
          (project.technologies ? project.technologies.split(',').map(t => t.trim()).filter(t => t) : []),
        achievements: project.achievements ? project.achievements.filter(item => item && item.trim()) : []
      }))
      
      console.log('[DEBUGGING] Cleaned Projects Data:', {
        cleanedProjects: cleaned.projects,
        cleanedProjectsCount: cleaned.projects.length
      })
    }
    
    // Clean skills arrays
    if (cleaned.skills) {
      console.log('[DEBUGGING] Cleaning Skills Data:', {
        originalSkills: cleaned.skills,
        technicalCount: cleaned.skills.technical?.length || 0,
        softCount: cleaned.skills.soft?.length || 0,
        languagesCount: cleaned.skills.languages?.length || 0
      })
      
      if (cleaned.skills.soft) {
        cleaned.skills.soft = cleaned.skills.soft.filter(skill => skill && skill.trim())
      }
      if (cleaned.skills.technical) {
        cleaned.skills.technical = cleaned.skills.technical.filter(skill => skill && skill.name && skill.name.trim())
      }
      
      console.log('[DEBUGGING] Cleaned Skills Data:', {
        cleanedSkills: cleaned.skills,
        cleanedTechnicalCount: cleaned.skills.technical?.length || 0,
        cleanedSoftCount: cleaned.skills.soft?.length || 0,
        cleanedLanguagesCount: cleaned.skills.languages?.length || 0
      })
    }
    
    // Clean education arrays
    if (cleaned.education) {
      console.log('[DEBUGGING] Cleaning Education Data:', {
        originalEducation: cleaned.education,
        educationCount: cleaned.education.length
      })
      
      cleaned.education = cleaned.education.map(edu => ({
        ...edu,
        startDate: edu.startDate ? new Date(edu.startDate).toISOString() : null,
        endDate: edu.endDate && !edu.isCurrentlyEnrolled ? new Date(edu.endDate).toISOString() : null,
        honors: edu.honors ? edu.honors.filter(honor => honor && honor.trim()) : [],
        relevantCoursework: edu.relevantCoursework ? edu.relevantCoursework.filter(course => course && course.trim()) : []
      }))
      
      console.log('[DEBUGGING] Cleaned Education Data:', {
        cleanedEducation: cleaned.education,
        cleanedEducationCount: cleaned.education.length
      })
    }
    
    // Remove fields that cause validation issues
    delete cleaned.lastModified
    
    return cleaned
  }
  
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
    console.log('[MAIN USEEFFECT] Loading data - id:', id, 'condition:', id && id !== 'new')
    console.log('[MAIN USEEFFECT] Current resume data before loading:', {
      experience: resumeData.experience?.length,
      experienceLocations: resumeData.experience?.map((exp, i) => ({ index: i, location: exp.location })) || [],
      education: resumeData.education?.length,
      skills: resumeData.skills,
      projects: resumeData.projects?.length
    })
    
    if (id && id !== 'new') {
      console.log('[MAIN USEEFFECT] Calling loadResumeData for id:', id)
      loadResumeData()
    } else if (user) {
      console.log('[MAIN USEEFFECT] Not loading existing data - creating new resume or pre-populating user data')
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
      
      // Debug logging
      console.log('Load resume response:', response.data)
      
      // Check if response has the expected structure
      const resumeData = response.data?.data?.resume || response.data
      
      console.log('Loaded resume data:', resumeData)
      console.log('Experience data:', resumeData.experience)
      console.log('Education data:', resumeData.education)
      console.log('Skills data:', resumeData.skills)
      console.log('[PROJECTS LOADING DEBUG] Projects data from backend:', resumeData.projects)
      console.log('[PROJECTS LOADING DEBUG] Projects count:', resumeData.projects?.length || 0)
      console.log('[PROJECTS LOADING DEBUG] Individual projects:', resumeData.projects?.map((project, i) => ({
        index: i,
        name: project.name,
        description: project.description?.substring(0, 50) + '...',
        technologiesCount: project.technologies?.length || 0
      })))
      
      if (!resumeData) {
        throw new Error('Invalid response structure')
      }
      
      // Ensure proper structure with fallbacks
      const structuredData = {
        ...resumeData,
        personalInfo: {
          fullName: '',
          email: '',
          phone: '',
          address: { street: '', city: '', state: '', zipCode: '', country: '' },
          website: '',
          linkedin: '',
          github: '',
          portfolio: '',
          profilePicture: '',
          professionalSummary: '',
          ...resumeData.personalInfo
        },
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || { technical: [], soft: [], languages: [] },
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || [],
        achievements: resumeData.achievements || [],
        volunteerWork: resumeData.volunteerWork || [],
        references: resumeData.references || [],
        customSections: resumeData.customSections || []
      }
      
      console.log('PersonalInfo loaded from backend:', resumeData.personalInfo)
      console.log('PersonalInfo after structuring:', structuredData.personalInfo)
      
      console.log('[PROJECTS LOADING DEBUG] Structured projects data:', structuredData.projects)
      console.log('[PROJECTS LOADING DEBUG] Structured projects count:', structuredData.projects?.length || 0)
      
      console.log('Setting structured data:', structuredData)
      setResumeData(structuredData)
      setLastSaved(new Date())
      
      // Verify state after setting
      setTimeout(() => {
        console.log('Resume data state after loading:')
        console.log('Experience:', structuredData.experience)
        console.log('Education:', structuredData.education) 
        console.log('Skills:', structuredData.skills)
        console.log('[PROJECTS LOADING DEBUG] Projects after state setting:', structuredData.projects)
        console.log('[PROJECTS LOADING DEBUG] Projects state verification:', {
          projectsLength: structuredData.projects?.length || 0,
          firstProject: structuredData.projects?.[0] || 'No projects',
          hasProjects: !!(structuredData.projects && structuredData.projects.length > 0)
        })
      }, 100)
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
    
    // Debug form changes
    if (name.includes('personalInfo')) {
      console.log('PersonalInfo field changed:', name, '=', value)
    }
    if (name === 'experience') {
      console.log('[EXPERIENCE CHANGE DEBUG] Experience array changed, new length:', value.length)
      console.log('[EXPERIENCE CHANGE DEBUG] Experience locations:', value.map((exp, i) => ({ 
        index: i, 
        location: exp.location, 
        hasLocation: !!exp.location 
      })))
    }
    if (name === 'education') {
      console.log('Education array changed, new length:', value.length)
    }
    if (name === 'skills') {
      console.log('Skills object changed:', value)
    }
    if (name === 'projects') {
      console.log('Projects array changed, new length:', value.length)
    }
    
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
        
        // Debug state after nested change
        if (name.includes('experience') || name.includes('education') || name.includes('skills') || name.includes('projects')) {
          console.log('State updated for:', name, 'New data:', newData[keys[0]])
        }
        
        return newData
      } else {
        // Handle direct properties
        const newState = {
          ...prev,
          [name]: value
        }
        
        // Debug state after direct change
        if (['experience', 'education', 'skills', 'projects'].includes(name)) {
          console.log('Direct state update for:', name, 'New value:', value)
        }
        
        return newState
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
      // Clean and prepare data with draft status
      const dataToSave = cleanResumeData({
        ...resumeData,
        isDraft: true // Mark as draft when saving
      })
      
      console.log('Saving resume data:', dataToSave)
      console.log('PersonalInfo being saved:', dataToSave.personalInfo)
      console.log('Website field specifically:', dataToSave.personalInfo?.website)
      console.log('Experience being saved:', dataToSave.experience)
      console.log('Education being saved:', dataToSave.education)
      console.log('Skills being saved:', dataToSave.skills)
      console.log('[PROJECTS SAVE DEBUG] Projects being saved:', dataToSave.projects)
      console.log('[PROJECTS SAVE DEBUG] Projects save count:', dataToSave.projects?.length || 0)
      console.log('[PROJECTS SAVE DEBUG] Projects save structure:', {
        isArray: Array.isArray(dataToSave.projects),
        hasProjects: !!(dataToSave.projects && dataToSave.projects.length > 0),
        projectNames: dataToSave.projects?.map(p => p.name) || []
      })
      
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
        console.log('Navigating to new resume ID:', newResumeId)
        navigate(`/resume-builder/${newResumeId}`, { replace: true })
        
        // Then update with full data as draft
        console.log('Updating resume with full data:', dataToSave)
        response = await resumeAPI.updateResume(newResumeId, dataToSave)
        
        // Force reload the data after navigation using the new ID
        setTimeout(async () => {
          console.log('Force reloading data after navigation with new ID:', newResumeId)
          try {
            const reloadResponse = await resumeAPI.getResumeById(newResumeId)
            const reloadedData = reloadResponse.data?.data?.resume || reloadResponse.data
            
            console.log('Reloaded data after save:', reloadedData)
            console.log('Reloaded experience:', reloadedData.experience)
            console.log('Reloaded education:', reloadedData.education)
            console.log('Reloaded skills:', reloadedData.skills)
            console.log('[FORCE RELOAD DEBUG] Reloaded projects from backend:', reloadedData.projects)
            console.log('[FORCE RELOAD DEBUG] Reloaded projects count:', reloadedData.projects?.length || 0)
            console.log('[FORCE RELOAD DEBUG] Projects structure check:', {
              isArray: Array.isArray(reloadedData.projects),
              hasProjects: !!(reloadedData.projects && reloadedData.projects.length > 0),
              firstProject: reloadedData.projects?.[0] || 'No projects found'
            })
            
            // Ensure proper structure with fallbacks
            const structuredData = {
              ...reloadedData,
              personalInfo: {
                fullName: '',
                email: '',
                phone: '',
                address: { street: '', city: '', state: '', zipCode: '', country: '' },
                website: '',
                linkedin: '',
                github: '',
                portfolio: '',
                profilePicture: '',
                professionalSummary: '',
                ...reloadedData.personalInfo
              },
              experience: reloadedData.experience || [],
              education: reloadedData.education || [],
              skills: reloadedData.skills || { technical: [], soft: [], languages: [] },
              projects: reloadedData.projects || [],
              certifications: reloadedData.certifications || [],
              achievements: reloadedData.achievements || [],
              volunteerWork: reloadedData.volunteerWork || [],
              references: reloadedData.references || [],
              customSections: reloadedData.customSections || []
            }
            
            console.log('[FORCE RELOAD DEBUG] Final structured projects:', structuredData.projects)
            console.log('[FORCE RELOAD DEBUG] Final projects count:', structuredData.projects?.length || 0)
            console.log('Setting reloaded structured data:', structuredData)
            setResumeData(structuredData)
            setLastSaved(new Date())
          } catch (reloadError) {
            console.error('Error reloading data after save:', reloadError)
          }
        }, 200)
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
        
        // Show specific validation errors
        if (!isAutoSave && error.response?.status === 400) {
          const errorMessages = error.response.data.errors.map(err => `${err.field}: ${err.message}`).join('\n')
          console.error('Validation errors:', errorMessages)
          alert(`Validation errors found:\n${errorMessages}`)
          return
        }
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

      // Clean and prepare data for publishing (mark as not draft)
      const publishData = cleanResumeData({
        ...resumeData,
        isDraft: false,
        publishedAt: new Date().toISOString()
      })
      
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
    if (!resumeData) return null
    
    switch (activeContentSection) {
      case 'personal':
        return (
          <PersonalInfoForm 
            data={resumeData.personalInfo || {}}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      case 'experience':
        return (
          <ExperienceForm 
            data={resumeData.experience || []}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      case 'education':
        return (
          <EducationForm 
            data={resumeData.education || []}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      case 'skills':
        return (
          <SkillsForm 
            data={resumeData.skills || { technical: [], soft: [], languages: [] }}
            onChange={handleDataChange}
            errors={errors}
          />
        )
      case 'projects':
        console.log('[PROJECTS RENDER DEBUG] Rendering ProjectsForm with data:', {
          projects: resumeData.projects,
          projectsLength: resumeData.projects?.length || 0,
          hasProjectsData: !!(resumeData.projects && resumeData.projects.length > 0),
          firstProject: resumeData.projects?.[0] || 'No first project'
        })
        return (
          <ProjectsForm 
            data={resumeData.projects || []}
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
                  resumeId={id}
                  onFullView={() => {
                    if (id && id !== 'new') {
                      window.open(`/resumes/${id}`, '_blank')
                    } else {
                      toast.error('Please save your resume first to view it in full screen')
                    }
                  }}
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