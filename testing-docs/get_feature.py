import requests
import json

# The feature is accessed via MCP server
# Let me try to read from the MCP resources

# First, let's check if there's a features.db file
import os
for root, dirs, files in os.walk('.', topdown=True):
    dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.playwright-mcp']]
    for file in files:
        if 'feature' in file.lower() and ('.db' in file or '.sqlite' in file or '.json' in file):
            print(f"Found: {os.path.join(root, file)}")
