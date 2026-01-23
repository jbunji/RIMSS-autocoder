#!/usr/bin/env python3
import json
import urllib.request

# Login
login_data = json.dumps({"username": "admin", "password": "admin123"}).encode()
login_req = urllib.request.Request(
    "http://localhost:3001/api/auth/login",
    data=login_data,
    headers={"Content-Type": "application/json"}
)
with urllib.request.urlopen(login_req) as resp:
    login_result = json.load(resp)
    token = login_result["token"]

# Get configurations
config_req = urllib.request.Request(
    "http://localhost:3001/api/configurations?program_id=1&limit=200",
    headers={"Authorization": f"Bearer {token}"}
)
with urllib.request.urlopen(config_req) as resp:
    config_data = json.load(resp)

# Count system types
types = {}
for config in config_data["configurations"]:
    sys_type = config.get("sys_type") or "null"
    types[sys_type] = types.get(sys_type, 0) + 1

print("System types in CRIIS configurations:")
for t, count in sorted(types.items(), key=lambda x: -x[1]):
    print(f"  {t}: {count}")
print(f"\nTotal: {len(config_data['configurations'])} configurations")
