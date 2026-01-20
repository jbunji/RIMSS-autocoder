#!/bin/bash
cat <<'EOSQL' | sqlite3 assistant.db
.mode json
SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = 360;
EOSQL
