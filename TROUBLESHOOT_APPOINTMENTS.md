# Troubleshooting: No Appointments Showing in Judge Dashboard

## The Problem

You're signed in as a judge (thalabi98@gmail.com) but the dashboard at `/admin/dashboard` shows no appointments, even after running the seed file.

## Most Likely Cause

The `assigned_judge_id` in the appointments table doesn't match your user's `id` in the users table. This happens when:

1. The seed file ran **before** you signed in for the first time
2. The seed file used a different judge ID than your actual user ID
3. There was a mismatch between the Clerk user ID and Supabase user ID

## Quick Diagnosis

Run this SQL in **Supabase SQL Editor**:

```sql
-- Check your user ID
SELECT id, email, role FROM users WHERE email = 'thalabi98@gmail.com';

-- Check appointment assignments
SELECT
  COUNT(*) as total_appointments,
  COUNT(CASE WHEN assigned_judge_id = (SELECT id FROM users WHERE email = 'thalabi98@gmail.com') THEN 1 END) as assigned_to_you
FROM appointments;
```

If `assigned_to_you` is **0**, that's the problem!

## Quick Fix

Run this SQL in **Supabase SQL Editor**:

```sql
-- Fix all appointments to be assigned to you
UPDATE appointments
SET assigned_judge_id = (
  SELECT id FROM users WHERE email = 'thalabi98@gmail.com'
)
WHERE assigned_judge_id IS NOT NULL OR assigned_judge_id IS NULL;

-- Verify it worked
SELECT COUNT(*) as appointments_assigned_to_you
FROM appointments
WHERE assigned_judge_id = (SELECT id FROM users WHERE email = 'thalabi98@gmail.com');
```

## Detailed Diagnosis & Fix

### Method 1: Using Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://supabase.com/dashboard
   - Select your Egypt Connect project
   - Click **"SQL Editor"** in left sidebar

2. **Run Diagnostic Script**
   - Click **"New Query"**
   - Copy contents of `supabase/fix-appointments.sql`
   - Paste and click **"Run"**
   - Review the output to see what's wrong

3. **Apply Fix**
   - In the same file, uncomment lines 43-48 (the UPDATE statement)
   - Click **"Run"** again
   - This assigns all appointments to your user

4. **Verify**
   - Refresh your judge dashboard
   - Appointments should now appear

### Method 2: Manual Check in Table Editor

1. **Check Users Table**
   - Go to Supabase Dashboard → Table Editor → `users`
   - Find row where `email = 'thalabi98@gmail.com'`
   - Copy the `id` value (it's a UUID like `a1b2c3d4-...`)

2. **Check Appointments Table**
   - Go to Table Editor → `appointments`
   - Look at the `assigned_judge_id` column
   - Does it match the `id` you copied? If NO, that's the issue!

3. **Fix Manually**
   - For each appointment row, edit the `assigned_judge_id` column
   - Paste your user `id` from step 1
   - Save changes

## Root Cause Explained

The seed file (`supabase/seed.sql`) does this:

```sql
-- Get judge ID
SELECT id INTO judge_id FROM users WHERE email = 'thalabi98@gmail.com';

-- Create appointments with this judge_id
INSERT INTO appointments (..., assigned_judge_id) VALUES (..., judge_id);
```

**If you hadn't signed in yet**, the `SELECT` returns NULL, so appointments get created with `assigned_judge_id = NULL`.

The dashboard filters appointments by:
```javascript
query = query.eq('assigned_judge_id', user.id)
```

If `assigned_judge_id` is NULL or doesn't match your user ID, no appointments show!

## Prevention

To prevent this in the future:

1. ✅ **Always sign in FIRST** with thalabi98@gmail.com
2. ✅ **Then** run the seed file
3. ✅ Verify in Supabase Table Editor that the user exists before seeding

## Additional Checks

### Check 1: User Role

Make sure your user has `role = 'judge'`:

```sql
SELECT email, role, is_accepting_bookings FROM users WHERE email = 'thalabi98@gmail.com';
```

Should show:
- `role`: judge
- `is_accepting_bookings`: true

### Check 2: Clerk Integration

Make sure Clerk synced your user to Supabase:

```sql
SELECT email, clerk_id, created_at FROM users WHERE email = 'thalabi98@gmail.com';
```

Should show:
- `clerk_id`: Something like `user_2abc...`
- `created_at`: Recent timestamp

If `clerk_id` is NULL, the Clerk webhook isn't working!

### Check 3: Browser Console

1. Open judge dashboard
2. Press F12 → Console tab
3. Look for errors like:
   - `401 Unauthorized` - Not signed in
   - `403 Forbidden` - Wrong role
   - `404 Not Found` - User not in database
   - `500 Server Error` - Database/API issue

## Still Not Working?

If appointments still don't show after the fix:

1. **Clear browser cache** and refresh
2. **Sign out and sign in again**
3. **Check browser console** for JavaScript errors
4. **Verify API response**:
   - Open DevTools → Network tab
   - Refresh dashboard
   - Look for `/api/appointments?assignedOnly=true` request
   - Check the response - does it have appointments?

## Create Test Appointment

If all else fails, create a test appointment directly:

```sql
-- Get your user ID
DO $$
DECLARE
  judge_id UUID;
BEGIN
  SELECT id INTO judge_id FROM users WHERE email = 'thalabi98@gmail.com';

  -- Create test appointment
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    payment_status,
    amount_paid,
    currency
  ) VALUES (
    judge_id, -- Using judge as client for testing
    judge_id, -- Assigned to you
    'Test Appointment - Please Confirm',
    'This is a test appointment to verify the dashboard works',
    NOW() + INTERVAL '1 day',
    NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
    'pending',
    'initial',
    'paid',
    50.00,
    'usd'
  );

  RAISE NOTICE 'Test appointment created!';
END $$;
```

This creates one appointment that should definitely show up!

## Contact for Help

If you're still stuck after trying all of the above, check:

1. Your `.env` file has correct Supabase credentials
2. Supabase project is running (not paused)
3. Database migrations have run successfully

Share the output of `supabase/fix-appointments.sql` for further debugging.
