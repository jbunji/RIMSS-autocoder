import sqlite3
import json

conn = sqlite3.connect('features.db')
cursor = conn.cursor()

cursor.execute('SELECT * FROM features WHERE id = 405')
row = cursor.fetchone()

if row:
    columns = [description[0] for description in cursor.description]
    feature = dict(zip(columns, row))
    print(json.dumps(feature, indent=2))
else:
    print("Feature 405 not found")

conn.close()
