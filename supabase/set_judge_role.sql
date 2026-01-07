-- Set judge role for thalabi98@gmail.com
-- Run this in Supabase SQL Editor

-- Update the user role to 'judge' and enable accepting bookings
UPDATE users
SET
  role = 'judge',
  is_accepting_bookings = true,
  judge_title = 'Judge',
  updated_at = NOW()
WHERE email = 'thalabi98@gmail.com';

-- Verify the update
SELECT
  id,
  email,
  first_name,
  last_name,
  role,
  judge_title,
  is_accepting_bookings
FROM users
WHERE email = 'thalabi98@gmail.com';
