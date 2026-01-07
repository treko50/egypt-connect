-- Migration 006: Add virtual meeting support and needs_follow_up status
-- This migration:
-- 1. Adds meeting_url and meeting_provider columns
-- 2. Extends status enum to include 'needs_follow_up'
-- 3. Adds indexes for better query performance

-- Add meeting columns
ALTER TABLE appointments
  ADD COLUMN meeting_url VARCHAR(500),
  ADD COLUMN meeting_provider VARCHAR(50) DEFAULT 'whereby';

-- Modify the status constraint to include needs_follow_up
-- First drop the existing check constraint
ALTER TABLE appointments
  DROP CONSTRAINT IF EXISTS appointments_status_check;

-- Recreate with new status
ALTER TABLE appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'needs_follow_up'));

-- Add index for cron job queries (find confirmed appointments past end_time)
CREATE INDEX IF NOT EXISTS idx_appointments_status_end_time
  ON appointments(status, end_time);

-- Add index for follow-up appointments
CREATE INDEX IF NOT EXISTS idx_appointments_needs_followup
  ON appointments(status)
  WHERE status = 'needs_follow_up';

-- Add comments
COMMENT ON COLUMN appointments.meeting_url IS 'Virtual meeting room URL (Whereby, Zoom, etc.)';
COMMENT ON COLUMN appointments.meeting_provider IS 'Virtual meeting provider: whereby, zoom, meet, etc.';
COMMENT ON COLUMN appointments.status IS 'Status: pending (awaiting confirmation), confirmed (meeting scheduled), cancelled, completed, needs_follow_up (judge marked for follow-up)';
