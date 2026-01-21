import sqlite3
import json

conn = sqlite3.connect('backend/prisma/dev.db')
cursor = conn.cursor()

# Get all location sets
cursor.execute("SELECT location_set_id, location_set_name FROM location_set ORDER BY location_set_id")
sets = cursor.fetchall()

print("Location Sets in Database:")
print("-" * 60)
for set_id, set_name in sets:
    print(f"ID: {set_id:3d} | Name: {set_name}")

print("\n" + "=" * 60)

# Get programs for reference
cursor.execute("SELECT program_id, program FROM program ORDER BY program_id")
programs = cursor.fetchall()

print("\nPrograms in Database:")
print("-" * 60)
for prog_id, prog_name in programs:
    print(f"ID: {prog_id} | Name: {prog_name}")

conn.close()
