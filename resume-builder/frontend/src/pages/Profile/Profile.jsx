import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react'

const Profile = () => {
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
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">First Name</label>
                  <input type="text" className="input" placeholder="Enter first name" />
                </div>
                <div>
                  <label className="label">Last Name</label>
                  <input type="text" className="input" placeholder="Enter last name" />
                </div>
              </div>
              
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input" placeholder="Enter email address" />
              </div>
              
              <div>
                <label className="label">Phone Number</label>
                <input type="tel" className="input" placeholder="Enter phone number" />
              </div>
              
              <div>
                <label className="label">Date of Birth</label>
                <input type="date" className="input" />
              </div>
            </div>
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
              <div>
                <label className="label">Street Address</label>
                <input type="text" className="input" placeholder="Enter street address" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="label">City</label>
                  <input type="text" className="input" placeholder="City" />
                </div>
                <div>
                  <label className="label">State/Province</label>
                  <input type="text" className="input" placeholder="State" />
                </div>
                <div>
                  <label className="label">ZIP/Postal Code</label>
                  <input type="text" className="input" placeholder="ZIP Code" />
                </div>
              </div>
              
              <div>
                <label className="label">Country</label>
                <select className="input">
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
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
            <div className="p-6 space-y-4">
              <div>
                <label className="label">Current Password</label>
                <input type="password" className="input" placeholder="Enter current password" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label">New Password</label>
                  <input type="password" className="input" placeholder="Enter new password" />
                </div>
                <div>
                  <label className="label">Confirm Password</label>
                  <input type="password" className="input" placeholder="Confirm new password" />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <button className="btn-primary">
              Save Changes
            </button>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white shadow-soft rounded-lg p-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">John Doe</h3>
              <p className="text-gray-600">john.doe@example.com</p>
              <div className="mt-4">
                <span className="badge-success">Free Plan</span>
              </div>
            </div>
          </div>

          {/* Account Stats */}
          <div className="bg-white shadow-soft rounded-lg p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Account Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Resumes Created</span>
                <span className="font-medium">3 / 3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">PDF Downloads</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Profile Completeness</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="font-medium">Jan 2024</span>
              </div>
            </div>
          </div>

          {/* Upgrade Banner */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-6 text-white">
            <h4 className="font-semibold mb-2">Upgrade to Premium</h4>
            <p className="text-primary-100 text-sm mb-4">
              Unlock unlimited resumes, premium templates, and advanced features.
            </p>
            <button className="btn-primary bg-white text-primary-600 hover:bg-gray-100 w-full">
              Upgrade Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile