import { requireJudge } from '@/lib/auth-helpers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { AppointmentDetailView } from '@/components/AppointmentDetailView'

export default async function AdminAppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Protect route - redirects if not a judge
  await requireJudge()

  // Await params in Next.js 15
  const { id } = await params

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <AppointmentDetailView appointmentId={id} />
        </div>
      </main>
      <Footer />
    </>
  )
}
