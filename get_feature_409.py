import sqlite3
import json

conn = sqlite3.connect('features.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("""
    SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
    FROM features 
    WHERE id = 409
""")

feature = cursor.fetchone()
if feature:
    result = {
        'id': feature['id'],
        'priority': feature['priority'],
        'category': feature['category'],
        'name': feature['name'],
        'description': feature['description'],
        'steps': json.loads(feature['steps']),
        'passes': bool(feature['passes']),
        'in_progress': bool(feature['in_progress']),
        'dependencies': json.loads(feature['dependencies']) if feature['dependencies'] else []
    }
    print(json.dumps(result, indent=2))
else:
    print("Feature not found")

conn.close()
