import { requireJudge } from '@/lib/auth-helpers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { JudgeDashboard } from '@/components/JudgeDashboard'

export default async function AdminDashboardPage() {
  // Protect route - redirects if not a judge
  await requireJudge()

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Judge Dashboard
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Manage appointments, review documents, and communicate with clients
            </p>
          </div>

          <JudgeDashboard />
        </div>
      </main>
      <Footer />
    </>
  )
}
