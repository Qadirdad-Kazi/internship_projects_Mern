import { 
  FileText, 
  Palette, 
  Download, 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  BarChart3, 
  Check, 
  Star,
  Eye,
  Settings,
  Share2,
  Lock
} from 'lucide-react'

const Features = () => {
  const mainFeatures = [
    {
      icon: FileText,
      title: 'Professional Templates',
      description: 'Choose from 4+ professionally designed templates that are ATS-friendly and industry-specific.',
      features: ['Modern & Classic designs', 'ATS-compatible formatting', 'Industry-specific layouts', 'Mobile responsive']
    },
    {
      icon: Palette,
      title: 'Customization Options',
      description: 'Personalize your resume with custom colors, fonts, and section arrangements to match your style.',
      features: ['8 color schemes', '5 professional fonts', 'Flexible layouts', 'Section visibility controls']
    },
    {
      icon: Download,
      title: 'Export & Download',
      description: 'Export your resume as high-quality PDF files that look great both on screen and in print.',
      features: ['High-resolution PDF', 'Print-ready format', 'Multiple file formats', 'Instant downloads']
    },
    {
      icon: Shield,
      title: 'Privacy & Security',
      description: 'Your data is secure with enterprise-grade encryption and flexible privacy controls.',
      features: ['End-to-end encryption', 'Private by default', 'GDPR compliant', 'Secure data storage']
    },
    {
      icon: Zap,
      title: 'Real-time Preview',
      description: 'See your changes instantly with our live preview feature as you build your resume.',
      features: ['Live editing', 'Instant updates', 'Mobile preview', 'Print simulation']
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your resume with unique links, control who can view it, and track engagement.',
      features: ['Shareable links', 'View analytics', 'Access controls', 'Download tracking']
    }
  ]

  const additionalFeatures = [
    {
      icon: Users,
      category: 'Collaboration',
      title: 'Team Features',
      description: 'Get feedback from mentors and colleagues',
      items: ['Share for feedback', 'Comment system', 'Version history', 'Collaborative editing']
    },
    {
      icon: BarChart3,
      category: 'Analytics',
      title: 'Resume Analytics',
      description: 'Track how your resume performs',
      items: ['View statistics', 'Download tracking', 'Engagement metrics', 'Performance insights']
    },
    {
      icon: Globe,
      category: 'Accessibility',
      title: 'Global Support',
      description: 'Multi-language and international formats',
      items: ['Multiple languages', 'International formats', 'Currency support', 'Date formats']
    },
    {
      icon: Settings,
      category: 'Automation',
      title: 'Smart Features',
      description: 'AI-powered suggestions and automation',
      items: ['Content suggestions', 'Skill recommendations', 'Auto-formatting', 'Spell check']
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Powerful Features for Your
              <span className="block text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Perfect Resume
              </span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Everything you need to create, customize, and share professional resumes 
              that get you noticed by employers and pass through ATS systems.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Start Building Free
              </button>
              <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                View Templates
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Features Grid */}
      <div className="container py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of tools helps you create professional resumes 
            that stand out and get results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-soft p-8 hover:shadow-lg transition-all duration-300 border border-gray-100"
              >
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                
                <ul className="space-y-2">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-700">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

      {/* Additional Features */}
      <div className="bg-white py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Advanced Capabilities
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Take your resume building to the next level with our advanced features 
              designed for modern job seekers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">
                      {feature.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {feature.description}
                  </p>
                  <ul className="text-xs text-gray-500 space-y-1">
                    {feature.items.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Feature Highlight Section */}
      <div className="container py-20">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Built for Modern Job Seekers
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our resume builder is designed with the latest hiring trends and 
                ATS technology in mind. We help you create resumes that not only 
                look professional but also perform well in today's digital hiring process.
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">ATS Optimized</div>
                    <div className="text-sm text-gray-600">Pass screening systems</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <Eye className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">HR Approved</div>
                    <div className="text-sm text-gray-600">Recruiter-friendly design</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                    <Star className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Industry Tested</div>
                    <div className="text-sm text-gray-600">Proven success rates</div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                    <Lock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Secure & Private</div>
                    <div className="text-sm text-gray-600">Your data protected</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Ready to Get Started?
                </h3>
                <p className="text-gray-600 mb-6">
                  Join thousands of job seekers who've landed their dream jobs with our resume builder.
                </p>
                <button className="btn-primary w-full">
                  Create Your Resume Now
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  No credit card required • Free forever plan available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">100K+</div>
              <div className="text-gray-400">Resumes Created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">95%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">50+</div>
              <div className="text-gray-400">Industries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary-400 mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Features