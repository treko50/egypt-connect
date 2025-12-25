-- Quick diagnostic to check if appointment exists
-- Replace the ID below with the one from your error

-- Check if appointment exists
SELECT
  id,
  title,
  status,
  user_id,
  assigned_judge_id,
  created_at
FROM appointments
WHERE id = '37ab653a-3ac9-46a4-bfb0-f1cbbb1e9ae8';

-- Check all appointments
SELECT
  id,
  title,
  status,
  user_id,
  assigned_judge_id
FROM appointments
ORDER BY created_at DESC
LIMIT 10;

-- Check if user exists for the appointment
SELECT
  a.id as appointment_id,
  a.title,
  a.user_id,
  u.id as user_exists,
  u.email,
  u.first_name,
  u.last_name
FROM appointments a
LEFT JOIN users u ON a.user_id = u.id
WHERE a.id = '37ab653a-3ac9-46a4-bfb0-f1cbbb1e9ae8';
