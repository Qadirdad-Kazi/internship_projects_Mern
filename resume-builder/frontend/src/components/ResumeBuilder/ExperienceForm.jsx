import { useState } from 'react'
import { Briefcase, Plus, Trash2, Calendar, MapPin } from 'lucide-react'
import { FormInput, FormTextarea, FormDatePicker, FormSelect } from '../Forms'

const ExperienceForm = ({ data = [], onChange, errors = {} }) => {
  const [expandedItems, setExpandedItems] = useState(new Set([0]))

  const addExperience = () => {
    const newExperience = {
      jobTitle: '',
      company: '',
      location: '',
      startDate: null,
      endDate: null,
      isCurrentJob: false,
      description: '',
      achievements: [''],
      technologies: ['']
    }
    
    const newData = [...data, newExperience]
    onChange({
      target: {
        name: 'experience',
        value: newData
      }
    })

    // Expand the new item
    setExpandedItems(prev => new Set([...prev, newData.length - 1]))
  }

  const removeExperience = (index) => {
    const newData = data.filter((_, i) => i !== index)
    onChange({
      target: {
        name: 'experience',
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

  const updateExperience = (index, field, value) => {
    const newData = [...data]
    
    if (field === 'isCurrentJob' && value) {
      newData[index] = { ...newData[index], [field]: value, endDate: null }
    } else {
      newData[index] = { ...newData[index], [field]: value }
    }
    
    onChange({
      target: {
        name: 'experience',
        value: newData
      }
    })
  }

  const updateArrayField = (expIndex, field, itemIndex, value) => {
    const newData = [...data]
    const newArray = [...newData[expIndex][field]]
    newArray[itemIndex] = value
    newData[expIndex] = { ...newData[expIndex], [field]: newArray }
    
    onChange({
      target: {
        name: 'experience',
        value: newData
      }
    })
  }

  const addArrayItem = (expIndex, field) => {
    const newData = [...data]
    newData[expIndex] = {
      ...newData[expIndex],
      [field]: [...newData[expIndex][field], '']
    }
    
    onChange({
      target: {
        name: 'experience',
        value: newData
      }
    })
  }

  const removeArrayItem = (expIndex, field, itemIndex) => {
    const newData = [...data]
    newData[expIndex] = {
      ...newData[expIndex],
      [field]: newData[expIndex][field].filter((_, i) => i !== itemIndex)
    }
    
    onChange({
      target: {
        name: 'experience',
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

  // Initialize with one empty experience if no data
  if (data.length === 0) {
    addExperience()
    return null
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Briefcase className="h-5 w-5 mr-2 text-primary-500" />
          Work Experience
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Add your work experience, starting with your most recent position
        </p>
      </div>

      <div className="space-y-6">
        {data.map((experience, index) => (
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
                  {experience.jobTitle || `Experience ${index + 1}`}
                  {experience.company && (
                    <span className="text-gray-500 font-normal"> at {experience.company}</span>
                  )}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {expandedItems.has(index) ? 'Click to collapse' : 'Click to expand'}
                </p>
              </button>
              
              <button
                onClick={() => removeExperience(index)}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="Job Title"
                    name={`experience.${index}.jobTitle`}
                    value={experience.jobTitle || ''}
                    onChange={(e) => updateExperience(index, 'jobTitle', e.target.value)}
                    placeholder="Software Engineer"
                    required
                    error={errors[`experience.${index}.jobTitle`]}
                  />

                  <FormInput
                    label="Company"
                    name={`experience.${index}.company`}
                    value={experience.company || ''}
                    onChange={(e) => updateExperience(index, 'company', e.target.value)}
                    placeholder="Tech Company Inc."
                    required
                    error={errors[`experience.${index}.company`]}
                  />
                </div>

                <FormInput
                  label="Location"
                  name={`experience.${index}.location`}
                  value={experience.location || ''}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  placeholder="San Francisco, CA"
                  error={errors[`experience.${index}.location`]}
                />

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <FormDatePicker
                    label="Start Date"
                    name={`experience.${index}.startDate`}
                    value={experience.startDate}
                    onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                    required
                    error={errors[`experience.${index}.startDate`]}
                  />

                  {!experience.isCurrentJob && (
                    <FormDatePicker
                      label="End Date"
                      name={`experience.${index}.endDate`}
                      value={experience.endDate}
                      onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                      min={experience.startDate ? new Date(experience.startDate).toISOString().split('T')[0] : undefined}
                      error={errors[`experience.${index}.endDate`]}
                    />
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`current-job-${index}`}
                      checked={experience.isCurrentJob || false}
                      onChange={(e) => updateExperience(index, 'isCurrentJob', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`current-job-${index}`} className="ml-2 text-sm text-gray-700">
                      Current position
                    </label>
                  </div>
                </div>

                {/* Description */}
                <FormTextarea
                  label="Job Description"
                  name={`experience.${index}.description`}
                  value={experience.description || ''}
                  onChange={(e) => updateExperience(index, 'description', e.target.value)}
                  placeholder="Describe your role, responsibilities, and key contributions..."
                  rows={4}
                  maxLength={1000}
                  error={errors[`experience.${index}.description`]}
                />

                {/* Key Achievements */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Key Achievements & Accomplishments
                  </label>
                  {(experience.achievements || []).map((achievement, achIndex) => (
                    <div key={achIndex} className="flex gap-2">
                      <FormInput
                        name={`experience.${index}.achievements.${achIndex}`}
                        value={achievement}
                        onChange={(e) => updateArrayField(index, 'achievements', achIndex, e.target.value)}
                        placeholder="Increased team productivity by 30% through process optimization..."
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeArrayItem(index, 'achievements', achIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        disabled={experience.achievements.length === 1}
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

                {/* Technologies */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Technologies & Tools Used
                  </label>
                  {(experience.technologies || []).map((tech, techIndex) => (
                    <div key={techIndex} className="flex gap-2">
                      <FormInput
                        name={`experience.${index}.technologies.${techIndex}`}
                        value={tech}
                        onChange={(e) => updateArrayField(index, 'technologies', techIndex, e.target.value)}
                        placeholder="React, Node.js, MongoDB..."
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeArrayItem(index, 'technologies', techIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        disabled={experience.technologies.length === 1}
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
              </div>
            )}
          </div>
        ))}

        {/* Add Experience Button */}
        <button
          onClick={addExperience}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Work Experience
        </button>
      </div>
    </div>
  )
}

export default ExperienceForm