# Database Seeding Guide

This guide will help you populate your database with test appointments and data.

## Prerequisites

**IMPORTANT:** Before running the seed file, you MUST:

1. ✅ Sign in to the app with `thalabi98@gmail.com` at least once
   - This creates your user account via the Clerk webhook
   - The seed script needs this account to exist first

2. ✅ (Optional) Sign in with `treko50@hotmail.com` if you want personal test appointments

## Method 1: Supabase SQL Editor (Recommended)

### Steps:

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your Egypt Connect project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query" button

3. **Copy and Run Seed File**
   - Open the file: `supabase/seed.sql`
   - Copy ALL the contents
   - Paste into the SQL Editor
   - Click **"Run"** or press `Ctrl+Enter`

4. **Verify Success**
   - You should see a success message
   - Check the "Table Editor" → "appointments" to see the test data

### What Gets Created:

The seed file will create:

- ✅ **8-10 Test Appointments** in various states:
  - 2-3 Pending appointments (awaiting confirmation)
  - 2-3 Confirmed appointments (upcoming)
  - 2-3 Completed appointments (past)
  - 1 Cancelled appointment
  - 1 appointment needing follow-up

- ✅ **3 Test Client Users:**
  - Sarah Mohamed (client1.test@example.com)
  - Omar Ibrahim (client2.test@example.com)
  - Fatima Ali (client3.test@example.com)

- ✅ **Test Documents** attached to appointments

- ✅ **Updates your account** (thalabi98@gmail.com) to judge role with:
  - Role: judge
  - Judge title: "Senior Legal Consultant"
  - Specialties: Commercial Law, Civil Law, Contract Law
  - Accepting bookings: true

## Method 2: Quick Judge Role Setup

If you only need to set the judge role (without test appointments):

1. Go to Supabase Dashboard → SQL Editor
2. Run this query:

```sql
UPDATE users
SET
  role = 'judge',
  is_accepting_bookings = true,
  judge_title = 'Senior Legal Consultant',
  judge_bio = 'Experienced legal professional providing consultation services.',
  judge_specialties = ARRAY['Commercial Law', 'Civil Law', 'Contract Law'],
  updated_at = NOW()
WHERE email = 'thalabi98@gmail.com';

-- Verify the update
SELECT id, email, first_name, last_name, role, judge_title, is_accepting_bookings
FROM users
WHERE email = 'thalabi98@gmail.com';
```

## Viewing Your Test Data

After seeding:

1. **Judge Dashboard**
   - Navigate to: http://localhost:3000/admin/dashboard
   - You should see all test appointments

2. **Calendar View**
   - Navigate to: http://localhost:3000/calendar
   - You should see upcoming appointments on the calendar

3. **Direct Database Check**
   - Go to Supabase Dashboard → Table Editor
   - View the `appointments` table
   - View the `users` table

## Troubleshooting

### "No appointments showing"
- ✅ Make sure you ran the full seed.sql file
- ✅ Check that you're signed in as thalabi98@gmail.com
- ✅ Verify in Supabase Table Editor that appointments exist
- ✅ Check that `assigned_judge_id` matches your user ID

### "User not found"
- ✅ Sign in to the app first to create your account
- ✅ Check Clerk Dashboard to verify the user exists
- ✅ Check Supabase `users` table to see if webhook synced

### "Permission denied"
- ✅ Make sure you're using the Supabase Service Role key
- ✅ Run the SQL in Supabase Dashboard (has full permissions)

## Clean Up Test Data (Optional)

To remove all test data later:

```sql
-- Delete test appointments
DELETE FROM appointments WHERE assigned_judge_id = (
  SELECT id FROM users WHERE email = 'thalabi98@gmail.com'
);

-- Delete test client users
DELETE FROM users WHERE email IN (
  'client1.test@example.com',
  'client2.test@example.com',
  'client3.test@example.com'
);
```

## Next Steps

After seeding:

1. ✅ Visit `/admin/dashboard` to see your appointments
2. ✅ Try confirming a pending appointment
3. ✅ Try completing a confirmed appointment
4. ✅ Test the document upload feature
5. ✅ Test marking appointments as needing follow-up
