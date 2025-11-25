import { useState } from 'react'
import { User, Mail, Phone, MapPin, Globe, Camera, X } from 'lucide-react'
import { FormInput, FormTextarea } from '../Forms'

const PersonalInfoForm = ({ data = {}, onChange, errors = {} }) => {
  const [imagePreview, setImagePreview] = useState(data.profilePicture || null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // Handle nested address fields
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1]
      onChange({
        target: {
          name: 'address',
          value: {
            ...data.address,
            [addressField]: value
          }
        }
      })
    } else {
      onChange(e)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setImagePreview(imageUrl)
        onChange({
          target: {
            name: 'profilePicture',
            value: imageUrl
          }
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    onChange({
      target: {
        name: 'profilePicture',
        value: ''
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <User className="h-5 w-5 mr-2 text-primary-500" />
          Personal Information
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Add your basic contact information and professional summary
        </p>
      </div>

      {/* Profile Picture Upload */}
      <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-shrink-0">
          <div className="relative">
            {imagePreview ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                <Camera className="h-8 w-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Profile Picture (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <p className="text-xs text-gray-500 mt-1">
            Upload a professional headshot (JPG, PNG, max 5MB)
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormInput
          label="Full Name"
          name="fullName"
          value={data.fullName || ''}
          onChange={handleInputChange}
          placeholder="John Doe"
          required
          error={errors.fullName}
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={data.email || ''}
          onChange={handleInputChange}
          placeholder="john.doe@example.com"
          required
          error={errors.email}
        />

        <FormInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={data.phone || ''}
          onChange={handleInputChange}
          placeholder="+1 (555) 123-4567"
          error={errors.phone}
        />

        <FormInput
          label="Website"
          name="website"
          type="url"
          value={data.website || ''}
          onChange={handleInputChange}
          placeholder="https://johndoe.com"
          error={errors.website}
        />

        <FormInput
          label="LinkedIn Profile"
          name="linkedin"
          type="url"
          value={data.linkedin || ''}
          onChange={handleInputChange}
          placeholder="https://linkedin.com/in/johndoe"
          error={errors.linkedin}
        />

        <FormInput
          label="GitHub Profile"
          name="github"
          type="url"
          value={data.github || ''}
          onChange={handleInputChange}
          placeholder="https://github.com/johndoe"
          error={errors.github}
        />
      </div>

      {/* Address */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center">
          <MapPin className="h-4 w-4 mr-2 text-primary-500" />
          Address
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <FormInput
              label="Street Address"
              name="address.street"
              value={data.address?.street || ''}
              onChange={handleInputChange}
              placeholder="123 Main Street"
              error={errors['address.street']}
            />
          </div>

          <FormInput
            label="City"
            name="address.city"
            value={data.address?.city || ''}
            onChange={handleInputChange}
            placeholder="New York"
            error={errors['address.city']}
          />

          <FormInput
            label="State/Province"
            name="address.state"
            value={data.address?.state || ''}
            onChange={handleInputChange}
            placeholder="NY"
            error={errors['address.state']}
          />

          <FormInput
            label="ZIP/Postal Code"
            name="address.zipCode"
            value={data.address?.zipCode || ''}
            onChange={handleInputChange}
            placeholder="10001"
            error={errors['address.zipCode']}
          />

          <FormInput
            label="Country"
            name="address.country"
            value={data.address?.country || ''}
            onChange={handleInputChange}
            placeholder="United States"
            error={errors['address.country']}
          />
        </div>
      </div>

      {/* Professional Summary */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center">
          <Globe className="h-4 w-4 mr-2 text-primary-500" />
          Professional Summary
        </h4>
        
        <FormTextarea
          label="Summary"
          name="professionalSummary"
          value={data.professionalSummary || ''}
          onChange={handleInputChange}
          placeholder="Write a brief summary of your professional background, key skills, and career objectives..."
          rows={4}
          maxLength={500}
          error={errors.professionalSummary}
        />
        <p className="text-xs text-gray-500">
          Write 2-3 sentences that highlight your experience, skills, and what you're looking for in your next role.
        </p>
      </div>
    </div>
  )
}

export default PersonalInfoForm