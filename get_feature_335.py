import sqlite3
import json

conn = sqlite3.connect('assistant.db')
cursor = conn.cursor()
cursor.execute('SELECT id, category, name, description, steps, passes, in_progress FROM features WHERE id = 335')
row = cursor.fetchone()

if row:
    feature = {
        'id': row[0],
        'category': row[1],
        'name': row[2],
        'description': row[3],
        'steps': row[4],
        'passes': row[5],
        'in_progress': row[6]
    }
    print(json.dumps(feature, indent=2))
else:
    print("Feature 335 not found")

conn.close()
