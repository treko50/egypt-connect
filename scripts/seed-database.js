#!/usr/bin/env node

/**
 * Database seeding script
 *
 * This script runs the seed.sql file to populate your database with test data.
 *
 * Prerequisites:
 * 1. You must be signed in to the app with thalabi98@gmail.com first (to create the user account via Clerk)
 * 2. Make sure your .env file has the correct Supabase credentials
 *
 * Usage:
 *   node scripts/seed-database.js
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables')
  console.error('Please ensure .env file contains:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSeedFile() {
  console.log('🌱 Starting database seed...\n')

  // Read the seed file
  const seedPath = path.join(__dirname, '..', 'supabase', 'seed.sql')
  const seedSQL = fs.readFileSync(seedPath, 'utf8')

  console.log('📄 Seed file loaded:', seedPath)
  console.log('📝 SQL length:', seedSQL.length, 'characters\n')

  console.log('⚠️  Important Prerequisites:')
  console.log('   1. You must have signed in with thalabi98@gmail.com at least once')
  console.log('   2. This creates your user account via Clerk webhook\n')

  // Check if judge user exists
  const { data: judgeUser, error: userError } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('email', 'thalabi98@gmail.com')
    .single()

  if (userError || !judgeUser) {
    console.error('❌ Error: User thalabi98@gmail.com not found in database')
    console.error('   Please sign in to the app with this email first to create the account')
    process.exit(1)
  }

  console.log('✅ Found user:', judgeUser.email)
  console.log('   Current role:', judgeUser.role)
  console.log('   User ID:', judgeUser.id)
  console.log()

  // Note: Supabase JS client doesn't support running raw SQL with DO blocks
  // The user needs to run this in the Supabase SQL Editor
  console.log('📋 To seed your database with test appointments:')
  console.log()
  console.log('1. Go to your Supabase Dashboard: https://supabase.com/dashboard')
  console.log('2. Select your project')
  console.log('3. Navigate to "SQL Editor" in the left sidebar')
  console.log('4. Click "New Query"')
  console.log('5. Copy the contents of: supabase/seed.sql')
  console.log('6. Paste into the SQL Editor')
  console.log('7. Click "Run" or press Ctrl+Enter')
  console.log()
  console.log('This will create:')
  console.log('  • 8-10 test appointments in various states (pending, confirmed, completed)')
  console.log('  • 3 test client users')
  console.log('  • Test documents attached to appointments')
  console.log('  • Updates thalabi98@gmail.com to judge role')
  console.log()
  console.log('📍 Seed file location:', seedPath)
  console.log()
}

runSeedFile().catch((error) => {
  console.error('❌ Error:', error.message)
  process.exit(1)
})
