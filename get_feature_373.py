#!/usr/bin/env python3
import sqlite3
import json

# Connect to the database
conn = sqlite3.connect('assistant.db')
cursor = conn.cursor()

# Query for feature 373
cursor.execute("""
    SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
    FROM features
    WHERE id = 373
""")

row = cursor.fetchone()
if row:
    feature = {
        'id': row[0],
        'priority': row[1],
        'category': row[2],
        'name': row[3],
        'description': row[4],
        'steps': row[5],
        'passes': bool(row[6]),
        'in_progress': bool(row[7]),
        'dependencies': row[8]
    }
    print(json.dumps(feature, indent=2))
else:
    print("Feature 373 not found")

conn.close()
