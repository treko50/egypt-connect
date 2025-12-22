import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import createMiddleware from 'next-intl/middleware'

const intlMiddleware = createMiddleware({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
})

const isPublicRoute = createRouteMatcher([
  '/',
  '/en',
  '/ar',
  '/en/(.*)',
  '/ar/(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)'
])

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect()
  }
  return intlMiddleware(req)
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}