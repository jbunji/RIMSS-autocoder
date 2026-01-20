import sqlite3

conn = sqlite3.connect('features.db')
cursor = conn.cursor()

# Get stats
cursor.execute('SELECT COUNT(*) FROM features WHERE passes = 1')
passing = cursor.fetchone()[0]

cursor.execute('SELECT COUNT(*) FROM features')
total = cursor.fetchone()[0]

cursor.execute('SELECT COUNT(*) FROM features WHERE in_progress = 1')
in_progress = cursor.fetchone()[0]

print(f'Passing: {passing}')
print(f'Total: {total}')
print(f'In Progress: {in_progress}')
print(f'Percentage: {(passing/total)*100:.1f}%')

# Get a random passing feature for regression testing
cursor.execute('''
    SELECT id, category, name, description, steps
    FROM features
    WHERE passes = 1 AND in_progress = 0
    ORDER BY RANDOM()
    LIMIT 1
''')

feature = cursor.fetchone()
if feature:
    print(f'\nRandom passing feature for testing:')
    print(f'ID: {feature[0]}')
    print(f'Category: {feature[1]}')
    print(f'Name: {feature[2]}')
    print(f'Description: {feature[3]}')
    print(f'Steps: {feature[4]}')
else:
    print('\nNo passing features available for testing')

conn.close()
