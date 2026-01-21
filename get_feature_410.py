import sqlite3
conn = sqlite3.connect('features.db')
cursor = conn.cursor()
cursor.execute('SELECT id, category, name, description, steps, passes, in_progress, dependencies FROM features WHERE id = 410')
feature = cursor.fetchone()
if feature:
    print(f"Feature #{feature[0]}")
    print(f"Category: {feature[1]}")
    print(f"Name: {feature[2]}")
    print(f"Description: {feature[3]}")
    print(f"Steps: {feature[4]}")
    print(f"Passes: {feature[5]}")
    print(f"In Progress: {feature[6]}")
    print(f"Dependencies: {feature[7]}")
else:
    print("Feature not found")
conn.close()
