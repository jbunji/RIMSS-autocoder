import json

# Read the features database
with open('assistant.db', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Find feature 329
for feature in data.get('features', []):
    if feature.get('id') == 329:
        print(json.dumps(feature, indent=2))
        break
