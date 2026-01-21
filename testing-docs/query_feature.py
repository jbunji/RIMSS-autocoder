#!/usr/bin/env python3
import sqlite3
import json

conn = sqlite3.connect('assistant.db')
cursor = conn.cursor()

# Get feature 308
cursor.execute('SELECT id, category, name, description, steps, passes, in_progress, dependencies FROM features WHERE id = ?', (308,))
row = cursor.fetchone()

if row:
    feature = {
        'id': row[0],
        'category': row[1],
        'name': row[2],
        'description': row[3],
        'steps': json.loads(row[4]) if row[4] else [],
        'passes': bool(row[5]),
        'in_progress': bool(row[6]),
        'dependencies': json.loads(row[7]) if row[7] else []
    }
    print(json.dumps(feature, indent=2))
else:
    print("Feature #308 not found")

conn.close()
