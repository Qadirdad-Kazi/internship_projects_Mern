import { useParams } from 'react-router-dom'

const PublicResume = () => {
  const { shareId } = useParams()

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-soft rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Public Resume View</h1>
          <p className="text-gray-600">
            Share ID: {shareId}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This page will display the public resume for the given share ID.
          </p>
        </div>
      </div>
    </div>
  )
}

export default PublicResume