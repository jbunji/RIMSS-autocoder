import sqlite3
import json

conn = sqlite3.connect('assistant.db')
cursor = conn.cursor()

cursor.execute("""
    SELECT id, category, name, description, steps, passes, in_progress, dependencies
    FROM features
    WHERE id = 317
""")

row = cursor.fetchone()
if row:
    print(f"Feature #{row[0]}")
    print(f"Category: {row[1]}")
    print(f"Name: {row[2]}")
    print(f"Description: {row[3]}")
    print(f"\nSteps:")
    steps = json.loads(row[4])
    for i, step in enumerate(steps, 1):
        print(f"  {i}. {step}")
    print(f"\nPasses: {row[5]}")
    print(f"In Progress: {row[6]}")
    print(f"Dependencies: {row[7]}")
else:
    print("Feature not found")

conn.close()
