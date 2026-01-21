#!/usr/bin/env python3
import sqlite3
import json
import os

# The feature database is in the autocoder-master project directory
db_path = "/Users/justinbundrick/Documents/ClaudeProjects/autocoder-master/projects/RIMSS-autocoder/features.db"

# Also try the project directory
alt_db_path = os.path.join(os.getcwd(), "features.db")

# Try both paths
for path in [db_path, alt_db_path]:
    if os.path.exists(path):
        print(f"Found database at: {path}")
        conn = sqlite3.connect(path)
        cursor = conn.cursor()

        # Query feature #353
        cursor.execute("SELECT * FROM features WHERE id = 353")
        row = cursor.fetchone()

        if row:
            # Get column names
            cursor.execute("PRAGMA table_info(features)")
            columns = [col[1] for col in cursor.fetchall()]

            # Create dict
            feature = dict(zip(columns, row))
            print(json.dumps(feature, indent=2))
        else:
            print("Feature #353 not found")

        conn.close()
        break
else:
    print("Feature database not found")
    print(f"Tried: {db_path}")
    print(f"Tried: {alt_db_path}")
