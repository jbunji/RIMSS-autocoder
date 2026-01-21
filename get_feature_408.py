import sqlite3
conn = sqlite3.connect('features.db')
cursor = conn.cursor()
cursor.execute('SELECT * FROM features WHERE id = 408')
feature = cursor.fetchone()
if feature:
    columns = [desc[0] for desc in cursor.description]
    for col, val in zip(columns, feature):
        print(f"{col}: {val}")
else:
    print("Feature #408 not found")
conn.close()
