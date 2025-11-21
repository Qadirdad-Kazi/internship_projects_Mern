import { useParams } from 'react-router-dom'

const ResumeView = () => {
  const { id } = useParams()

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-soft rounded-lg p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Resume Viewer</h1>
        <p className="text-gray-600">
          Resume ID: {id}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          This page will display the resume preview and editing options.
        </p>
      </div>
    </div>
  )
}

export default ResumeView