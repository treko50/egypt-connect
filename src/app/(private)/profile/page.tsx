"use client"

import Image from "next/image"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useTranslations } from "@/components/LanguageProvider"
import { Mail, Phone, MapPin, Award, Briefcase, Star, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { t } = useTranslations('profile')
  const { t: tJudge } = useTranslations('judge')
  const { t: tFooter } = useTranslations('footer')

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                {/* Profile Image */}
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-500 to-primary-700 flex-shrink-0">
                  <Image
                    src="/main_pic.jpg"
                    alt={tJudge('name')}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {tJudge('name')}
                  </h1>
                  <p className="text-xl text-primary-600 mb-4">{tJudge('title')}</p>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {tJudge('expertise.commercial')}
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {tJudge('expertise.civil')}
                    </Badge>
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {tJudge('expertise.consulting')}
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center md:justify-start">
                    <a
                      href={`mailto:${tFooter('contact.email')}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="text-sm">{tFooter('contact.email')}</span>
                    </a>
                    <a
                      href={`tel:${tFooter('contact.phone').replace(/\s/g, '')}`}
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="text-sm">{tFooter('contact.phone')}</span>
                    </a>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span className="text-sm">{tFooter('contact.location')}</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/calendar">
                      <Calendar className="h-5 w-5" />
                      {t('bookConsultation')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardContent className="pt-6">
                <Award className="h-12 w-12 mx-auto mb-4 text-primary-600" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {tJudge('stats.experience')}
                </div>
                <p className="text-gray-600">{t('experience')}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-primary-600" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {tJudge('stats.cases')}
                </div>
                <p className="text-gray-600">{t('cases')}</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 mx-auto mb-4 text-secondary-500" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {tJudge('stats.rating')}
                </div>
                <p className="text-gray-600">{t('rating')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Bio Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">{t('about')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                {tJudge('bio')}
              </p>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{t('legalServices')}</CardTitle>
              <CardDescription>
                {t('servicesSubtitle')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{t('commercialLaw.title')}</h3>
                  <p className="text-gray-600">
                    {t('commercialLaw.description')}
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{t('civilLaw.title')}</h3>
                  <p className="text-gray-600">
                    {t('civilLaw.description')}
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{t('legalConsulting.title')}</h3>
                  <p className="text-gray-600">
                    {t('legalConsulting.description')}
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">{t('contractReview.title')}</h3>
                  <p className="text-gray-600">
                    {t('contractReview.description')}
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary-50 rounded-xl">
                <h3 className="font-semibold text-lg mb-4 text-center">
                  {t('ctaTitle')}
                </h3>
                <div className="flex justify-center">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/calendar">
                      <Calendar className="h-5 w-5" />
                      {t('bookNow')}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  )
}
