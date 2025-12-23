'use client'

import Link from "next/link"
import { useTranslations } from '@/components/LanguageProvider'
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Calendar, Clock, Users, Shield, Zap, Globe } from "lucide-react"

const features = [
  { icon: Calendar, key: 'scheduling' },
  { icon: Clock, key: 'timezone' },
  { icon: Users, key: 'team' },
  { icon: Shield, key: 'secure' },
  { icon: Zap, key: 'fast' },
  { icon: Globe, key: 'global' },
]

export default function Home() {
  const { t: tHome } = useTranslations('home')
  const { t: tFeatures } = useTranslations('home.features')

  return (
    <>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
          <div className="absolute inset-0 bg-gradient-mesh opacity-30" />
          <div className="container relative mx-auto px-4 py-20 md:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-6 inline-flex items-center rounded-full bg-primary-100 px-4 py-2 text-sm font-medium text-primary-700">
                <Zap className="mr-2 h-4 w-4" />
                {tHome('badge')}
              </div>

              <h1 className="mb-6 text-5xl md:text-7xl font-bold tracking-tight text-gray-900 animate-fade-in">
                {tHome('title')}
              </h1>

              <p className="mb-8 text-xl text-gray-600 max-w-2xl mx-auto animate-slide-up">
                {tHome('intro')}
              </p>

              <p className="mb-10 text-lg text-gray-500 max-w-xl mx-auto animate-slide-up">
                {tHome('description')}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                <Button asChild size="lg" className="text-lg px-8 py-6 rounded-xl">
                  <Link href="/calendar">{tHome('scheduleButton')}</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl">
                  <Link href="#features">{tHome('learnMore')}</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {tFeatures('title')}
              </h2>
              <p className="text-xl text-gray-600">
                {tFeatures('subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <Card
                    key={feature.key}
                    className="hover:shadow-xl transition-shadow duration-300 border-gray-100"
                  >
                    <CardHeader>
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl mb-2">
                        {tFeatures(`${feature.key}.title`)}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {tFeatures(`${feature.key}.description`)}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {tHome('cta.title')}
            </h2>
            <p className="text-xl mb-10 text-primary-100 max-w-2xl mx-auto">
              {tHome('cta.subtitle')}
            </p>
            <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6 rounded-xl">
              <Link href="/calendar">{tHome('cta.button')}</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
