import { useState, useEffect } from 'react'
import { FolderOpen, Plus, Trash2, ExternalLink, Github, Calendar } from 'lucide-react'
import { FormInput, FormTextarea, FormDatePicker } from '../Forms'

const ProjectsForm = ({ data = [], onChange, errors = {} }) => {
  const [expandedItems, setExpandedItems] = useState(new Set([0]))
  
  // Debug logging
  useEffect(() => {
    console.log('ProjectsForm received data:', data)
    console.log('Projects data length:', data.length)
  }, [data])

  const addProject = () => {
    const newProject = {
      name: '',
      description: '',
      technologies: [''],
      startDate: null,
      endDate: null,
      isOngoing: false,
      url: '',
      github: '',
      achievements: ['']
    }
    
    const newData = [...data, newProject]
    onChange({
      target: {
        name: 'projects',
        value: newData
      }
    })

    // Expand the new item
    setExpandedItems(prev => new Set([...prev, newData.length - 1]))
  }

  const removeProject = (index) => {
    const newData = data.filter((_, i) => i !== index)
    onChange({
      target: {
        name: 'projects',
        value: newData
      }
    })

    // Remove from expanded items and adjust indices
    setExpandedItems(prev => {
      const newSet = new Set()
      prev.forEach(i => {
        if (i < index) newSet.add(i)
        else if (i > index) newSet.add(i - 1)
      })
      return newSet
    })
  }

  const updateProject = (index, field, value) => {
    const newData = [...data]
    
    if (field === 'isOngoing' && value) {
      newData[index] = { ...newData[index], [field]: value, endDate: null }
    } else {
      newData[index] = { ...newData[index], [field]: value }
    }
    
    onChange({
      target: {
        name: 'projects',
        value: newData
      }
    })
  }

  const updateArrayField = (projIndex, field, itemIndex, value) => {
    const newData = [...data]
    const newArray = [...newData[projIndex][field]]
    newArray[itemIndex] = value
    newData[projIndex] = { ...newData[projIndex], [field]: newArray }
    
    onChange({
      target: {
        name: 'projects',
        value: newData
      }
    })
  }

  const addArrayItem = (projIndex, field) => {
    const newData = [...data]
    newData[projIndex] = {
      ...newData[projIndex],
      [field]: [...newData[projIndex][field], '']
    }
    
    onChange({
      target: {
        name: 'projects',
        value: newData
      }
    })
  }

  const removeArrayItem = (projIndex, field, itemIndex) => {
    const newData = [...data]
    newData[projIndex] = {
      ...newData[projIndex],
      [field]: newData[projIndex][field].filter((_, i) => i !== itemIndex)
    }
    
    onChange({
      target: {
        name: 'projects',
        value: newData
      }
    })
  }

  const toggleExpanded = (index) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  // Initialize with one empty project if no data
  useEffect(() => {
    if (data.length === 0) {
      addProject()
    }
  }, [data.length])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <FolderOpen className="h-5 w-5 mr-2 text-primary-500" />
          Projects
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Showcase your personal and professional projects that demonstrate your skills
        </p>
      </div>

      <div className="space-y-6">
        {data.map((project, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => toggleExpanded(index)}
                className="flex-1 text-left"
              >
                <h4 className="font-medium text-gray-900">
                  {project.name || `Project ${index + 1}`}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {expandedItems.has(index) ? 'Click to collapse' : 'Click to expand'}
                </p>
              </button>
              
              <button
                onClick={() => removeProject(index)}
                className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                disabled={data.length === 1}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            {expandedItems.has(index) && (
              <div className="space-y-4">
                {/* Basic Info */}
                <FormInput
                  label="Project Name"
                  name={`projects.${index}.name`}
                  value={project.name || ''}
                  onChange={(e) => updateProject(index, 'name', e.target.value)}
                  placeholder="E-commerce Website"
                  required
                  error={errors[`projects.${index}.name`]}
                />

                <FormTextarea
                  label="Project Description"
                  name={`projects.${index}.description`}
                  value={project.description || ''}
                  onChange={(e) => updateProject(index, 'description', e.target.value)}
                  placeholder="Describe the project, its purpose, your role, and key features..."
                  rows={4}
                  maxLength={500}
                  error={errors[`projects.${index}.description`]}
                />

                {/* URLs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Live Demo URL"
                    name={`projects.${index}.url`}
                    type="url"
                    value={project.url || ''}
                    onChange={(e) => updateProject(index, 'url', e.target.value)}
                    placeholder="https://myproject.com"
                    error={errors[`projects.${index}.url`]}
                  />

                  <FormInput
                    label="GitHub Repository"
                    name={`projects.${index}.github`}
                    type="url"
                    value={project.github || ''}
                    onChange={(e) => updateProject(index, 'github', e.target.value)}
                    placeholder="https://github.com/username/project"
                    error={errors[`projects.${index}.github`]}
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <FormDatePicker
                    label="Start Date"
                    name={`projects.${index}.startDate`}
                    value={project.startDate}
                    onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                    error={errors[`projects.${index}.startDate`]}
                  />

                  {!project.isOngoing && (
                    <FormDatePicker
                      label="End Date"
                      name={`projects.${index}.endDate`}
                      value={project.endDate}
                      onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                      min={project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : undefined}
                      error={errors[`projects.${index}.endDate`]}
                    />
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`ongoing-project-${index}`}
                      checked={project.isOngoing || false}
                      onChange={(e) => updateProject(index, 'isOngoing', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`ongoing-project-${index}`} className="ml-2 text-sm text-gray-700">
                      Ongoing project
                    </label>
                  </div>
                </div>

                {/* Technologies Used */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies & Tools Used
                  </label>
                  {(project.technologies || []).map((tech, techIndex) => (
                    <div key={techIndex} className="flex gap-2">
                      <FormInput
                        name={`projects.${index}.technologies.${techIndex}`}
                        value={tech}
                        onChange={(e) => updateArrayField(index, 'technologies', techIndex, e.target.value)}
                        placeholder="React, Node.js, MongoDB, AWS..."
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeArrayItem(index, 'technologies', techIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        disabled={project.technologies.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem(index, 'technologies')}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Technology
                  </button>
                </div>

                {/* Key Achievements */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Key Achievements & Impact
                  </label>
                  {(project.achievements || []).map((achievement, achIndex) => (
                    <div key={achIndex} className="flex gap-2">
                      <FormInput
                        name={`projects.${index}.achievements.${achIndex}`}
                        value={achievement}
                        onChange={(e) => updateArrayField(index, 'achievements', achIndex, e.target.value)}
                        placeholder="Reduced load time by 40%, Gained 1000+ users..."
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeArrayItem(index, 'achievements', achIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        disabled={project.achievements.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem(index, 'achievements')}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Achievement
                  </button>
                </div>

                {/* Quick Links Preview */}
                {(project.url || project.github) && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Project Links:</h5>
                    <div className="flex flex-wrap gap-2">
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Live Demo
                        </a>
                      )}
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full hover:bg-gray-200 transition-colors"
                        >
                          <Github className="h-3 w-3 mr-1" />
                          Source Code
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add Project Button */}
        <button
          onClick={addProject}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Project
        </button>
      </div>

      {/* Project Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">💡 Project Tips:</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Include both personal and professional projects that showcase different skills</li>
          <li>• Focus on the impact and results of your projects (users, performance improvements, etc.)</li>
          <li>• Mention the technologies you used and any challenges you overcame</li>
          <li>• Provide working links to demos and source code when possible</li>
          <li>• Order projects by relevance to the job you're applying for</li>
        </ul>
      </div>
    </div>
  )
}

export default ProjectsForm