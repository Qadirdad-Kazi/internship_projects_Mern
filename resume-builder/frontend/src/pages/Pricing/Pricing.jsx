import { useState } from 'react'
import { Check, X, Star, Zap, Crown, Shield } from 'lucide-react'

const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState('monthly')

  const plans = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: { monthly: 0, annual: 0 },
      icon: <Star className="h-6 w-6" />,
      color: 'gray',
      popular: false,
      features: [
        '1 resume template',
        'Basic customization',
        'PDF download',
        'Standard support',
        'Basic ATS optimization'
      ],
      limitations: [
        'Limited templates',
        'Basic features only',
        'No priority support',
        'No advanced analytics'
      ],
      buttonText: 'Get Started Free',
      buttonStyle: 'btn-outline'
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'Most popular for job seekers',
      price: { monthly: 9, annual: 7 },
      icon: <Zap className="h-6 w-6" />,
      color: 'blue',
      popular: true,
      features: [
        'All premium templates',
        'Advanced customization',
        'Multiple formats (PDF, Word)',
        'Priority support',
        'Advanced ATS optimization',
        'Cover letter builder',
        'LinkedIn profile optimization',
        'Real-time collaboration',
        'Analytics dashboard'
      ],
      limitations: [],
      buttonText: 'Start Pro Trial',
      buttonStyle: 'btn-primary'
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For serious professionals',
      price: { monthly: 19, annual: 15 },
      icon: <Crown className="h-6 w-6" />,
      color: 'purple',
      popular: false,
      features: [
        'Everything in Pro',
        'Personal branding consultation',
        'Custom template design',
        'Interview preparation tools',
        'Salary negotiation guide',
        'Career coaching session',
        'LinkedIn premium features',
        'Job application tracking',
        'White-label sharing',
        'API access'
      ],
      limitations: [],
      buttonText: 'Go Premium',
      buttonStyle: 'btn-primary'
    }
  ]

  const faqs = [
    {
      question: 'Can I change my plan anytime?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and we\'ll prorate any charges.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! Pro and Premium plans come with a 14-day free trial. No credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely.'
    },
    {
      question: 'Can I cancel anytime?',
      answer: 'Absolutely. You can cancel your subscription at any time from your account settings. No cancellation fees.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied, we\'ll refund your money.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes, we use enterprise-grade security and encryption. Your data is stored securely and never shared with third parties.'
    }
  ]

  const PlanCard = ({ plan }) => (
    <div className={`relative bg-white rounded-2xl shadow-soft p-8 ${plan.popular ? 'ring-2 ring-primary-500 shadow-lg' : ''}`}>
      {/* Popular Badge */}
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
            Most Popular
          </span>
        </div>
      )}
      
      {/* Plan Header */}
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-16 h-16 bg-${plan.color}-100 rounded-xl mb-4`}>
          <div className={`text-${plan.color}-600`}>
            {plan.icon}
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
        <p className="text-gray-600">{plan.description}</p>
      </div>
      
      {/* Pricing */}
      <div className="text-center mb-8">
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-gray-900">
            ${plan.price[billingPeriod]}
          </span>
          <span className="text-gray-600 ml-1">
            /{billingPeriod === 'monthly' ? 'month' : 'month'}
          </span>
        </div>
        {billingPeriod === 'annual' && plan.price.annual < plan.price.monthly && (
          <p className="text-sm text-green-600 mt-2">
            Save ${(plan.price.monthly - plan.price.annual) * 12}/year
          </p>
        )}
      </div>
      
      {/* Features */}
      <div className="space-y-4 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-gray-700">{feature}</span>
          </div>
        ))}
        {plan.limitations.map((limitation, index) => (
          <div key={index} className="flex items-start opacity-50">
            <X className="h-5 w-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
            <span className="text-gray-500">{limitation}</span>
          </div>
        ))}
      </div>
      
      {/* CTA Button */}
      <button className={`w-full ${plan.buttonStyle} ${plan.popular ? 'btn-primary' : plan.id === 'free' ? 'btn-outline' : 'btn-secondary'}`}>
        {plan.buttonText}
      </button>
      
      {plan.id !== 'free' && (
        <p className="text-center text-sm text-gray-500 mt-4">
          14-day free trial • No credit card required
        </p>
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
              Simple, Transparent
              <span className="block text-gradient bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Pricing
              </span>
            </h1>
            <p className="text-xl text-primary-100 mb-8 leading-relaxed">
              Choose the plan that works for you. Start with our free plan and upgrade as you grow. 
              All plans include our core resume building features.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-primary-800/50 rounded-lg p-1 mb-8">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'monthly' 
                    ? 'bg-white text-primary-600' 
                    : 'text-primary-100 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingPeriod === 'annual' 
                    ? 'bg-white text-primary-600' 
                    : 'text-primary-100 hover:text-white'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full">
                  Save 22%
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </div>

      {/* Feature Comparison */}
      <div className="bg-white py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare Plans & Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See exactly what's included in each plan to make the right choice for your needs
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Features</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Free</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">
                    <span className="inline-flex items-center">
                      Pro
                      <span className="ml-2 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">Popular</span>
                    </span>
                  </th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900">Premium</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  { feature: 'Resume Templates', free: '1', pro: 'All (50+)', premium: 'All + Custom' },
                  { feature: 'PDF Download', free: true, pro: true, premium: true },
                  { feature: 'Word Download', free: false, pro: true, premium: true },
                  { feature: 'Cover Letter Builder', free: false, pro: true, premium: true },
                  { feature: 'ATS Optimization', free: 'Basic', pro: 'Advanced', premium: 'Expert' },
                  { feature: 'Analytics Dashboard', free: false, pro: true, premium: true },
                  { feature: 'Priority Support', free: false, pro: true, premium: true },
                  { feature: 'Career Coaching', free: false, pro: false, premium: true },
                  { feature: 'Custom Branding', free: false, pro: false, premium: true }
                ].map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium text-gray-900">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-gray-700">{row.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.pro === 'boolean' ? (
                        row.pro ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-gray-700">{row.pro}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.premium === 'boolean' ? (
                        row.premium ? <Check className="h-5 w-5 text-green-500 mx-auto" /> : <X className="h-5 w-5 text-gray-400 mx-auto" />
                      ) : (
                        <span className="text-gray-700">{row.premium}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-100 py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-gray-600">Your data is encrypted and never shared. Enterprise-grade security.</p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">30-Day Guarantee</h3>
              <p className="text-gray-600">Not satisfied? Get a full refund within 30 days, no questions asked.</p>
            </div>
            <div className="text-center">
              <Zap className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Access</h3>
              <p className="text-gray-600">Start building immediately. No setup required, works in your browser.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Got questions? We've got answers. Can't find what you're looking for? Contact our support team.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
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
            Join thousands of job seekers who have successfully landed their dream jobs using our platform. 
            Start your free trial today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Start Free Trial
            </button>
            <button className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Contact Sales
            </button>
          </div>
          <p className="text-primary-200 text-sm mt-6">
            14-day free trial • No credit card required • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  )
}

export default Pricing