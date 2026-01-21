import sys
sys.path.insert(0, '/Users/justinbundrick/Documents/ClaudeProjects/autocoder-master')

from mcp_server.database import get_feature_by_id

feature = get_feature_by_id(257)
if feature:
    print(f"ID: {feature['id']}")
    print(f"Category: {feature['category']}")
    print(f"Name: {feature['name']}")
    print(f"Description: {feature['description']}")
    print(f"Steps: {feature['steps']}")
else:
    print("Feature not found")
