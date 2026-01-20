import sqlite3
import json

conn = sqlite3.connect('assistant.db')
cursor = conn.cursor()
cursor.execute('SELECT id, priority, category, name, description, steps FROM features WHERE id = 306')
row = cursor.fetchone()

if row:
    print(f'ID: {row[0]}')
    print(f'Priority: {row[1]}')
    print(f'Category: {row[2]}')
    print(f'Name: {row[3]}')
    print(f'Description: {row[4]}')
    print(f'\nSteps:')
    steps = json.loads(row[5])
    for i, step in enumerate(steps, 1):
        print(f'  {i}. {step}')
else:
    print('Feature #306 not found')

conn.close()
