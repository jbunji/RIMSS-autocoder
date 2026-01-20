import sqlite3
import json

# Try both database files
for db_name in ['features.db', 'assistant.db']:
    try:
        conn = sqlite3.connect(db_name)
        cursor = conn.cursor()

        cursor.execute('SELECT * FROM features WHERE id = 244')
        row = cursor.fetchone()

        if row:
            columns = [description[0] for description in cursor.description]
            result = dict(zip(columns, row))
            print(f"Found in {db_name}:")
            print(json.dumps(result, indent=2))
            conn.close()
            break

        conn.close()
    except Exception as e:
        print(f"Error with {db_name}: {e}")
        continue
else:
    print("Feature #244 not found in any database")
