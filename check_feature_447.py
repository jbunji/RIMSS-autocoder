import sqlite3
conn = sqlite3.connect('features.db')
cursor = conn.cursor()
cursor.execute("SELECT id, name, description, steps, category, passes, in_progress FROM features WHERE id = 447")
row = cursor.fetchone()
if row:
    print(f"ID: {row[0]}")
    print(f"Name: {row[1]}")
    print(f"Description: {row[2]}")
    print(f"Steps: {row[3]}")
    print(f"Category: {row[4]}")
    print(f"Passes: {row[5]}")
    print(f"In Progress: {row[6]}")
else:
    print("Feature #447 not found")
conn.close()
