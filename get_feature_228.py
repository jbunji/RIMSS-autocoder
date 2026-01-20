import sqlite3
import json

conn = sqlite3.connect('features.db')
cursor = conn.cursor()

cursor.execute('SELECT * FROM features WHERE id = 228')
row = cursor.fetchone()

if row:
    columns = [description[0] for description in cursor.description]
    result = dict(zip(columns, row))
    print(json.dumps(result, indent=2))
else:
    print("Feature #228 not found")

conn.close()
