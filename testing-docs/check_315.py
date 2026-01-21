import sqlite3
import json

conn = sqlite3.connect('features.db')
cursor = conn.cursor()

cursor.execute('SELECT * FROM features WHERE id = 315')
row = cursor.fetchone()

cursor.execute('PRAGMA table_info(features)')
cols = [col[1] for col in cursor.fetchall()]

if row:
    feature = dict(zip(cols, row))
    print(json.dumps(feature, indent=2))
else:
    print("Feature #315 not found")

conn.close()
