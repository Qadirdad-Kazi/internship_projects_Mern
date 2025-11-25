import { useState } from 'react'
import { Check, Eye, Palette } from 'lucide-react'
import templates from '../Templates/index'
import TemplatePreview from '../Templates/TemplatePreview'

const TemplateSelection = ({ data = {}, onChange, errors = {} }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(data.template || 'modern-professional')
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const [selectedColor, setSelectedColor] = useState(() => {
    const colorOptions = [
      { name: 'Blue', primary: '#2563eb', secondary: '#64748b' },
      { name: 'Green', primary: '#059669', secondary: '#6b7280' },
      { name: 'Purple', primary: '#7c3aed', secondary: '#6b7280' },
      { name: 'Red', primary: '#dc2626', secondary: '#6b7280' },
      { name: 'Orange', primary: '#ea580c', secondary: '#6b7280' },
      { name: 'Teal', primary: '#0d9488', secondary: '#6b7280' },
      { name: 'Pink', primary: '#db2777', secondary: '#6b7280' },
      { name: 'Gray', primary: '#374151', secondary: '#6b7280' }
    ]
    return colorOptions.find(c => 
      c.primary === (data.theme?.primaryColor || '#2563eb')
    ) || colorOptions[0]
  })

  const handleTemplateSelect = (templateId) => {
    setSelectedTemplate(templateId)
    onChange({
      target: {
        name: 'template',
        value: templateId
      }
    })
  }

  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template.id)
  }

  const handleUseTemplate = (template) => {
    handleTemplateSelect(template.id)
    setPreviewTemplate(null)
  }

  const colorOptions = [
    { name: 'Blue', primary: '#2563eb', secondary: '#64748b' },
    { name: 'Green', primary: '#059669', secondary: '#6b7280' },
    { name: 'Purple', primary: '#7c3aed', secondary: '#6b7280' },
    { name: 'Red', primary: '#dc2626', secondary: '#6b7280' },
    { name: 'Orange', primary: '#ea580c', secondary: '#6b7280' },
    { name: 'Teal', primary: '#0d9488', secondary: '#6b7280' },
    { name: 'Pink', primary: '#db2777', secondary: '#6b7280' },
    { name: 'Gray', primary: '#374151', secondary: '#6b7280' }
  ]

  const fontOptions = [
    { value: 'Arial', label: 'Arial', preview: 'font-sans' },
    { value: 'Helvetica', label: 'Helvetica', preview: 'font-sans' },
    { value: 'Times New Roman', label: 'Times New Roman', preview: 'font-serif' },
    { value: 'Georgia', label: 'Georgia', preview: 'font-serif' },
    { value: 'Calibri', label: 'Calibri', preview: 'font-sans' }
  ]

  const handleColorChange = (color) => {
    setSelectedColor(color)
    onChange({
      target: {
        name: 'theme',
        value: {
          ...data.theme,
          primaryColor: color.primary,
          secondaryColor: color.secondary
        }
      }
    })
  }

  const handleFontChange = (font) => {
    onChange({
      target: {
        name: 'theme',
        value: {
          ...data.theme,
          fontFamily: font
        }
      }
    })
  }

  return (
    <div className="space-y-8">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Palette className="h-5 w-5 mr-2 text-primary-500" />
          Template & Design
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Choose a template and customize colors and fonts to match your style
        </p>
      </div>

      {/* Template Selection */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Choose Template</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <div
              key={template.id}
              className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => handleTemplateSelect(template.id)}
            >
              {/* Selection indicator */}
              {selectedTemplate === template.id && (
                <div className="absolute top-4 right-4 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}

              {/* Template preview placeholder */}
              <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center border">
                <div className="text-center">
                  <Eye className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Template Preview</p>
                  <p className="text-xs text-gray-400 mt-1">{template.name}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h5 className="font-semibold text-gray-900">{template.name}</h5>
                  <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-700 mb-1">Features:</p>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    {template.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Best for:</span> {template.bestFor}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Customization */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Color Scheme</h4>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {colorOptions.map((color) => {
            const isSelected = selectedColor.primary === color.primary
            return (
              <button
                key={color.name}
                onClick={() => handleColorChange(color)}
                className={`group relative w-12 h-12 rounded-lg border-2 transition-all ${
                  isSelected ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color.primary }}
                title={color.name}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white drop-shadow-lg" />
                  </div>
                )}
                <div className="sr-only">{color.name}</div>
              </button>
            )
          })}
        </div>
        <p className="text-xs text-gray-500">
          Selected: {selectedColor.name} • This color will be used for headings and accents
        </p>
      </div>

      {/* Font Selection */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Font Family</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {fontOptions.map((font) => {
            const isSelected = (data.theme?.fontFamily || 'Arial') === font.value
            return (
              <button
                key={font.value}
                onClick={() => handleFontChange(font.value)}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className={`text-lg ${font.preview}`} style={{ fontFamily: font.value }}>
                  {font.label}
                </div>
                <div className={`text-sm text-gray-600 mt-1 ${font.preview}`} style={{ fontFamily: font.value }}>
                  The quick brown fox jumps
                </div>
                {isSelected && (
                  <div className="mt-2">
                    <div className="inline-flex items-center text-xs text-primary-600">
                      <Check className="h-3 w-3 mr-1" />
                      Selected
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Template Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h5 className="font-medium text-blue-900 mb-2">🎨 Template Selection Tips:</h5>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>Modern:</strong> Great for tech roles and creative industries</li>
          <li>• <strong>Classic:</strong> Perfect for traditional industries like finance and law</li>
          <li>• <strong>Minimal:</strong> Ideal for academic positions and research roles</li>
          <li>• <strong>Creative:</strong> Best for design, marketing, and artistic fields</li>
          <li>• Choose colors that align with your industry (conservative vs. creative)</li>
          <li>• Ensure good contrast between text and background for readability</li>
        </ul>
      </div>
      
      {/* Template Preview Modal */}
      <TemplatePreview
        templateId={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUseTemplate={handleUseTemplate}
      />
    </div>
  )
}

export default TemplateSelection