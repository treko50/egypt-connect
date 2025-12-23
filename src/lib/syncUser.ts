import { User } from '@clerk/nextjs/server'
import { supabase } from './supabase'

/**
 * Syncs a Clerk user to Supabase database
 * Creates user if doesn't exist, updates if exists
 */
export async function syncUserToSupabase(clerkUser: User) {
  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('clerk_id', clerkUser.id)
      .single()

    const userData = {
      clerk_id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      first_name: clerkUser.firstName || '',
      last_name: clerkUser.lastName || '',
      phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
    }

    if (existingUser) {
      // Update existing user
      await supabase
        .from('users')
        .update(userData)
        .eq('clerk_id', clerkUser.id)
    } else {
      // Create new user
      await supabase.from('users').insert(userData)
    }

    return true
  } catch (error) {
    console.error('Error syncing user to Supabase:', error)
    return false
  }
}
