import sqlite3

conn = sqlite3.connect('features.db')
cursor = conn.cursor()
cursor.execute('SELECT * FROM features WHERE id = 470')
row = cursor.fetchone()
if row:
    print(f"Feature ID: {row[0]}")
    print(f"Category: {row[1]}")
    print(f"Name: {row[2]}")
    print(f"Description: {row[3]}")
    print(f"Steps: {row[4]}")
    print(f"Passing: {row[5]}")
    print(f"In Progress: {row[6]}")
else:
    print("Feature 470 not found")
conn.close()
