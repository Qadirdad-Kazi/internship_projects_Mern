import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  FileText, 
  Download, 
  Palette, 
  Shield,
  Star,
  CheckCircle,
  PlayCircle
} from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const Landing = () => {
  const { user } = useAuthStore()
  const features = [
    {
      icon: Palette,
      title: 'Professional Templates',
      description: 'Choose from 4 carefully designed templates that make your resume stand out.'
    },
    {
      icon: Download,
      title: 'PDF Export',
      description: 'Download your resume as a high-quality PDF that looks great on any device.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and secure. We never share your information.'
    },
    {
      icon: FileText,
      title: 'Easy to Use',
      description: 'Build your resume in minutes with our intuitive drag-and-drop interface.'
    }
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'Tech Corp',
      content: 'This resume builder helped me land my dream job! The templates are professional and the PDF export is flawless.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Marketing Manager',
      company: 'Growth Inc',
      content: 'I was able to create a stunning resume in just 10 minutes. Highly recommended!',
      rating: 5
    },
    {
      name: 'Emily Davis',
      role: 'Designer',
      company: 'Creative Studio',
      content: 'The templates are beautiful and modern. Perfect for showcasing my design skills.',
      rating: 5
    }
  ]

  const templates = [
    { name: 'Modern', color: 'bg-blue-500', description: 'Clean and contemporary' },
    { name: 'Classic', color: 'bg-gray-600', description: 'Timeless and professional' },
    { name: 'Minimal', color: 'bg-green-500', description: 'Simple and elegant' },
    { name: 'Creative', color: 'bg-purple-500', description: 'Bold and artistic' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Build Your Perfect Resume
              <span className="text-gradient block mt-2">In Minutes</span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Create professional resumes with our easy-to-use builder. Choose from beautiful templates 
              and export to PDF instantly. No design skills required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="btn-primary btn-lg text-primary-700 bg-white hover:bg-gray-100 hover:text-primary-800"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link
                    to="/resume-builder"
                    className="btn-ghost btn-lg text-white border-white/30 hover:bg-white/10"
                  >
                    <FileText className="mr-2 h-5 w-5" />
                    Create Resume
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary btn-lg text-primary-700 bg-white hover:bg-gray-100 hover:text-primary-800"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <button className="btn-ghost btn-lg text-white border-white/30 hover:bg-white/10">
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Watch Demo
                  </button>
                </>
              )}
            </div>
            <p className="text-sm text-primary-200 mt-4">
              No credit card required • Free forever plan available
            </p>
          </div>

          {/* Hero Image/Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-primary-200 text-sm">Resumes Created</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4</div>
              <div className="text-primary-200 text-sm">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">95%</div>
              <div className="text-primary-200 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">24/7</div>
              <div className="text-primary-200 text-sm">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Build the Perfect Resume
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools and features you need to create a 
              professional resume that gets you noticed by employers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="text-center group hover-lift">
                  <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                    <Icon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose From Professional Templates
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All templates are designed by professionals and optimized for ATS systems 
              to help you get past the initial screening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-soft hover-lift">
                <div className={`w-full h-32 ${template.color} rounded-lg mb-4 flex items-center justify-center`}>
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="btn-primary btn-lg"
            >
              Start Building Your Resume
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-gray-600">
              Creating your perfect resume is easier than ever with our 3-step process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose a Template</h3>
              <p className="text-gray-600">
                Select from our collection of professional templates designed to impress employers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fill in Your Details</h3>
              <p className="text-gray-600">
                Add your personal information, work experience, education, and skills using our guided form.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Download PDF</h3>
              <p className="text-gray-600">
                Export your resume as a high-quality PDF and start applying to your dream jobs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Job Seekers Worldwide
            </h2>
            <p className="text-gray-600">
              See what our users have to say about their experience with Resume Builder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-soft">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build Your Resume?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who have successfully landed their dream jobs 
            with our resume builder.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link
                  to="/resume-builder"
                  className="btn-primary btn-lg bg-white text-primary-700 hover:bg-gray-100"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Create New Resume
                </Link>
                <Link
                  to="/dashboard"
                  className="btn-ghost btn-lg text-white border-white/30 hover:bg-white/10"
                >
                  View Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn-primary btn-lg bg-white text-primary-700 hover:bg-gray-100"
                >
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Start Building Now
                </Link>
                <Link
                  to="/login"
                  className="btn-ghost btn-lg text-white border-white/30 hover:bg-white/10"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Landing