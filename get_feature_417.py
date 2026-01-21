import sqlite3
import json

conn = sqlite3.connect('features.db')
cursor = conn.cursor()

cursor.execute('SELECT * FROM features WHERE id = 417')
row = cursor.fetchone()

if row:
    columns = [desc[0] for desc in cursor.description]
    feature = dict(zip(columns, row))
    
    # Parse JSON fields
    if feature.get('steps'):
        feature['steps'] = json.loads(feature['steps'])
    if feature.get('dependencies'):
        feature['dependencies'] = json.loads(feature['dependencies'])
    
    print(json.dumps(feature, indent=2))
else:
    print("Feature #417 not found")

conn.close()
