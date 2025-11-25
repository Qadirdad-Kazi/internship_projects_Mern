import { useState } from 'react'
import { 
  Search, 
  Book, 
  MessageCircle, 
  Mail, 
  Phone, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  FileText,
  Video,
  Download,
  ExternalLink,
  Star,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'

const Help = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'templates', name: 'Templates' },
    { id: 'editing', name: 'Editing & Formatting' },
    { id: 'sharing', name: 'Sharing & Downloading' },
    { id: 'account', name: 'Account & Billing' },
    { id: 'troubleshooting', name: 'Troubleshooting' }
  ]

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create my first resume?',
      answer: 'Creating your first resume is easy! Simply sign up for an account, choose a template from our gallery, and start filling in your information using our guided form. The process typically takes 10-15 minutes.',
      helpful: 156,
      tags: ['beginner', 'setup', 'tutorial']
    },
    {
      id: 2,
      category: 'templates',
      question: 'Can I switch templates after starting my resume?',
      answer: 'Yes! You can change templates at any time. Your content will automatically adapt to the new template design. Simply go to the template selection panel and choose a different template.',
      helpful: 142,
      tags: ['templates', 'switching', 'design']
    },
    {
      id: 3,
      category: 'editing',
      question: 'How do I add or remove sections from my resume?',
      answer: 'You can customize your resume sections in the Settings panel. Toggle sections on/off, reorder them by dragging, and add custom sections as needed. All changes are saved automatically.',
      helpful: 128,
      tags: ['sections', 'customization', 'editing']
    },
    {
      id: 4,
      category: 'sharing',
      question: 'What file formats can I download my resume in?',
      answer: 'Free users can download PDF files. Pro users get additional formats including Word documents, and can also share a live link. Premium users get additional formats and white-label sharing options.',
      helpful: 134,
      tags: ['download', 'pdf', 'formats']
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I upgrade or cancel my subscription?',
      answer: 'You can manage your subscription from your account settings. Upgrades take effect immediately, and cancellations will remain active until the end of your billing period.',
      helpful: 89,
      tags: ['billing', 'subscription', 'cancel']
    },
    {
      id: 6,
      category: 'troubleshooting',
      question: 'My resume isn\'t saving properly. What should I do?',
      answer: 'First, check your internet connection. If the problem persists, try refreshing the page. Your data is automatically backed up every few seconds, so you shouldn\'t lose your work.',
      helpful: 76,
      tags: ['saving', 'technical', 'backup']
    }
  ]

  const guides = [
    {
      id: 1,
      title: 'Complete Resume Writing Guide',
      description: 'Learn how to write a compelling resume that gets noticed by employers.',
      type: 'guide',
      duration: '15 min read',
      difficulty: 'Beginner',
      icon: <Book className="h-6 w-6" />
    },
    {
      id: 2,
      title: 'ATS Optimization Tips',
      description: 'Make sure your resume passes Applicant Tracking Systems.',
      type: 'guide',
      duration: '10 min read',
      difficulty: 'Intermediate',
      icon: <CheckCircle className="h-6 w-6" />
    },
    {
      id: 3,
      title: 'Video: Building Your First Resume',
      description: 'Step-by-step video tutorial for creating your first resume.',
      type: 'video',
      duration: '8 min watch',
      difficulty: 'Beginner',
      icon: <Video className="h-6 w-6" />
    },
    {
      id: 4,
      title: 'Template Selection Guide',
      description: 'Choose the right template for your industry and career level.',
      type: 'guide',
      duration: '5 min read',
      difficulty: 'Beginner',
      icon: <FileText className="h-6 w-6" />
    }
  ]

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      hours: 'Mon-Fri, 9AM-6PM EST',
      icon: <MessageCircle className="h-6 w-6" />,
      action: 'Start Chat',
      primary: true
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      hours: 'Response within 24 hours',
      icon: <Mail className="h-6 w-6" />,
      action: 'Send Email',
      primary: false
    },
    {
      title: 'Phone Support',
      description: 'Call our premium support line',
      hours: 'Premium users only',
      icon: <Phone className="h-6 w-6" />,
      action: 'Call Now',
      primary: false
    }
  ]

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const FaqItem = ({ faq }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{faq.question}</h3>
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-1" />
              {faq.helpful} helpful
            </span>
            <div className="flex space-x-1">
              {faq.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {expandedFaq === faq.id ? (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-gray-400" />
        )}
      </button>
      
      {expandedFaq === faq.id && (
        <div className="px-6 pb-4">
          <div className="border-t border-gray-100 pt-4">
            <p className="text-gray-700 leading-relaxed mb-4">{faq.answer}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="text-sm text-primary-600 hover:text-primary-800">
                  Was this helpful?
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  👍 Yes
                </button>
                <button className="text-sm text-gray-500 hover:text-gray-700">
                  👎 No
                </button>
              </div>
              <button className="text-sm text-primary-600 hover:text-primary-800">
                Need more help? Contact us →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="container py-20">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Help &
              <span className="block text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Support Center
              </span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Find answers to your questions, learn how to use our platform effectively, 
              and get the support you need to build the perfect resume.
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles, guides, and FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-primary-300 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: <Book className="h-8 w-8" />, title: 'Getting Started', desc: 'New to our platform?' },
              { icon: <FileText className="h-8 w-8" />, title: 'User Guides', desc: 'Step-by-step tutorials' },
              { icon: <MessageCircle className="h-8 w-8" />, title: 'Contact Support', desc: 'Need personal help?' },
              { icon: <Download className="h-8 w-8" />, title: 'Resources', desc: 'Templates & samples' }
            ].map((item, index) => (
              <button key={index} className="text-left p-4 rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group">
                <div className="text-primary-600 mb-3 group-hover:text-primary-700">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Categories */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Browse by Category</h2>
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
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
                <span className="text-gray-500">
                  {filteredFaqs.length} article{filteredFaqs.length !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div className="space-y-4">
                {filteredFaqs.map((faq) => (
                  <FaqItem key={faq.id} faq={faq} />
                ))}
              </div>
              
              {filteredFaqs.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or browse a different category.</p>
                </div>
              )}
            </div>

            {/* Guides Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Helpful Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guides.map((guide) => (
                  <div key={guide.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="text-primary-600">
                        {guide.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {guide.duration}
                            </span>
                            <span className={`px-2 py-1 rounded ${
                              guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {guide.difficulty}
                            </span>
                          </div>
                          <button className="text-primary-600 hover:text-primary-800 text-sm font-medium">
                            Read Guide →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Support */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Support</h3>
              <div className="space-y-4">
                {contactOptions.map((option, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="text-primary-600">
                        {option.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{option.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{option.description}</p>
                        <p className="text-xs text-gray-500 mb-3">{option.hours}</p>
                        <button className={`text-sm font-medium ${
                          option.primary 
                            ? 'text-primary-600 hover:text-primary-800' 
                            : 'text-gray-600 hover:text-gray-800'
                        }`}>
                          {option.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status & Updates */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm text-gray-700">All systems operational</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Info className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-gray-700">Maintenance scheduled: Dec 15</span>
                </div>
              </div>
              <button className="text-primary-600 hover:text-primary-800 text-sm font-medium mt-4 flex items-center">
                View Status Page
                <ExternalLink className="h-3 w-3 ml-1" />
              </button>
            </div>

            {/* Popular Resources */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Resources</h3>
              <div className="space-y-3">
                {[
                  'Resume Template Gallery',
                  'Cover Letter Examples',
                  'Interview Preparation Guide',
                  'Salary Negotiation Tips',
                  'LinkedIn Profile Optimization'
                ].map((resource, index) => (
                  <button key={index} className="block w-full text-left text-sm text-primary-600 hover:text-primary-800 py-1">
                    {resource} →
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Still Need Help Section */}
      <div className="bg-primary-50 py-16">
        <div className="container text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Still Need Help?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you succeed. 
            Get personalized assistance from our experts.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Live Chat
            </button>
            <button className="btn-outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help