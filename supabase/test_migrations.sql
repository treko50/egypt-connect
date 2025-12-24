-- Test Suite for Migrations 003 & 004
-- Run these queries one by one in Supabase SQL Editor to verify functionality

-- ============================================================================
-- SETUP: Get IDs we'll need for testing
-- ============================================================================

-- Get a client user ID
SELECT id, email, role FROM users WHERE role = 'client' LIMIT 1;
-- Copy the client ID from above, you'll need it below

-- Get the judge user ID
SELECT id, email, role, is_accepting_bookings FROM users WHERE role = 'judge' LIMIT 1;
-- Verify judge exists and is_accepting_bookings = true

-- ============================================================================
-- TEST 1: Auto-assignment trigger
-- ============================================================================
-- Expected: New appointment should automatically get assigned to the judge

-- Replace 'CLIENT_ID_HERE' with actual client ID from above
INSERT INTO appointments (user_id, title, start_time, end_time, status)
VALUES (
  'CLIENT_ID_HERE',
  'Test Auto-Assignment',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
  'pending'
)
RETURNING id, title, assigned_judge_id;

-- ✅ PASS if assigned_judge_id is populated automatically
-- ❌ FAIL if assigned_judge_id is NULL

-- Cleanup (replace APPOINTMENT_ID with the ID from above)
-- DELETE FROM appointments WHERE id = 'APPOINTMENT_ID';

-- ============================================================================
-- TEST 2: Consultation type constraint
-- ============================================================================
-- Expected: Only valid consultation types are allowed

-- This should SUCCEED (valid type)
INSERT INTO appointments (user_id, title, start_time, end_time, consultation_type)
VALUES (
  'CLIENT_ID_HERE',
  'Test Valid Type',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days' + INTERVAL '1 hour',
  'initial'
)
RETURNING id, consultation_type;

-- This should FAIL (invalid type)
INSERT INTO appointments (user_id, title, start_time, end_time, consultation_type)
VALUES (
  'CLIENT_ID_HERE',
  'Test Invalid Type',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days' + INTERVAL '1 hour',
  'invalidType'
)
RETURNING id;

-- ✅ PASS if you get error: "new row for relation violates check constraint"
-- ❌ FAIL if invalid type is inserted

-- ============================================================================
-- TEST 3: Follow-up requires parent constraint
-- ============================================================================
-- Expected: Cannot create follow-up without parent_appointment_id

-- This should FAIL (follow-up without parent)
INSERT INTO appointments (user_id, title, start_time, end_time, consultation_type)
VALUES (
  'CLIENT_ID_HERE',
  'Test Follow-up Without Parent',
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days' + INTERVAL '1 hour',
  'followUp'
)
RETURNING id;

-- ✅ PASS if you get error: "new row violates check constraint followup_has_parent"
-- ❌ FAIL if follow-up is created without parent

-- ============================================================================
-- TEST 4: Follow-up validation trigger (requires completed parent)
-- ============================================================================

-- Step 1: Create a completed initial appointment
INSERT INTO appointments (user_id, title, start_time, end_time, consultation_type, status)
VALUES (
  'CLIENT_ID_HERE',
  'Completed Initial Consultation',
  NOW() - INTERVAL '1 week',
  NOW() - INTERVAL '1 week' + INTERVAL '1 hour',
  'initial',
  'completed'
)
RETURNING id;
-- Copy this appointment ID - you'll use it as parent_appointment_id

-- Step 2: Try to create follow-up with completed parent (should SUCCEED)
INSERT INTO appointments (
  user_id,
  title,
  start_time,
  end_time,
  consultation_type,
  parent_appointment_id
)
VALUES (
  'CLIENT_ID_HERE',
  'Follow-up to Completed Session',
  NOW() + INTERVAL '1 day',
  NOW() + INTERVAL '1 day' + INTERVAL '1 hour',
  'followUp',
  'COMPLETED_APPOINTMENT_ID_HERE'
)
RETURNING id, parent_appointment_id;

-- ✅ PASS if follow-up is created successfully
-- ❌ FAIL if you get an error

-- Step 3: Create a pending appointment
INSERT INTO appointments (user_id, title, start_time, end_time, consultation_type, status)
VALUES (
  'CLIENT_ID_HERE',
  'Pending Initial Consultation',
  NOW() + INTERVAL '2 days',
  NOW() + INTERVAL '2 days' + INTERVAL '1 hour',
  'initial',
  'pending'
)
RETURNING id;
-- Copy this appointment ID

-- Step 4: Try to create follow-up with pending parent (should FAIL)
INSERT INTO appointments (
  user_id,
  title,
  start_time,
  end_time,
  consultation_type,
  parent_appointment_id
)
VALUES (
  'CLIENT_ID_HERE',
  'Follow-up to Pending Session',
  NOW() + INTERVAL '3 days',
  NOW() + INTERVAL '3 days' + INTERVAL '1 hour',
  'followUp',
  'PENDING_APPOINTMENT_ID_HERE'
)
RETURNING id;

-- ✅ PASS if you get error: "Follow-up appointments require a completed initial consultation"
-- ❌ FAIL if follow-up is created with non-completed parent

-- ============================================================================
-- TEST 5: Database views
-- ============================================================================

-- Test judge_appointments_view
SELECT
  id,
  title,
  status,
  consultation_type,
  client_first_name,
  client_last_name,
  client_email,
  parent_appointment_title,
  document_count
FROM judge_appointments_view
LIMIT 5;

-- ✅ PASS if you see appointments with client information joined
-- ❌ FAIL if view doesn't exist or returns errors

-- Test client_appointments_view
SELECT
  id,
  title,
  status,
  consultation_type,
  client_notes,
  judge_notes,
  parent_appointment_title,
  document_count
FROM client_appointments_view
LIMIT 5;

-- ✅ PASS if you see appointments without internal_notes column
-- ❌ FAIL if view doesn't exist or shows internal_notes

-- ============================================================================
-- TEST 6: Document appointment relationship
-- ============================================================================

-- Verify user_id column is gone from documents
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'documents';

-- ✅ PASS if you DON'T see 'user_id' in the results
-- ❌ FAIL if 'user_id' still exists

-- Test: Create document linked to appointment (not user)
-- First get an appointment ID
SELECT id FROM appointments LIMIT 1;

-- Try to insert document with appointment_id
INSERT INTO documents (
  appointment_id,
  name,
  type,
  file_url,
  file_size,
  mime_type,
  uploaded_by,
  description
)
VALUES (
  'APPOINTMENT_ID_HERE',
  'test-document.pdf',
  'legal',
  'https://example.com/test.pdf',
  1024,
  'application/pdf',
  'client',
  'Test document for appointment'
)
RETURNING id, appointment_id, name;

-- ✅ PASS if document is created successfully
-- ❌ FAIL if you get an error

-- Test: Query document with user info (through appointment)
SELECT
  d.id,
  d.name,
  d.uploaded_by,
  a.title as appointment_title,
  u.first_name,
  u.last_name,
  u.email
FROM documents d
JOIN appointments a ON d.appointment_id = a.id
JOIN users u ON a.user_id = u.id
LIMIT 5;

-- ✅ PASS if you can access user info through the join
-- ❌ FAIL if query fails

-- ============================================================================
-- CLEANUP (Optional)
-- ============================================================================
-- Run these to clean up test data

-- Delete test documents
-- DELETE FROM documents WHERE name LIKE 'test%' OR name LIKE 'Test%';

-- Delete test appointments
-- DELETE FROM appointments WHERE title LIKE 'Test%' OR title LIKE '%Test%';

-- ============================================================================
-- Summary Checklist
-- ============================================================================
-- [ ] Auto-assignment trigger works
-- [ ] Consultation type constraint works
-- [ ] Follow-up requires parent constraint works
-- [ ] Follow-up validation trigger works (requires completed parent)
-- [ ] Judge appointments view works
-- [ ] Client appointments view works
-- [ ] Documents no longer have user_id
-- [ ] Documents can be created with appointment_id
-- [ ] User info accessible through document → appointment → user join
