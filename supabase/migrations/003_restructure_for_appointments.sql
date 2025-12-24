-- Migration 003: Restructure for appointment-based documents and judge dashboard
-- This migration:
-- 1. Adds role-based access (client/judge)
-- 2. Makes documents appointment-specific
-- 3. Adds judge fields to users
-- 4. Adds appointment linking and notes

-- Add role and judge fields to users table
ALTER TABLE users
  ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'client',
  ADD COLUMN judge_title VARCHAR(100),
  ADD COLUMN judge_bio TEXT,
  ADD COLUMN judge_specialties TEXT[],
  ADD COLUMN is_accepting_bookings BOOLEAN DEFAULT false;

-- Update existing judge user (update email if needed)
UPDATE users
SET
  role = 'judge',
  judge_title = 'Senior Legal Consultant & Judge',
  judge_bio = 'Judge Hatem Elnahal brings over 25 years of distinguished legal experience to Egypt Connect. Specializing in commercial and civil law, he has successfully handled over 1,000 cases throughout his career.',
  judge_specialties = ARRAY['Commercial Law', 'Civil Law', 'Legal Consulting'],
  is_accepting_bookings = true
WHERE email = 'judge@egyptconnect.com';

-- Add appointment linking and notes columns
ALTER TABLE appointments
  ADD COLUMN assigned_judge_id UUID REFERENCES users(id),
  ADD COLUMN parent_appointment_id UUID REFERENCES appointments(id),
  ADD COLUMN consultation_type VARCHAR(50) NOT NULL DEFAULT 'initial',
  ADD COLUMN client_notes TEXT,
  ADD COLUMN judge_notes TEXT,
  ADD COLUMN internal_notes TEXT;

-- Add check constraint for consultation types
ALTER TABLE appointments
  ADD CONSTRAINT valid_consultation_type
  CHECK (consultation_type IN ('initial', 'followUp', 'standard', 'premium', 'documentReview'));

-- Add check constraint: follow-ups must have parent
ALTER TABLE appointments
  ADD CONSTRAINT followup_has_parent
  CHECK (
    (consultation_type != 'followUp') OR
    (consultation_type = 'followUp' AND parent_appointment_id IS NOT NULL)
  );

-- Update documents table to be appointment-specific
-- Remove user_id since user can be derived through appointment
ALTER TABLE documents
  ADD COLUMN appointment_id UUID REFERENCES appointments(id) ON DELETE CASCADE,
  ADD COLUMN uploaded_by VARCHAR(20) DEFAULT 'client',
  ADD COLUMN description TEXT;

-- Drop user_id column (user is accessible through appointment → user_id)
ALTER TABLE documents DROP COLUMN user_id;

-- Note: appointment_id allows NULL for this migration, but new documents
-- should always have an appointment_id in the application layer

-- Add index for better query performance (skip if already exists)
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_judge_id ON appointments(assigned_judge_id);
CREATE INDEX IF NOT EXISTS idx_appointments_parent_id ON appointments(parent_appointment_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_documents_appointment_id ON documents(appointment_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Create view for judge dashboard - all appointments with client info
CREATE OR REPLACE VIEW judge_appointments_view AS
SELECT
  a.*,
  u.first_name as client_first_name,
  u.last_name as client_last_name,
  u.email as client_email,
  u.phone as client_phone,
  parent.title as parent_appointment_title,
  parent.start_time as parent_appointment_date,
  (SELECT COUNT(*) FROM documents WHERE appointment_id = a.id) as document_count
FROM appointments a
JOIN users u ON a.user_id = u.id
LEFT JOIN appointments parent ON a.parent_appointment_id = parent.id
ORDER BY a.start_time DESC;

-- Create view for client appointments - their own appointments with document count
CREATE OR REPLACE VIEW client_appointments_view AS
SELECT
  a.id,
  a.title,
  a.description,
  a.start_time,
  a.end_time,
  a.status,
  a.consultation_type,
  a.client_notes,
  a.judge_notes,
  a.parent_appointment_id,
  (SELECT COUNT(*) FROM documents WHERE appointment_id = a.id) as document_count,
  parent.title as parent_appointment_title
FROM appointments a
LEFT JOIN appointments parent ON a.parent_appointment_id = parent.id;

-- Function to auto-assign judge to new appointments
CREATE OR REPLACE FUNCTION assign_judge_to_appointment()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-assign to the first available judge (or specific judge)
  IF NEW.assigned_judge_id IS NULL THEN
    NEW.assigned_judge_id := (
      SELECT id FROM users
      WHERE role = 'judge' AND is_accepting_bookings = true
      LIMIT 1
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_assign_judge
  BEFORE INSERT ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION assign_judge_to_appointment();

-- Function to validate follow-up appointments have completed parent
CREATE OR REPLACE FUNCTION validate_followup_parent()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.consultation_type = 'followUp' THEN
    IF NOT EXISTS (
      SELECT 1 FROM appointments
      WHERE id = NEW.parent_appointment_id
      AND user_id = NEW.user_id
      AND status = 'completed'
    ) THEN
      RAISE EXCEPTION 'Follow-up appointments require a completed initial consultation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_followup
  BEFORE INSERT OR UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION validate_followup_parent();

COMMENT ON COLUMN appointments.assigned_judge_id IS 'The judge assigned to this appointment (future-proof for multiple judges)';
COMMENT ON COLUMN appointments.parent_appointment_id IS 'Links follow-up appointments to their initial consultation';
COMMENT ON COLUMN appointments.consultation_type IS 'Type of consultation: initial, followUp, standard, premium, documentReview';
COMMENT ON COLUMN appointments.client_notes IS 'Notes/questions from the client before the session';
COMMENT ON COLUMN appointments.judge_notes IS 'Shared notes visible to both judge and client (session summary, recommendations)';
COMMENT ON COLUMN appointments.internal_notes IS 'Private notes visible only to the judge';
COMMENT ON COLUMN users.role IS 'User role: client or judge';
COMMENT ON COLUMN documents.appointment_id IS 'The appointment this document belongs to';
COMMENT ON COLUMN documents.uploaded_by IS 'Who uploaded this document: client or judge';
