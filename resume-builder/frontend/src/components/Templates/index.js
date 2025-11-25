// Template registry with real template components
import ModernTemplate from './ModernTemplate'
import ClassicTemplate from './ClassicTemplate'
import MinimalTemplate from './MinimalTemplate'
import CreativeTemplate from './CreativeTemplate'

export const templateRegistry = {
  'modern-professional': ModernTemplate,
  'executive-classic': ClassicTemplate,
  'minimal-clean': MinimalTemplate,
  'creative-portfolio': CreativeTemplate,
  'tech-innovator': ModernTemplate, // Reuse with different config
  'corporate-elite': ClassicTemplate, // Reuse with different config
  'simple-effective': MinimalTemplate, // Reuse with different config
  'design-studio': CreativeTemplate // Reuse with different config
}

export const templates = [
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    category: 'modern',
    description: 'Clean and contemporary design perfect for tech and creative roles',
    component: ModernTemplate,
    features: ['Two-column layout', 'Color accents', 'Icon integration', 'ATS-friendly'],
    isPremium: false,
    rating: 4.9,
    downloads: 15420,
    colors: {
      primary: '#2563eb',
      secondary: '#64748b',
      accent: '#06b6d4'
    }
  },
  {
    id: 'executive-classic',
    name: 'Executive Classic',
    category: 'classic',
    description: 'Traditional format ideal for senior positions and conservative industries',
    component: ClassicTemplate,
    features: ['Single column', 'Professional fonts', 'Traditional layout', 'Print-optimized'],
    isPremium: false,
    rating: 4.8,
    downloads: 12350,
    colors: {
      primary: '#1f2937',
      secondary: '#6b7280',
      accent: '#374151'
    }
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'minimal',
    description: 'Simple and elegant design that focuses on content clarity',
    component: MinimalTemplate,
    features: ['Lots of whitespace', 'Clean typography', 'Subtle accents', 'Easy scanning'],
    isPremium: false,
    rating: 4.7,
    downloads: 9870,
    colors: {
      primary: '#000000',
      secondary: '#525252',
      accent: '#737373'
    }
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    category: 'creative',
    description: 'Bold and unique design for designers and creative professionals',
    component: CreativeTemplate,
    features: ['Visual elements', 'Custom graphics', 'Color blocks', 'Portfolio section'],
    isPremium: true,
    rating: 4.9,
    downloads: 8960,
    colors: {
      primary: '#7c3aed',
      secondary: '#a78bfa',
      accent: '#c4b5fd'
    }
  },
  {
    id: 'tech-innovator',
    name: 'Tech Innovator',
    category: 'modern',
    description: 'Cutting-edge design perfect for tech professionals and startups',
    component: ModernTemplate,
    features: ['Dark mode option', 'Tech-focused', 'Skill charts', 'Project showcase'],
    isPremium: true,
    rating: 4.8,
    downloads: 7420,
    colors: {
      primary: '#059669',
      secondary: '#34d399',
      accent: '#6ee7b7'
    }
  },
  {
    id: 'corporate-elite',
    name: 'Corporate Elite',
    category: 'classic',
    description: 'Sophisticated design for corporate executives and business leaders',
    component: ClassicTemplate,
    features: ['Executive summary', 'Achievement focus', 'Professional tone', 'Leadership emphasis'],
    isPremium: true,
    rating: 4.9,
    downloads: 6890,
    colors: {
      primary: '#1e40af',
      secondary: '#3b82f6',
      accent: '#60a5fa'
    }
  },
  {
    id: 'simple-effective',
    name: 'Simple & Effective',
    category: 'minimal',
    description: 'Straightforward design that highlights your qualifications clearly',
    component: MinimalTemplate,
    features: ['No distractions', 'Content-first', 'Easy to read', 'Universal appeal'],
    isPremium: false,
    rating: 4.6,
    downloads: 11250,
    colors: {
      primary: '#374151',
      secondary: '#6b7280',
      accent: '#9ca3af'
    }
  },
  {
    id: 'design-studio',
    name: 'Design Studio',
    category: 'creative',
    description: 'Artistic layout perfect for designers, artists, and creative agencies',
    component: CreativeTemplate,
    features: ['Artistic flair', 'Portfolio grid', 'Brand colors', 'Visual hierarchy'],
    isPremium: true,
    rating: 4.8,
    downloads: 5670,
    colors: {
      primary: '#dc2626',
      secondary: '#ef4444',
      accent: '#f87171'
    }
  }
]

export default templates