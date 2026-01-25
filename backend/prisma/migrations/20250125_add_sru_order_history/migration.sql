-- Migration: Add sru_order_history table for parts order audit trail
-- This table tracks all status changes and actions on parts orders

CREATE TABLE IF NOT EXISTS sru_order_history (
  history_id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES sru_order(order_id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  user_id INTEGER NOT NULL,
  username VARCHAR(50) NOT NULL,
  user_full_name VARCHAR(100) NOT NULL,
  action_type VARCHAR(20) NOT NULL CHECK (action_type IN ('create', 'request', 'acknowledge', 'fill', 'deliver', 'cancel', 'pqdr_flag')),
  status VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  ins_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on order_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_sru_order_history_order_id ON sru_order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_sru_order_history_timestamp ON sru_order_history(timestamp DESC);

-- Add comment
COMMENT ON TABLE sru_order_history IS 'Audit trail for SRU/parts order status changes and actions';
COMMENT ON COLUMN sru_order_history.metadata IS 'Additional context data (shipper, tracking, etc.) stored as JSON';
