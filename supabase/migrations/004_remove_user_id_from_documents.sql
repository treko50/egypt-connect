-- Migration 004: Remove redundant user_id from documents table
-- Documents should only link to appointments, not directly to users
-- User can be accessed through: documents → appointment_id → appointments → user_id

-- Drop the user_id column from documents
ALTER TABLE documents DROP COLUMN IF EXISTS user_id;

-- Add comment explaining the relationship
COMMENT ON COLUMN documents.appointment_id IS 'Links document to appointment. User is accessible via appointments.user_id';
