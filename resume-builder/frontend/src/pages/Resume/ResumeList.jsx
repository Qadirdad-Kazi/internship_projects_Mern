import { FileText, Plus, Filter, Search, Grid, List } from 'lucide-react'
import { Link } from 'react-router-dom'

const ResumeList = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
          <p className="text-gray-600 mt-1">Manage and organize all your resumes</p>
        </div>
        <Link
          to="/resume-builder"
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Resume
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white shadow-soft rounded-lg p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resumes..."
                className="input pl-10"
              />
            </div>
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-4">
            <select className="input">
              <option value="">All Templates</option>
              <option value="modern">Modern</option>
              <option value="classic">Classic</option>
              <option value="minimal">Minimal</option>
              <option value="creative">Creative</option>
            </select>

            <div className="flex rounded-md shadow-sm">
              <button className="btn-outline rounded-r-none">
                <Grid className="h-4 w-4" />
              </button>
              <button className="btn-ghost rounded-l-none border-l-0">
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white shadow-soft rounded-lg p-12 text-center">
        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
        <p className="text-gray-600 mb-6">
          Get started by creating your first resume. It only takes a few minutes!
        </p>
        <Link to="/resume-builder" className="btn-primary">
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Resume
        </Link>
      </div>
    </div>
  )
}

export default ResumeList