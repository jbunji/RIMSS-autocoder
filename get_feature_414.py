import sqlite3
import json

conn = sqlite3.connect('features.db')
cursor = conn.cursor()

cursor.execute('''
    SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
    FROM features
    WHERE id = 414
''')

row = cursor.fetchone()
if row:
    feature = {
        "id": row[0],
        "priority": row[1],
        "category": row[2],
        "name": row[3],
        "description": row[4],
        "steps": json.loads(row[5]) if row[5] else [],
        "passes": bool(row[6]),
        "in_progress": bool(row[7]),
        "dependencies": json.loads(row[8]) if row[8] else []
    }
    print(json.dumps(feature, indent=2))
else:
    print("Feature not found")

conn.close()
