import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">404 - Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
        <Link
          href="/en"
          className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded"
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
