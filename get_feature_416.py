import sqlite3

conn = sqlite3.connect('features.db')
cursor = conn.cursor()

cursor.execute("""
    SELECT id, priority, category, name, description, steps, passes, in_progress, dependencies
    FROM features 
    WHERE id = 416
""")

row = cursor.fetchone()
if row:
    feature_id, priority, category, name, description, steps, passes, in_progress, dependencies = row
    print(f"Feature #{feature_id}: {name}")
    print(f"Category: {category}")
    print(f"Priority: {priority}")
    print(f"Status: {'PASSING' if passes else 'PENDING'} | {'IN PROGRESS' if in_progress else 'NOT STARTED'}")
    print(f"Dependencies: {dependencies if dependencies else 'None'}")
    print(f"\nDescription:\n{description}")
    print(f"\nSteps:")
    import json
    steps_list = json.loads(steps)
    for i, step in enumerate(steps_list, 1):
        print(f"  {i}. {step}")
else:
    print("Feature #416 not found")

conn.close()
