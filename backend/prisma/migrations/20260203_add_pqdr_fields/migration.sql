-- Add PQDR tracking fields to labor_part table
-- These fields support the legacy RIMSS part removal workflow

ALTER TABLE labor_part ADD COLUMN IF NOT EXISTS how_mal VARCHAR(10);
ALTER TABLE labor_part ADD COLUMN IF NOT EXISTS is_pqdr BOOLEAN DEFAULT false;
ALTER TABLE labor_part ADD COLUMN IF NOT EXISTS dr_num VARCHAR(50);

COMMENT ON COLUMN labor_part.how_mal IS 'How malfunctioned code from repair';
COMMENT ON COLUMN labor_part.is_pqdr IS 'Product Quality Deficiency Report flag';
COMMENT ON COLUMN labor_part.dr_num IS 'Deficiency Report number';
