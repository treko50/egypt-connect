import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from './supabase'
import { redirect } from 'next/navigation'

export async function requireAuth() {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  return userId
}

export async function requireJudge() {
  const userId = await requireAuth()

  const { data: userData, error } = await supabaseAdmin
    .from('users')
    .select('id, role')
    .eq('clerk_id', userId)
    .single()

  if (error || !userData) {
    redirect('/unauthorized')
  }

  const user: { id: string; role: string } = userData

  if (user.role !== 'judge') {
    redirect('/unauthorized')
  }

  return user
}

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  const { data: user } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', userId)
    .single()

  return user
}
