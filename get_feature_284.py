#!/usr/bin/env python3
import sqlite3
import json

# Connect to features database
conn = sqlite3.connect('features.db')
cursor = conn.cursor()

# Get feature #284
cursor.execute("""
    SELECT id, priority, category, name, description, steps, passes, in_progress
    FROM features
    WHERE id = 284
""")

row = cursor.fetchone()

if row:
    feature = {
        'id': row[0],
        'priority': row[1],
        'category': row[2],
        'name': row[3],
        'description': row[4],
        'steps': json.loads(row[5]) if row[5] else [],
        'passes': bool(row[6]),
        'in_progress': bool(row[7])
    }

    print(json.dumps(feature, indent=2))
else:
    print("Feature #284 not found")

conn.close()
