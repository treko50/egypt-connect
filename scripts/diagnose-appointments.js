#!/usr/bin/env node

/**
 * Diagnostic script to check why appointments aren't showing
 *
 * This script checks:
 * 1. If the user exists in Supabase
 * 2. What the user's role is
 * 3. What appointments exist
 * 4. If the assigned_judge_id matches the user's ID
 */

const { createClient } = require('@supabase/supabase-js')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function diagnose() {
  console.log('🔍 Diagnosing appointment visibility issue...\n')

  // 1. Check if user exists
  console.log('1️⃣  Checking user account...')
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('email', 'thalabi98@gmail.com')
    .single()

  if (userError || !user) {
    console.error('❌ User not found!')
    console.error('   Please sign in to the app with thalabi98@gmail.com first')
    console.error('   Error:', userError?.message)
    return
  }

  console.log('✅ User found:')
  console.log('   Email:', user.email)
  console.log('   ID:', user.id)
  console.log('   Clerk ID:', user.clerk_id)
  console.log('   Role:', user.role)
  console.log('   Judge Title:', user.judge_title)
  console.log('   Accepting Bookings:', user.is_accepting_bookings)
  console.log()

  if (user.role !== 'judge') {
    console.log('⚠️  Warning: User role is not "judge"')
    console.log('   The seed file should have set this to "judge"')
    console.log('   Try running the seed file again in Supabase SQL Editor')
    console.log()
  }

  // 2. Check all appointments
  console.log('2️⃣  Checking all appointments...')
  const { data: allAppointments, error: allApptError } = await supabase
    .from('appointments')
    .select('id, title, status, assigned_judge_id')
    .order('created_at', { ascending: false })

  if (allApptError) {
    console.error('❌ Error fetching appointments:', allApptError.message)
    return
  }

  if (!allAppointments || allAppointments.length === 0) {
    console.log('❌ No appointments found in database!')
    console.log('   The seed file may not have run successfully')
    console.log('   Please run supabase/seed.sql in the Supabase SQL Editor')
    console.log()
    return
  }

  console.log(`✅ Found ${allAppointments.length} total appointments`)
  console.log()

  // 3. Check appointments assigned to this judge
  console.log('3️⃣  Checking appointments assigned to you...')
  const assignedToMe = allAppointments.filter(a => a.assigned_judge_id === user.id)

  console.log(`   Assigned to you: ${assignedToMe.length}`)
  console.log()

  if (assignedToMe.length === 0) {
    console.log('❌ PROBLEM FOUND: No appointments assigned to your user ID!')
    console.log()
    console.log('   Your User ID:', user.id)
    console.log()
    console.log('   Appointments in database and their assigned judge IDs:')
    allAppointments.forEach((appt, i) => {
      console.log(`   ${i + 1}. ${appt.title}`)
      console.log(`      Status: ${appt.status}`)
      console.log(`      Assigned Judge ID: ${appt.assigned_judge_id}`)
      console.log(`      Match: ${appt.assigned_judge_id === user.id ? '✅ YES' : '❌ NO'}`)
      console.log()
    })

    console.log('🔧 SOLUTION:')
    console.log('   The seed file creates appointments with assigned_judge_id')
    console.log('   but it might not match your user ID.')
    console.log()
    console.log('   Run this SQL in Supabase SQL Editor to fix:')
    console.log()
    console.log('   UPDATE appointments')
    console.log('   SET assigned_judge_id = (')
    console.log('     SELECT id FROM users WHERE email = \'thalabi98@gmail.com\'')
    console.log('   )')
    console.log('   WHERE assigned_judge_id IS NOT NULL;')
    console.log()
  } else {
    console.log('✅ Appointments assigned to you:')
    assignedToMe.forEach((appt, i) => {
      console.log(`   ${i + 1}. ${appt.title}`)
      console.log(`      Status: ${appt.status}`)
      console.log()
    })

    console.log('✅ Everything looks good!')
    console.log('   If appointments still don\'t show in the dashboard:')
    console.log('   1. Make sure you\'re signed in as thalabi98@gmail.com')
    console.log('   2. Try refreshing the page')
    console.log('   3. Check browser console for errors')
  }

  // 4. Check API would return
  console.log('4️⃣  Simulating API query...')
  const { data: apiResult, error: apiError } = await supabase
    .from('appointments')
    .select(`
      *,
      user:users!appointments_user_id_fkey (
        id,
        first_name,
        last_name,
        email,
        phone
      )
    `)
    .eq('assigned_judge_id', user.id)
    .eq('status', 'confirmed')
    .order('start_time', { ascending: false })

  if (apiError) {
    console.error('❌ API query error:', apiError.message)
  } else {
    console.log(`   Confirmed appointments: ${apiResult?.length || 0}`)
  }
  console.log()
}

diagnose().catch((error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
