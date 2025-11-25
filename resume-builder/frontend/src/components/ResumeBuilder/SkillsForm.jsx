import { useState, useEffect } from 'react'
import { Zap, Plus, Trash2, Code, MessageCircle, Globe } from 'lucide-react'
import { FormInput, FormSelect } from '../Forms'

const SkillsForm = ({ data = {}, onChange, errors = {} }) => {
  const [activeSection, setActiveSection] = useState('technical')
  
  // Debug logging
  useEffect(() => {
    console.log('SkillsForm received data:', data)
    console.log('Technical skills:', data.technical)
    console.log('Soft skills:', data.soft)
    console.log('Languages:', data.languages)
  }, [data])

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ]

  const skillCategories = [
    { value: 'programming', label: 'Programming Language' },
    { value: 'framework', label: 'Framework/Library' },
    { value: 'database', label: 'Database' },
    { value: 'tool', label: 'Tool/Software' },
    { value: 'other', label: 'Other' }
  ]

  const languageProficiency = [
    { value: 'basic', label: 'Basic' },
    { value: 'conversational', label: 'Conversational' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'native', label: 'Native' }
  ]

  // Initialize default structure if empty
  const skills = {
    technical: data.technical || [],
    soft: data.soft || [],
    languages: data.languages || [],
    ...data
  }

  const updateSkills = (section, newData) => {
    const updatedSkills = { ...skills, [section]: newData }
    onChange({
      target: {
        name: 'skills',
        value: updatedSkills
      }
    })
  }

  // Technical Skills Functions
  const addTechnicalSkill = () => {
    const newSkill = {
      name: '',
      level: 'intermediate',
      category: 'other'
    }
    updateSkills('technical', [...skills.technical, newSkill])
  }

  const updateTechnicalSkill = (index, field, value) => {
    const newTechnical = [...skills.technical]
    newTechnical[index] = { ...newTechnical[index], [field]: value }
    updateSkills('technical', newTechnical)
  }

  const removeTechnicalSkill = (index) => {
    const newTechnical = skills.technical.filter((_, i) => i !== index)
    updateSkills('technical', newTechnical)
  }

  // Soft Skills Functions
  const addSoftSkill = () => {
    updateSkills('soft', [...skills.soft, ''])
  }

  const updateSoftSkill = (index, value) => {
    const newSoft = [...skills.soft]
    newSoft[index] = value
    updateSkills('soft', newSoft)
  }

  const removeSoftSkill = (index) => {
    const newSoft = skills.soft.filter((_, i) => i !== index)
    updateSkills('soft', newSoft)
  }

  // Language Skills Functions
  const addLanguage = () => {
    const newLanguage = {
      language: '',
      proficiency: 'conversational'
    }
    updateSkills('languages', [...skills.languages, newLanguage])
  }

  const updateLanguage = (index, field, value) => {
    const newLanguages = [...skills.languages]
    newLanguages[index] = { ...newLanguages[index], [field]: value }
    updateSkills('languages', newLanguages)
  }

  const removeLanguage = (index) => {
    const newLanguages = skills.languages.filter((_, i) => i !== index)
    updateSkills('languages', newLanguages)
  }

  const skillSections = [
    { id: 'technical', name: 'Technical Skills', icon: Code },
    { id: 'soft', name: 'Soft Skills', icon: MessageCircle },
    { id: 'languages', name: 'Languages', icon: Globe }
  ]

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-primary-500" />
          Skills
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Showcase your technical skills, soft skills, and language proficiency
        </p>
      </div>

      {/* Skill Section Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          {skillSections.map((section) => {
            const Icon = section.icon
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeSection === section.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {section.name}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Technical Skills */}
      {activeSection === 'technical' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium text-gray-900">Technical Skills</h4>
            <button
              onClick={addTechnicalSkill}
              className="btn-sm btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </button>
          </div>

          {skills.technical.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Code className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No technical skills added yet</p>
              <button
                onClick={addTechnicalSkill}
                className="mt-2 text-primary-600 hover:text-primary-800"
              >
                Add your first technical skill
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.technical.map((skill, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border border-gray-200 rounded-lg">
                  <FormInput
                    label="Skill Name"
                    name={`skills.technical.${index}.name`}
                    value={skill.name || ''}
                    onChange={(e) => updateTechnicalSkill(index, 'name', e.target.value)}
                    placeholder="React, Python, AWS..."
                    required
                    error={errors[`skills.technical.${index}.name`]}
                  />

                  <FormSelect
                    label="Proficiency Level"
                    name={`skills.technical.${index}.level`}
                    value={skill.level || 'intermediate'}
                    onChange={(e) => updateTechnicalSkill(index, 'level', e.target.value)}
                    options={skillLevels}
                    error={errors[`skills.technical.${index}.level`]}
                  />

                  <FormSelect
                    label="Category"
                    name={`skills.technical.${index}.category`}
                    value={skill.category || 'other'}
                    onChange={(e) => updateTechnicalSkill(index, 'category', e.target.value)}
                    options={skillCategories}
                    error={errors[`skills.technical.${index}.category`]}
                  />

                  <div className="flex items-end">
                    <button
                      onClick={() => removeTechnicalSkill(index)}
                      className="w-full p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Soft Skills */}
      {activeSection === 'soft' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium text-gray-900">Soft Skills</h4>
            <button
              onClick={addSoftSkill}
              className="btn-sm btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Skill
            </button>
          </div>

          {skills.soft.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <MessageCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No soft skills added yet</p>
              <button
                onClick={addSoftSkill}
                className="mt-2 text-primary-600 hover:text-primary-800"
              >
                Add your first soft skill
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.soft.map((skill, index) => (
                <div key={index} className="flex gap-3 p-4 border border-gray-200 rounded-lg">
                  <FormInput
                    label={`Soft Skill ${index + 1}`}
                    name={`skills.soft.${index}`}
                    value={skill || ''}
                    onChange={(e) => updateSoftSkill(index, e.target.value)}
                    placeholder="Leadership, Communication, Problem Solving..."
                    className="flex-1"
                    error={errors[`skills.soft.${index}`]}
                  />
                  <div className="flex items-end">
                    <button
                      onClick={() => removeSoftSkill(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h5 className="font-medium text-blue-900 mb-2">Soft Skill Examples:</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-800">
              <div>
                <strong>Communication:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Public Speaking</li>
                  <li>• Written Communication</li>
                  <li>• Active Listening</li>
                </ul>
              </div>
              <div>
                <strong>Leadership:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Team Management</li>
                  <li>• Project Leadership</li>
                  <li>• Mentoring</li>
                </ul>
              </div>
              <div>
                <strong>Problem Solving:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Critical Thinking</li>
                  <li>• Analytical Skills</li>
                  <li>• Creative Solutions</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Languages */}
      {activeSection === 'languages' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-md font-medium text-gray-900">Languages</h4>
            <button
              onClick={addLanguage}
              className="btn-sm btn-primary flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Language
            </button>
          </div>

          {skills.languages.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Globe className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No languages added yet</p>
              <button
                onClick={addLanguage}
                className="mt-2 text-primary-600 hover:text-primary-800"
              >
                Add your first language
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {skills.languages.map((lang, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 border border-gray-200 rounded-lg">
                  <FormInput
                    label="Language"
                    name={`skills.languages.${index}.language`}
                    value={lang.language || ''}
                    onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                    placeholder="English, Spanish, Mandarin..."
                    required
                    error={errors[`skills.languages.${index}.language`]}
                  />

                  <FormSelect
                    label="Proficiency"
                    name={`skills.languages.${index}.proficiency`}
                    value={lang.proficiency || 'conversational'}
                    onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                    options={languageProficiency}
                    error={errors[`skills.languages.${index}.proficiency`]}
                  />

                  <div className="flex items-end">
                    <button
                      onClick={() => removeLanguage(index)}
                      className="w-full p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SkillsForm