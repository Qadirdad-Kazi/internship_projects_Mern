import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Download, Star, Check, Filter, Search } from 'lucide-react'
import templates from '../../components/Templates/index'
import TemplatePreview from '../../components/Templates/TemplatePreview'
import { useAuthStore } from '../../stores/authStore'

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const [previewTemplate, setPreviewTemplate] = useState(null)
  const { saveUserPreferences, user } = useAuthStore()

  const handlePreviewTemplate = (template) => {
    setPreviewTemplate(template.id)
  }

  const handleUseTemplate = async (template) => {
    // Save user's template preference to MongoDB if logged in
    if (user) {
      await saveUserPreferences({ 
        defaultTemplate: template.category || template.id.split('-')[0] 
      })
    }
    
    // Navigate to resume builder with template in URL params
    if (user) {
      // If logged in, go to protected resume builder
      navigate(`/resume-builder?template=${template.id}`)
    } else {
      // If not logged in, redirect to login first
      navigate(`/login?redirect=/resume-builder&template=${template.id}`)
    }
  }

  const categories = [
    { id: 'all', name: 'All Templates', count: 8 },
    { id: 'modern', name: 'Modern', count: 2 },
    { id: 'classic', name: 'Classic', count: 2 },
    { id: 'minimal', name: 'Minimal', count: 2 },
    { id: 'creative', name: 'Creative', count: 2 }
  ]

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const TemplateCard = ({ template }) => (
    <div className="group bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Template Preview */}
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0 p-4">
          <div className="w-full h-full bg-white rounded shadow-sm border border-gray-200 flex items-center justify-center">
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-3 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: template.colors?.primary || '#2563eb' }}
              >
                <Eye className="h-8 w-8 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-700">{template.name}</p>
              <p className="text-xs text-gray-500 mt-1">Click to preview</p>
            </div>
          </div>
        </div>
        
        {/* Premium Badge */}
        {template.isPremium && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
              <Star className="h-3 w-3 mr-1" />
              Premium
            </span>
          </div>
        )}
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-3">
            <button 
              onClick={() => handlePreviewTemplate(template)}
              className="btn-primary"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button 
              onClick={() => handleUseTemplate(template)}
              className="btn-secondary"
            >
              Use Template
            </button>
          </div>
        </div>
      </div>
      
      {/* Template Info */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            {template.rating}
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {template.description}
        </p>
        
        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {template.features.slice(0, 2).map((feature, index) => (
              <span key={index} className="inline-flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                <Check className="h-3 w-3 mr-1 text-green-500" />
                {feature}
              </span>
            ))}
            {template.features.length > 2 && (
              <span className="text-xs text-gray-500">
                +{template.features.length - 2} more
              </span>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Download className="h-4 w-4 mr-1" />
            {template.downloads.toLocaleString()} downloads
          </div>
          <button 
            onClick={() => handleUseTemplate(template)}
            className="text-primary-600 hover:text-primary-800 font-medium"
          >
            Use Template →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Professional Resume
              <span className="block text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Templates
              </span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Choose from our collection of professionally designed, ATS-friendly resume templates. 
              Each template is crafted to help you stand out and land your dream job.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Browse All Templates
              </button>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                See Premium Features
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-primary-100 text-primary-700 border border-primary-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="container py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedCategory === 'all' ? 'All Templates' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-4 w-4 text-gray-400" />
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Highest Rated</option>
              <option>Most Downloads</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </div>

      {/* Template Categories */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Templates by Industry
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Each template is specifically designed for different industries and career levels
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Technology', desc: 'Software engineers, developers, IT professionals', count: 8, color: 'blue' },
              { name: 'Business', desc: 'Managers, consultants, analysts', count: 6, color: 'green' },
              { name: 'Healthcare', desc: 'Doctors, nurses, medical professionals', count: 4, color: 'red' },
              { name: 'Creative', desc: 'Designers, artists, marketing professionals', count: 5, color: 'purple' }
            ].map((industry, index) => (
              <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 bg-${industry.color}-100 rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <div className={`w-8 h-8 bg-${industry.color}-500 rounded-lg`}></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{industry.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{industry.desc}</p>
                <span className="text-xs text-gray-500">{industry.count} templates</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container py-16">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Choose a template and start building your professional resume in minutes. 
            Our easy-to-use editor makes it simple to customize any design.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Start Building Now
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              View All Features
            </button>
          </div>
          <p className="text-primary-200 text-sm mt-6">
            No credit card required • Free templates available • Premium from $9/month
          </p>
        </div>
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

export default Templates