-- Shipment Table
-- ==============

CREATE TABLE IF NOT EXISTS shipment (
    shipment_id SERIAL PRIMARY KEY,
    tcn VARCHAR(50) UNIQUE NOT NULL,
    from_loc_id INTEGER NOT NULL REFERENCES location(loc_id),
    to_loc_id INTEGER NOT NULL REFERENCES location(loc_id),
    shipper VARCHAR(100),
    ship_date TIMESTAMP NOT NULL,
    expected_date TIMESTAMP,
    recv_date TIMESTAMP,
    asset_count INTEGER DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_TRANSIT',
    remarks TEXT,
    ins_by VARCHAR(50),
    ins_date TIMESTAMP NOT NULL DEFAULT NOW(),
    chg_by VARCHAR(50),
    chg_date TIMESTAMP
);

CREATE INDEX idx_shipment_from ON shipment(from_loc_id);
CREATE INDEX idx_shipment_to ON shipment(to_loc_id);
CREATE INDEX idx_shipment_status ON shipment(status);
