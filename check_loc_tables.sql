SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND (table_name = 'loc_set' OR table_name = 'program_location' OR table_name = 'location')
ORDER BY table_name, ordinal_position;
