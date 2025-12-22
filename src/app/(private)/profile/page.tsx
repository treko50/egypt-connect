"use client"

import Image from "next/image"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { STRINGS } from "@/hardcoded-strings"
import { Mail, Phone, MapPin, Award, Briefcase, Star, Calendar } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { profile } = STRINGS

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
                    alt={profile.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {profile.name}
                  </h1>
                  <p className="text-xl text-primary-600 mb-4">{profile.title}</p>
                  
                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                    {profile.expertise.map((skill) => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="text-sm px-3 py-1"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center md:justify-start">
                    <a
                      href="mailto:judge@egyptconnect.com"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span className="text-sm">judge@egyptconnect.com</span>
                    </a>
                    <a
                      href="tel:+201234567890"
                      className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      <span className="text-sm">+20 123 456 7890</span>
                    </a>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      <span className="text-sm">Cairo, Egypt</span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/calendar">
                      <Calendar className="h-5 w-5" />
                      Book Consultation
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
                  {profile.experience}
                </div>
                <p className="text-gray-600">Experience</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Briefcase className="h-12 w-12 mx-auto mb-4 text-primary-600" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.cases}
                </div>
                <p className="text-gray-600">Successful Cases</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <Star className="h-12 w-12 mx-auto mb-4 text-secondary-500" />
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {profile.rating}
                </div>
                <p className="text-gray-600">Client Rating</p>
              </CardContent>
            </Card>
          </div>

          {/* Bio Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed text-lg">
                {profile.bio}
              </p>
            </CardContent>
          </Card>

          {/* Services Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Legal Services</CardTitle>
              <CardDescription>
                Comprehensive legal consultation services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Commercial Law</h3>
                  <p className="text-gray-600">
                    Expert guidance on business contracts, corporate law, and commercial transactions.
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Civil Law</h3>
                  <p className="text-gray-600">
                    Assistance with property disputes, family law, and civil litigation matters.
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Legal Consulting</h3>
                  <p className="text-gray-600">
                    Strategic legal advice for individuals and businesses navigating complex legal issues.
                  </p>
                </div>
                <div className="border-l-4 border-primary-500 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Contract Review</h3>
                  <p className="text-gray-600">
                    Thorough analysis and review of contracts to protect your interests.
                  </p>
                </div>
              </div>

              <div className="mt-8 p-6 bg-primary-50 rounded-xl">
                <h3 className="font-semibold text-lg mb-4 text-center">
                  Ready to schedule a consultation?
                </h3>
                <div className="flex justify-center">
                  <Button asChild size="lg" className="gap-2">
                    <Link href="/calendar">
                      <Calendar className="h-5 w-5" />
                      Book Now
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
