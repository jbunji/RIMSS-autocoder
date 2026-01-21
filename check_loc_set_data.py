import sqlite3
import json

# Connect to the database
conn = sqlite3.connect('backend/prisma/dev.db')
cursor = conn.cursor()

# Check if loc_set table exists
cursor.execute("""
    SELECT name FROM sqlite_master 
    WHERE type='table' AND name='loc_set'
""")
table_exists = cursor.fetchone()
print(f"LOC_SET table exists: {bool(table_exists)}")

if table_exists:
    # Count records in loc_set
    cursor.execute("SELECT COUNT(*) FROM loc_set")
    count = cursor.fetchone()[0]
    print(f"\nTotal LOC_SET records: {count}")
    
    # Get all loc_set records grouped by set_name
    cursor.execute("""
        SELECT ls.set_name, p.pgm_cd, l.loc_cd, l.loc_name, ls.set_id
        FROM loc_set ls
        LEFT JOIN program p ON ls.pgm_id = p.pgm_id
        LEFT JOIN location l ON ls.loc_id = l.loc_id
        ORDER BY ls.set_name, p.pgm_cd
    """)
    records = cursor.fetchall()
    
    if records:
        print("\nExisting LOC_SET records:")
        current_set = None
        for row in records:
            set_name, pgm_cd, loc_cd, loc_name, set_id = row
            if set_name != current_set:
                print(f"\n{set_name}:")
                current_set = set_name
            print(f"  - {pgm_cd}: {loc_cd} ({loc_name}) [set_id: {set_id}]")
    else:
        print("\nNo LOC_SET records found - table is empty")
        
    # Check programs
    cursor.execute("SELECT pgm_id, pgm_cd, pgm_name FROM program ORDER BY pgm_cd")
    programs = cursor.fetchall()
    print(f"\nAvailable programs ({len(programs)}):")
    for pgm in programs:
        print(f"  - {pgm[1]}: {pgm[2]} (pgm_id: {pgm[0]})")

conn.close()
