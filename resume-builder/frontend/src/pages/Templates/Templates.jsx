import { useState } from 'react'
import { Eye, Download, Star, Check, Filter, Search } from 'lucide-react'

const Templates = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { id: 'all', name: 'All Templates', count: 12 },
    { id: 'modern', name: 'Modern', count: 4 },
    { id: 'classic', name: 'Classic', count: 3 },
    { id: 'minimal', name: 'Minimal', count: 3 },
    { id: 'creative', name: 'Creative', count: 2 }
  ]

  const templates = [
    {
      id: 1,
      name: 'Modern Professional',
      category: 'modern',
      description: 'Clean and contemporary design perfect for tech and creative roles',
      image: '/templates/modern-1.png',
      features: ['Two-column layout', 'Color accents', 'Icon integration', 'ATS-friendly'],
      isPremium: false,
      rating: 4.9,
      downloads: 15420
    },
    {
      id: 2,
      name: 'Executive Classic',
      category: 'classic',
      description: 'Traditional format ideal for senior positions and conservative industries',
      image: '/templates/classic-1.png',
      features: ['Single column', 'Professional fonts', 'Traditional layout', 'Print-optimized'],
      isPremium: false,
      rating: 4.8,
      downloads: 12350
    },
    {
      id: 3,
      name: 'Minimal Clean',
      category: 'minimal',
      description: 'Simple and elegant design that focuses on content clarity',
      image: '/templates/minimal-1.png',
      features: ['Lots of whitespace', 'Clean typography', 'Subtle accents', 'Easy scanning'],
      isPremium: false,
      rating: 4.7,
      downloads: 9870
    },
    {
      id: 4,
      name: 'Creative Portfolio',
      category: 'creative',
      description: 'Bold and unique design for designers and creative professionals',
      image: '/templates/creative-1.png',
      features: ['Visual elements', 'Custom graphics', 'Color blocks', 'Portfolio section'],
      isPremium: true,
      rating: 4.9,
      downloads: 8960
    },
    {
      id: 5,
      name: 'Tech Innovator',
      category: 'modern',
      description: 'Cutting-edge design perfect for tech professionals and startups',
      image: '/templates/modern-2.png',
      features: ['Dark mode option', 'Tech-focused', 'Skill charts', 'Project showcase'],
      isPremium: true,
      rating: 4.8,
      downloads: 7420
    },
    {
      id: 6,
      name: 'Corporate Elite',
      category: 'classic',
      description: 'Sophisticated design for corporate executives and business leaders',
      image: '/templates/classic-2.png',
      features: ['Executive summary', 'Achievement focus', 'Professional tone', 'Leadership emphasis'],
      isPremium: true,
      rating: 4.9,
      downloads: 6890
    },
    {
      id: 7,
      name: 'Simple & Effective',
      category: 'minimal',
      description: 'Straightforward design that highlights your qualifications clearly',
      image: '/templates/minimal-2.png',
      features: ['No distractions', 'Content-first', 'Easy to read', 'Universal appeal'],
      isPremium: false,
      rating: 4.6,
      downloads: 11250
    },
    {
      id: 8,
      name: 'Design Studio',
      category: 'creative',
      description: 'Artistic layout perfect for designers, artists, and creative agencies',
      image: '/templates/creative-2.png',
      features: ['Artistic flair', 'Portfolio grid', 'Brand colors', 'Visual hierarchy'],
      isPremium: true,
      rating: 4.8,
      downloads: 5670
    }
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
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <Eye className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">{template.name}</p>
            <p className="text-xs text-gray-400 mt-1">Preview</p>
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
            <button className="btn-primary">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </button>
            <button className="btn-secondary">
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
          <button className="text-primary-600 hover:text-primary-800 font-medium">
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
    </div>
  )
}

export default Templates