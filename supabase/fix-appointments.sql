-- Fix Appointments Script
-- This script diagnoses and fixes appointment visibility issues

-- Step 1: Check your user account
SELECT
  'Your User Account:' as section,
  id as user_id,
  email,
  clerk_id,
  role,
  judge_title,
  is_accepting_bookings
FROM users
WHERE email = 'thalabi98@gmail.com';

-- Step 2: Check if any appointments exist
SELECT
  'Total Appointments in Database:' as section,
  COUNT(*) as total_count
FROM appointments;

-- Step 3: Check appointments assigned to you
WITH judge_info AS (
  SELECT id FROM users WHERE email = 'thalabi98@gmail.com'
)
SELECT
  'Appointments Assigned to You:' as section,
  COUNT(*) as assigned_to_you_count
FROM appointments, judge_info
WHERE appointments.assigned_judge_id = judge_info.id;

-- Step 4: Show all appointments with their judge assignments
SELECT
  'All Appointments Details:' as section,
  a.id,
  a.title,
  a.status,
  a.start_time,
  a.assigned_judge_id,
  CASE
    WHEN a.assigned_judge_id = (SELECT id FROM users WHERE email = 'thalabi98@gmail.com')
    THEN 'YES - Assigned to you ✓'
    ELSE 'NO - Not assigned to you ✗'
  END as assigned_to_you,
  u.email as client_email,
  u.first_name || ' ' || u.last_name as client_name
FROM appointments a
LEFT JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- Step 5: FIX - Update all appointments to be assigned to you
-- Uncomment the lines below to run the fix:

-- UPDATE appointments
-- SET assigned_judge_id = (
--   SELECT id FROM users WHERE email = 'thalabi98@gmail.com'
-- )
-- WHERE assigned_judge_id IS NOT NULL
--   OR assigned_judge_id IS NULL;

-- Step 6: Verify the fix worked
-- Run this after uncommenting and running Step 5:

-- SELECT
--   'After Fix - Appointments Assigned to You:' as section,
--   COUNT(*) as count
-- FROM appointments
-- WHERE assigned_judge_id = (
--   SELECT id FROM users WHERE email = 'thalabi98@gmail.com'
-- );
