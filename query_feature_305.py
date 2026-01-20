#!/usr/bin/env python3
import sqlite3
import json
import os

# Try multiple possible locations
db_paths = [
    '/Users/justinbundrick/Documents/ClaudeProjects/autocoder-master/features.db',
    '/Users/justinbundrick/Documents/ClaudeProjects/autocoder-master/mcp_server/features.db',
    'features.db',
    '../autocoder-master/features.db'
]

for db_path in db_paths:
    if os.path.exists(db_path):
        print(f"Found database at: {db_path}")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM features WHERE id = 305")
        row = cursor.fetchone()

        if row:
            cursor.execute("PRAGMA table_info(features)")
            columns = [col[1] for col in cursor.fetchall()]

            feature = dict(zip(columns, row))
            print(json.dumps(feature, indent=2))
        else:
            print("Feature 305 not found")

        conn.close()
        break
else:
    print("Database not found in any expected location")
    print("Searched:")
    for path in db_paths:
        print(f"  - {path}")
