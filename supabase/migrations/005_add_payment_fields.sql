-- Migration 005: Add payment-related fields to appointments table

-- Add payment fields
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS payment_intent_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS amount_paid DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS currency VARCHAR(3) DEFAULT 'usd';

-- Create index on payment_intent_id for webhook lookups
CREATE INDEX IF NOT EXISTS idx_appointments_payment_intent_id ON appointments(payment_intent_id);

-- Add comments
COMMENT ON COLUMN appointments.payment_status IS 'Payment status: pending (awaiting payment), paid (payment successful), failed (payment failed), refunded (payment refunded)';
COMMENT ON COLUMN appointments.payment_intent_id IS 'Stripe PaymentIntent ID for tracking payments';
COMMENT ON COLUMN appointments.amount_paid IS 'Amount paid in the specified currency';
COMMENT ON COLUMN appointments.currency IS 'Currency code (USD, EGP, etc.)';
