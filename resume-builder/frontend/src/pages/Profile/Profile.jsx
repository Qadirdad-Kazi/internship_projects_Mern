import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Shield, Save, AlertCircle, CheckCircle, Camera, X } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'
import { FormInput, FormSelect } from '../../components/Forms'

const Profile = () => {
  const { user, updateProfile, changePassword, isLoading, error } = useAuthStore()
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      profilePicture: ''
    }
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [successMessage, setSuccessMessage] = useState('')
  const [imagePreview, setImagePreview] = useState(null)

  // Countries list
  const countries = [
    { value: '', label: 'Select Country' },
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'IN', label: 'India' },
    { value: 'BR', label: 'Brazil' }
  ]

  // Load user data when component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        profile: {
          firstName: user.profile?.firstName || '',
          lastName: user.profile?.lastName || '',
          phone: user.profile?.phone || '',
          dateOfBirth: user.profile?.dateOfBirth ? new Date(user.profile.dateOfBirth).toISOString().split('T')[0] : '',
          address: {
            street: user.profile?.address?.street || '',
            city: user.profile?.address?.city || '',
            state: user.profile?.address?.state || '',
            zipCode: user.profile?.address?.zipCode || '',
            country: user.profile?.address?.country || ''
          },
          profilePicture: user.profile?.profilePicture || ''
        }
      })
      setImagePreview(user.profile?.profilePicture || null)
    }
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('profile.address.')) {
      const addressField = name.split('.')[2]
      setProfileData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          address: {
            ...prev.profile.address,
            [addressField]: value
          }
        }
      }))
    } else if (name.startsWith('profile.')) {
      const profileField = name.split('.')[1]
      setProfileData(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          [profileField]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target.result
        setImagePreview(imageUrl)
        setProfileData(prev => ({
          ...prev,
          profile: {
            ...prev.profile,
            profilePicture: imageUrl
          }
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImagePreview(null)
    setProfileData(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        profilePicture: ''
      }
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
    
    try {
      const result = await updateProfile(profileData)
      if (result.success) {
        setSuccessMessage('Profile updated successfully!')
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Profile update error:', error)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setSuccessMessage('')
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' })
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters long' })
      return
    }
    
    try {
      const result = await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      })
      
      if (result.success) {
        setSuccessMessage('Password changed successfully!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setTimeout(() => setSuccessMessage(''), 3000)
      }
    } catch (error) {
      console.error('Password change error:', error)
    }
  }

  const formatMemberSince = (date) => {
    if (!date) return 'Unknown'
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const getProfileCompleteness = () => {
    if (!user) return 0
    
    let completed = 0
    const total = 8
    
    if (user.name) completed++
    if (user.email) completed++
    if (user.profile?.firstName) completed++
    if (user.profile?.lastName) completed++
    if (user.profile?.phone) completed++
    if (user.profile?.address?.city) completed++
    if (user.profile?.address?.country) completed++
    if (user.profile?.profilePicture) completed++
    
    return Math.round((completed / total) * 100)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="bg-white shadow-soft rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Personal Information
              </h2>
            </div>
            <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
              {/* Profile Picture */}
              <div className="flex items-center space-x-6 pb-4 border-b border-gray-200">
                <div className="relative">
                  {imagePreview ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={imagePreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="h-10 w-10 text-primary-600" />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profilePicture"
                  />
                  <label
                    htmlFor="profilePicture"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Change Photo
                  </label>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="First Name"
                  name="profile.firstName"
                  value={profileData.profile.firstName}
                  onChange={handleProfileChange}
                  placeholder="Enter first name"
                  error={errors['profile.firstName']}
                />
                <FormInput
                  label="Last Name"
                  name="profile.lastName"
                  value={profileData.profile.lastName}
                  onChange={handleProfileChange}
                  placeholder="Enter last name"
                  error={errors['profile.lastName']}
                />
              </div>
              
              <FormInput
                label="Full Name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Enter full name"
                required
                error={errors.name}
              />
              
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter email address"
                required
                error={errors.email}
              />
              
              <FormInput
                label="Phone Number"
                name="profile.phone"
                type="tel"
                value={profileData.profile.phone}
                onChange={handleProfileChange}
                placeholder="Enter phone number"
                error={errors['profile.phone']}
              />
              
              <FormInput
                label="Date of Birth"
                name="profile.dateOfBirth"
                type="date"
                value={profileData.profile.dateOfBirth}
                onChange={handleProfileChange}
                error={errors['profile.dateOfBirth']}
              />
            </form>
          </div>

          {/* Address Information */}
          <div className="bg-white shadow-soft rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Address Information
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <FormInput
                label="Street Address"
                name="profile.address.street"
                value={profileData.profile.address.street}
                onChange={handleProfileChange}
                placeholder="Enter street address"
                error={errors['profile.address.street']}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  label="City"
                  name="profile.address.city"
                  value={profileData.profile.address.city}
                  onChange={handleProfileChange}
                  placeholder="City"
                  error={errors['profile.address.city']}
                />
                <FormInput
                  label="State/Province"
                  name="profile.address.state"
                  value={profileData.profile.address.state}
                  onChange={handleProfileChange}
                  placeholder="State"
                  error={errors['profile.address.state']}
                />
                <FormInput
                  label="ZIP/Postal Code"
                  name="profile.address.zipCode"
                  value={profileData.profile.address.zipCode}
                  onChange={handleProfileChange}
                  placeholder="ZIP Code"
                  error={errors['profile.address.zipCode']}
                />
              </div>
              
              <FormSelect
                label="Country"
                name="profile.address.country"
                value={profileData.profile.address.country}
                onChange={handleProfileChange}
                options={countries}
                error={errors['profile.address.country']}
              />
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white shadow-soft rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </h2>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
              <FormInput
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
                error={errors.currentPassword}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                  required
                  error={errors.newPassword}
                />
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                  required
                  error={errors.confirmPassword}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary"
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button
              onClick={handleProfileSubmit}
              disabled={isLoading}
              className="btn-primary"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          {/* Success/Error Messages */}
          {successMessage && (
            <div className="flex items-center p-4 mb-4 text-sm text-green-800 border border-green-300 rounded-lg bg-green-50">
              <CheckCircle className="h-4 w-4 mr-2" />
              {successMessage}
            </div>
          )}
          
          {error && (
            <div className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50">
              <AlertCircle className="h-4 w-4 mr-2" />
              {error}
            </div>
          )}
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white shadow-soft rounded-lg p-6">
            <div className="text-center">
              {user.profile?.profilePicture ? (
                <img 
                  src={user.profile.profilePicture}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-gray-200"
                />
              ) : (
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-600" />
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900">
                {user.name || 'No Name Set'}
              </h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="mt-4">
                <span className={`badge ${
                  user.subscription?.plan === 'premium' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : user.subscription?.plan === 'enterprise'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {user.subscription?.plan?.charAt(0).toUpperCase() + user.subscription?.plan?.slice(1) || 'Free'} Plan
                </span>
              </div>
              {user.emailVerified && (
                <div className="mt-2">
                  <span className="inline-flex items-center text-xs text-green-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white shadow-soft rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Account Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resumes Created</span>
                <span className="font-medium">
                  {user.resumes?.length || 0} / {user.subscription?.features?.maxResumes || 3}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">PDF Exports Available</span>
                <span className="font-medium">{user.subscription?.features?.pdfExports || 10}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Completeness</span>
                <div className="flex items-center">
                  <span className="font-medium mr-2">{getProfileCompleteness()}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${getProfileCompleteness()}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-medium">{formatMemberSince(user.createdAt)}</span>
              </div>
              {user.lastLogin && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Last Login</span>
                  <span className="font-medium">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Upgrade Banner - Only show for free users */}
          {user.subscription?.plan === 'free' && (
            <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
              <h4 className="font-semibold mb-2">Upgrade to Premium</h4>
              <p className="text-primary-100 text-sm mb-4">
                Unlock unlimited resumes, premium templates, and advanced features.
              </p>
              <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100 w-full">
                Upgrade Now
              </button>
            </div>
          )}

          {/* Account Status */}
          <div className="bg-white shadow-soft rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Account Status</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Active</span>
                <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                  user.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email Verified</span>
                <span className={`inline-flex items-center text-xs px-2 py-1 rounded-full ${
                  user.emailVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user.emailVerified ? 'Verified' : 'Pending'}
                </span>
              </div>
              {user.subscription?.expiresAt && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Subscription Expires</span>
                  <span className="text-xs font-medium">
                    {new Date(user.subscription.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile