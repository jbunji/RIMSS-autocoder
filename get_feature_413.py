import sqlite3

conn = sqlite3.connect('features.db')
cursor = conn.cursor()

cursor.execute("""
SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
FROM features 
WHERE id = 413
""")

feature = cursor.fetchone()
if feature:
    print("Feature #413:")
    print(f"  Priority: {feature[1]}")
    print(f"  Category: {feature[2]}")
    print(f"  Name: {feature[3]}")
    print(f"  Description: {feature[4]}")
    print(f"  Steps: {feature[5]}")
    print(f"  Passes: {feature[6]}")
    print(f"  In Progress: {feature[7]}")
    print(f"  Dependencies: {feature[8]}")
else:
    print("Feature #413 not found")

conn.close()
