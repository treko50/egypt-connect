-- Seed file for test data
-- Run with: psql -h <db-host> -U postgres -d postgres -f supabase/seed.sql

-- Note: This assumes users table already exists
-- Get existing user IDs for testing

-- IMPORTANT: Before running this seed file:
-- 1. Sign in to the app with thalabi98@gmail.com (to create judge account)
-- 2. (Optional) Sign in with treko50@hotmail.com (to create personal test client account)
-- 3. Then run this seed file to set roles and create test appointments

-- Update existing user to judge role (using your email)
-- Note: This assumes you already have a user account from Clerk sync
UPDATE users
SET
  role = 'judge',
  is_accepting_bookings = true,
  judge_title = 'Senior Legal Consultant',
  judge_bio = 'Experienced legal professional providing consultation services.',
  judge_specialties = ARRAY['Commercial Law', 'Civil Law', 'Contract Law'],
  updated_at = NOW()
WHERE email = 'thalabi98@gmail.com';

-- Update your personal test account to client role (if it exists from Clerk)
UPDATE users
SET
  role = 'client',
  first_name = COALESCE(first_name, 'Tarek'),
  last_name = COALESCE(last_name, 'Halabi'),
  phone = COALESCE(phone, '+1 555 123 4567'),
  location = COALESCE(location, 'New York, USA'),
  updated_at = NOW()
WHERE email = 'treko50@hotmail.com';

-- Insert test client users
INSERT INTO users (
  clerk_id,
  email,
  first_name,
  last_name,
  role,
  phone,
  location,
  language
) VALUES
(
  'test_client_1_clerk_id',
  'client1.test@example.com',
  'Sarah',
  'Mohamed',
  'client',
  '+20 100 234 5678',
  'Cairo, Egypt',
  'en'
),
(
  'test_client_2_clerk_id',
  'client2.test@example.com',
  'Omar',
  'Ibrahim',
  'client',
  '+20 100 345 6789',
  'Alexandria, Egypt',
  'ar'
),
(
  'test_client_3_clerk_id',
  'client3.test@example.com',
  'Fatima',
  'Ali',
  'client',
  '+20 100 456 7890',
  'Giza, Egypt',
  'en'
)
ON CONFLICT (clerk_id) DO NOTHING;

-- Get IDs for creating appointments
DO $$
DECLARE
  judge_id UUID;
  personal_client_id UUID;
  client1_id UUID;
  client2_id UUID;
  client3_id UUID;
  parent_appt_id UUID;
BEGIN
  -- Get user IDs
  SELECT id INTO judge_id FROM users WHERE email = 'thalabi98@gmail.com';
  SELECT id INTO personal_client_id FROM users WHERE email = 'treko50@hotmail.com';
  SELECT id INTO client1_id FROM users WHERE email = 'client1.test@example.com';
  SELECT id INTO client2_id FROM users WHERE email = 'client2.test@example.com';
  SELECT id INTO client3_id FROM users WHERE email = 'client3.test@example.com';

  -- Insert appointments for your personal test account (only if account exists)
  IF personal_client_id IS NOT NULL THEN
    -- Pending appointment (you can test confirming it)
    INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    personal_client_id,
    judge_id,
    'Personal Test - Contract Review',
    'Testing the appointment system with personal account',
    NOW() + INTERVAL '2 days' + INTERVAL '14 hours',
    NOW() + INTERVAL '2 days' + INTERVAL '15 hours',
    'pending',
    'initial',
    'This is a test appointment to verify the entire workflow including email notifications and status updates.',
    'paid',
    50.00,
    'usd',
    'https://whereby.com/personal-test-meeting-1',
    'whereby'
  );

  -- Confirmed appointment (you can test completing it)
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    personal_client_id,
    judge_id,
    'Personal Test - Business Consultation',
    'Testing confirmed appointment workflow',
    NOW() + INTERVAL '4 days' + INTERVAL '10 hours',
    NOW() + INTERVAL '4 days' + INTERVAL '11 hours',
    'confirmed',
    'premium',
    'Testing the premium consultation workflow with extended time and meeting setup.',
    'paid',
    70.00,
    'usd',
    'https://whereby.com/personal-test-meeting-2',
    'whereby'
  );
  END IF;

  -- Insert pending appointment (payment made, awaiting judge confirmation)
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    client1_id,
    judge_id,
    'Initial Consultation - Business Contract Review',
    'Need review of partnership agreement for new business venture',
    NOW() + INTERVAL '3 days',
    NOW() + INTERVAL '3 days' + INTERVAL '1 hour',
    'pending',
    'initial',
    'I have a 15-page partnership agreement that needs legal review before signing. Main concerns are liability clauses and exit strategy.',
    'paid',
    50.00,
    'usd',
    'https://whereby.com/test-meeting-1',
    'whereby'
  );

  -- Insert confirmed appointment (upcoming in 1 day)
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    client2_id,
    judge_id,
    'Document Review - Employment Contract',
    'Review of employment contract from international company',
    NOW() + INTERVAL '1 day' + INTERVAL '10 hours',
    NOW() + INTERVAL '1 day' + INTERVAL '11 hours',
    'confirmed',
    'documentReview',
    'International tech company offer. Need to understand visa sponsorship clauses and non-compete terms.',
    'paid',
    20.00,
    'usd',
    'https://whereby.com/test-meeting-2',
    'whereby'
  );

  -- Insert completed appointment (finished 5 days ago)
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    judge_notes,
    internal_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    client3_id,
    judge_id,
    'Initial Consultation - Property Dispute',
    'Legal advice on property inheritance dispute',
    NOW() - INTERVAL '5 days',
    NOW() - INTERVAL '5 days' + INTERVAL '1 hour',
    'completed',
    'initial',
    'Family property dispute. Multiple heirs, unclear will. Need guidance on Egyptian inheritance law.',
    E'Session Summary:\n- Reviewed inheritance documentation\n- Explained Egyptian inheritance law as it applies to your case\n- Recommended next steps:\n  1. Gather all property deeds and ownership documents\n  2. Obtain certified copy of will from court\n  3. Schedule follow-up to discuss mediation options\n\nFollow-up recommended in 2 weeks.',
    'Client seems reasonable. Family tensions high but resolvable. Consider mediation before litigation. High probability of successful settlement.',
    'paid',
    50.00,
    'usd',
    'https://whereby.com/test-meeting-3',
    'whereby'
  )
  RETURNING id INTO parent_appt_id;

  -- Insert appointment needing follow-up
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    judge_notes,
    internal_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    client1_id,
    judge_id,
    'Initial Consultation - Trademark Registration',
    'Guidance on trademark registration for new brand',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '2 days' + INTERVAL '1 hour',
    'needs_follow_up',
    'initial',
    'Starting e-commerce business. Need to register trademark and understand IP protection in Egypt.',
    'Discussed trademark registration process and requirements. Client needs to complete trademark search and gather branding materials before we can proceed with application.',
    'Client very motivated. Good candidate for ongoing legal support. Trademark application will be straightforward.',
    'paid',
    50.00,
    'usd',
    'https://whereby.com/test-meeting-4',
    'whereby'
  );

  -- Insert appointment ready for auto-completion (confirmed, ended 1 hour ago)
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    client2_id,
    judge_id,
    'Document Review - Contract Negotiation',
    'Review updated business contract after negotiations',
    NOW() - INTERVAL '2 hours',
    NOW() - INTERVAL '1 hour',
    'confirmed',
    'documentReview',
    'Need quick review of updated contract after recent negotiations.',
    'paid',
    20.00,
    'usd',
    'https://whereby.com/test-meeting-5',
    'whereby'
  );

  -- Insert cancelled appointment
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
    client3_id,
    judge_id,
    'Premium Consultation - Complex Business Transaction',
    'Comprehensive legal guidance on business acquisition',
    NOW() + INTERVAL '2 days',
    NOW() + INTERVAL '2 days' + INTERVAL '2 hours',
    'cancelled',
    'premium',
    'refunded',
    70.00,
    'usd'
  );

  -- Insert completed parent appointment with follow-up
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    judge_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    client1_id,
    judge_id,
    'Initial Consultation - Real Estate Transaction',
    'Legal review of real estate purchase agreement',
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '10 days' + INTERVAL '1 hour',
    'completed',
    'initial',
    'Purchasing apartment in New Cairo. Need contract review and closing process guidance.',
    'Reviewed purchase agreement. Identified several clauses needing revision. Client to request amendments from seller.',
    'paid',
    50.00,
    'usd',
    'https://whereby.com/test-meeting-6',
    'whereby'
  )
  RETURNING id INTO parent_appt_id;

  -- Insert follow-up appointment linked to parent
  INSERT INTO appointments (
    user_id,
    assigned_judge_id,
    parent_appointment_id,
    title,
    description,
    start_time,
    end_time,
    status,
    consultation_type,
    client_notes,
    payment_status,
    amount_paid,
    currency,
    meeting_url,
    meeting_provider
  ) VALUES (
    client1_id,
    judge_id,
    parent_appt_id,
    'Follow-Up - Real Estate Transaction Update',
    'Review amended contract and discuss next steps',
    NOW() + INTERVAL '2 days' + INTERVAL '5 hours',
    NOW() + INTERVAL '2 days' + INTERVAL '6 hours',
    'confirmed',
    'followUp',
    'Seller agreed to most amendments. Have revised contract for final review.',
    'paid',
    30.00,
    'usd',
    'https://whereby.com/test-meeting-7',
    'whereby'
  );

END $$;

-- Add some test documents
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
SELECT
  a.id,
  'partnership-agreement.pdf',
  'contract',
  'https://example.com/documents/test-doc-1.pdf',
  2456789,
  'application/pdf',
  'client',
  'Draft partnership agreement for review'
FROM appointments a
WHERE a.title = 'Initial Consultation - Business Contract Review'
LIMIT 1;

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
SELECT
  a.id,
  'employment-contract.pdf',
  'contract',
  'https://example.com/documents/test-doc-2.pdf',
  1234567,
  'application/pdf',
  'client',
  'Employment contract from TechCorp International'
FROM appointments a
WHERE a.title = 'Document Review - Employment Contract'
LIMIT 1;

COMMENT ON TABLE users IS 'Test data seeded with 1 judge and 3 clients';
COMMENT ON TABLE appointments IS 'Test data seeded with 8 appointments in various states';
