import sqlite3

conn = sqlite3.connect('backend/prisma/dev.db')
cursor = conn.cursor()

# Get all tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
tables = cursor.fetchall()

print("All tables in database:")
print("-" * 60)
for table in tables:
    print(f"  - {table[0]}")

# Look for tables related to location
print("\nLocation-related tables:")
print("-" * 60)
for table in tables:
    if 'location' in table[0].lower() or 'loc' in table[0].lower():
        print(f"\nTable: {table[0]}")
        cursor.execute(f"PRAGMA table_info({table[0]})")
        columns = cursor.fetchall()
        for col in columns:
            print(f"  - {col[1]} ({col[2]})")

conn.close()
