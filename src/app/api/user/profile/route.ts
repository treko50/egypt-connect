import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET /api/user/profile - Get user profile
export async function GET() {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create user in Supabase
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single()

    if (error && error.code === 'PGRST116') {
      // User doesn't exist, create one
      const clerkUser = await currentUser()

      if (!clerkUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          clerk_id: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          first_name: clerkUser.firstName || '',
          last_name: clerkUser.lastName || '',
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
        })
        .select()
        .single()

      if (insertError) {
        console.error('Error creating user:', insertError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }

      user = newUser
    } else if (error) {
      console.error('Error fetching user:', error)
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error in GET /api/user/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT /api/user/profile - Update user profile
export async function PUT(request: Request) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { firstName, lastName, phone, location, timezone, language } = body

    // Validate required fields
    if (!firstName?.trim()) {
      return NextResponse.json({ error: 'First name is required' }, { status: 400 })
    }

    // Update user in Supabase
    const { data, error } = await supabase
      .from('users')
      .update({
        first_name: firstName.trim(),
        last_name: lastName?.trim() || null,
        phone: phone?.trim() || null,
        location: location?.trim() || null,
        timezone: timezone || null,
        language: language || 'en',
      })
      .eq('clerk_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in PUT /api/user/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
