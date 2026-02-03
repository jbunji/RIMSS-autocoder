-- Parts Ordering Tables
-- =====================

CREATE TABLE IF NOT EXISTS parts_order (
    order_id SERIAL PRIMARY KEY,
    order_no VARCHAR(50) UNIQUE NOT NULL,
    partno_id INTEGER NOT NULL REFERENCES part_list(partno_id),
    quantity INTEGER NOT NULL,
    quantity_received INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    priority VARCHAR(20) NOT NULL DEFAULT 'ROUTINE',
    
    -- Associations
    event_id INTEGER REFERENCES event(event_id),
    repair_id INTEGER REFERENCES repair(repair_id),
    loc_id INTEGER NOT NULL REFERENCES location(loc_id),
    substitute_partno_id INTEGER REFERENCES part_list(partno_id),
    
    -- Workflow tracking
    requested_by VARCHAR(50) NOT NULL,
    requested_date TIMESTAMP NOT NULL DEFAULT NOW(),
    approved_by VARCHAR(50),
    approved_date TIMESTAMP,
    ordered_by VARCHAR(50),
    ordered_date TIMESTAMP,
    received_by VARCHAR(50),
    received_date TIMESTAMP,
    issued_to VARCHAR(50),
    issued_by VARCHAR(50),
    issued_date TIMESTAMP,
    cancelled_by VARCHAR(50),
    cancelled_date TIMESTAMP,
    cancel_reason TEXT,
    
    -- Vendor info
    vendor_name VARCHAR(100),
    vendor_order_no VARCHAR(50),
    expected_date TIMESTAMP,
    unit_cost DECIMAL(12, 2),
    tcn VARCHAR(50),
    
    -- Metadata
    current_stock INTEGER,
    notes TEXT,
    ins_by VARCHAR(50),
    ins_date TIMESTAMP NOT NULL DEFAULT NOW(),
    chg_by VARCHAR(50),
    chg_date TIMESTAMP
);

CREATE INDEX idx_parts_order_loc_status ON parts_order(loc_id, status);
CREATE INDEX idx_parts_order_repair ON parts_order(repair_id);
CREATE INDEX idx_parts_order_partno ON parts_order(partno_id);

CREATE TABLE IF NOT EXISTS parts_order_history (
    history_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES parts_order(order_id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL,
    changed_by VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_parts_order_history_order ON parts_order_history(order_id);
