#!/usr/bin/env python3
import sqlite3
import json

db = sqlite3.connect('./assistant.db')
cursor = db.cursor()

cursor.execute('SELECT id, category, name, description, steps, passes, in_progress, dependencies FROM features WHERE id = 279')
row = cursor.fetchone()

if row:
    print(f"Feature #{row[0]}:")
    print(f"Category: {row[1]}")
    print(f"Name: {row[2]}")
    print(f"Description: {row[3]}")
    print(f"Steps: {row[4]}")
    print(f"Passes: {row[5]}")
    print(f"In Progress: {row[6]}")
    print(f"Dependencies: {row[7]}")
else:
    print("Feature #279 not found")

db.close()
