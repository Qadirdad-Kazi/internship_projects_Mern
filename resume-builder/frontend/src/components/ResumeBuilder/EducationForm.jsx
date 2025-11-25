import { useState, useEffect } from 'react'
import { GraduationCap, Plus, Trash2, Award } from 'lucide-react'
import { FormInput, FormTextarea, FormDatePicker, FormSelect } from '../Forms'

const EducationForm = ({ data = [], onChange, errors = {} }) => {
  const [expandedItems, setExpandedItems] = useState(new Set([0]))

  const degreeOptions = [
    { value: '', label: 'Select Degree Type' },
    { value: 'High School Diploma', label: 'High School Diploma' },
    { value: 'Associate Degree', label: 'Associate Degree' },
    { value: 'Bachelor\'s Degree', label: 'Bachelor\'s Degree' },
    { value: 'Master\'s Degree', label: 'Master\'s Degree' },
    { value: 'Doctoral Degree', label: 'Doctoral Degree (PhD)' },
    { value: 'Professional Degree', label: 'Professional Degree' },
    { value: 'Certificate', label: 'Certificate Program' },
    { value: 'Diploma', label: 'Diploma' },
    { value: 'Other', label: 'Other' }
  ]

  const addEducation = () => {
    const newEducation = {
      degree: '',
      institution: '',
      location: '',
      startDate: null,
      endDate: null,
      isCurrentlyEnrolled: false,
      gpa: '',
      honors: [''],
      relevantCoursework: ['']
    }
    
    const newData = [...data, newEducation]
    onChange({
      target: {
        name: 'education',
        value: newData
      }
    })

    // Expand the new item
    setExpandedItems(prev => new Set([...prev, newData.length - 1]))
  }

  const removeEducation = (index) => {
    const newData = data.filter((_, i) => i !== index)
    onChange({
      target: {
        name: 'education',
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

  const updateEducation = (index, field, value) => {
    const newData = [...data]
    
    if (field === 'isCurrentlyEnrolled' && value) {
      newData[index] = { ...newData[index], [field]: value, endDate: null }
    } else if (field === 'gpa') {
      // Validate GPA is between 0 and 4
      const numericValue = parseFloat(value)
      if (value === '' || (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 4)) {
        newData[index] = { ...newData[index], [field]: value }
      }
      return
    } else {
      newData[index] = { ...newData[index], [field]: value }
    }
    
    onChange({
      target: {
        name: 'education',
        value: newData
      }
    })
  }

  const updateArrayField = (eduIndex, field, itemIndex, value) => {
    const newData = [...data]
    const newArray = [...newData[eduIndex][field]]
    newArray[itemIndex] = value
    newData[eduIndex] = { ...newData[eduIndex], [field]: newArray }
    
    onChange({
      target: {
        name: 'education',
        value: newData
      }
    })
  }

  const addArrayItem = (eduIndex, field) => {
    const newData = [...data]
    newData[eduIndex] = {
      ...newData[eduIndex],
      [field]: [...newData[eduIndex][field], '']
    }
    
    onChange({
      target: {
        name: 'education',
        value: newData
      }
    })
  }

  const removeArrayItem = (eduIndex, field, itemIndex) => {
    const newData = [...data]
    newData[eduIndex] = {
      ...newData[eduIndex],
      [field]: newData[eduIndex][field].filter((_, i) => i !== itemIndex)
    }
    
    onChange({
      target: {
        name: 'education',
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

  // Initialize with one empty education if no data
  useEffect(() => {
    if (data.length === 0) {
      addEducation()
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
          <GraduationCap className="h-5 w-5 mr-2 text-primary-500" />
          Education
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Add your educational background, starting with your most recent degree
        </p>
      </div>

      <div className="space-y-6">
        {data.map((education, index) => (
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
                  {education.degree || `Education ${index + 1}`}
                  {education.institution && (
                    <span className="text-gray-500 font-normal"> from {education.institution}</span>
                  )}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {expandedItems.has(index) ? 'Click to collapse' : 'Click to expand'}
                </p>
              </button>
              
              <button
                onClick={() => removeEducation(index)}
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
                  <FormSelect
                    label="Degree Type"
                    name={`education.${index}.degree`}
                    value={education.degree || ''}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    options={degreeOptions}
                    required
                    error={errors[`education.${index}.degree`]}
                  />

                  <FormInput
                    label="Institution/School"
                    name={`education.${index}.institution`}
                    value={education.institution || ''}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="University of California, Berkeley"
                    required
                    error={errors[`education.${index}.institution`]}
                  />
                </div>

                <FormInput
                  label="Location"
                  name={`education.${index}.location`}
                  value={education.location || ''}
                  onChange={(e) => updateEducation(index, 'location', e.target.value)}
                  placeholder="Berkeley, CA"
                  error={errors[`education.${index}.location`]}
                />

                {/* Dates and GPA */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <FormDatePicker
                    label="Start Date"
                    name={`education.${index}.startDate`}
                    value={education.startDate}
                    onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                    error={errors[`education.${index}.startDate`]}
                  />

                  {!education.isCurrentlyEnrolled && (
                    <FormDatePicker
                      label="Graduation Date"
                      name={`education.${index}.endDate`}
                      value={education.endDate}
                      onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                      min={education.startDate ? new Date(education.startDate).toISOString().split('T')[0] : undefined}
                      error={errors[`education.${index}.endDate`]}
                    />
                  )}

                  <FormInput
                    label="GPA (Optional)"
                    name={`education.${index}.gpa`}
                    type="number"
                    value={education.gpa || ''}
                    onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                    placeholder="3.8"
                    min="0"
                    max="4"
                    step="0.1"
                    error={errors[`education.${index}.gpa`]}
                  />

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`currently-enrolled-${index}`}
                      checked={education.isCurrentlyEnrolled || false}
                      onChange={(e) => updateEducation(index, 'isCurrentlyEnrolled', e.target.checked)}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`currently-enrolled-${index}`} className="ml-2 text-sm text-gray-700">
                      Currently enrolled
                    </label>
                  </div>
                </div>

                {/* Honors & Awards */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Award className="h-4 w-4 mr-2" />
                    Honors & Awards
                  </label>
                  {(education.honors || []).map((honor, honorIndex) => (
                    <div key={honorIndex} className="flex gap-2">
                      <FormInput
                        name={`education.${index}.honors.${honorIndex}`}
                        value={honor}
                        onChange={(e) => updateArrayField(index, 'honors', honorIndex, e.target.value)}
                        placeholder="Dean's List, Magna Cum Laude, Honor Society..."
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeArrayItem(index, 'honors', honorIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        disabled={education.honors.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem(index, 'honors')}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Honor/Award
                  </button>
                </div>

                {/* Relevant Coursework */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Relevant Coursework
                  </label>
                  {(education.relevantCoursework || []).map((course, courseIndex) => (
                    <div key={courseIndex} className="flex gap-2">
                      <FormInput
                        name={`education.${index}.relevantCoursework.${courseIndex}`}
                        value={course}
                        onChange={(e) => updateArrayField(index, 'relevantCoursework', courseIndex, e.target.value)}
                        placeholder="Data Structures, Algorithms, Database Systems..."
                        className="flex-1"
                      />
                      <button
                        onClick={() => removeArrayItem(index, 'relevantCoursework', courseIndex)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                        disabled={education.relevantCoursework.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => addArrayItem(index, 'relevantCoursework')}
                    className="text-sm text-primary-600 hover:text-primary-800 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Course
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Add Education Button */}
        <button
          onClick={addEducation}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Education
        </button>
      </div>
    </div>
  )
}

export default EducationForm