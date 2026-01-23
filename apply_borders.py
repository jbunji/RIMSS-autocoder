#!/usr/bin/env python3
import re

with open('frontend/src/pages/DashboardPage.tsx', 'r') as f:
    content = f.read()

# Asset Status Summary Widget (line ~777)
old_asset = '<div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow rounded-lg p-4 sm:p-6 border border-blue-100">'
new_asset = '<div className={`bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow rounded-lg p-4 sm:p-6 border border-blue-100 ${getAssetStatusWidgetBorderColor(assetStatus)}`}>'
content = content.replace(old_asset, new_asset)

# PMI Due Soon Widget (line ~859)
old_pmi = '<div className="bg-gradient-to-br from-red-50 via-white to-yellow-50 shadow rounded-lg p-4 sm:p-6 border border-red-100">'
new_pmi = '<div className={`bg-gradient-to-br from-red-50 via-white to-yellow-50 shadow rounded-lg p-4 sm:p-6 border border-red-100 ${getPMIWidgetBorderColor(pmiData)}`}>'
content = content.replace(old_pmi, new_pmi)

# Open Maintenance Jobs Widget (line ~980)
old_maint = '<div className="bg-white shadow rounded-lg p-4 sm:p-6">'
new_maint = '<div className={`bg-white shadow rounded-lg p-4 sm:p-6 ${getMaintenanceWidgetBorderColor(maintenanceData)}`}>'
# Need to be more specific to avoid replacing other occurrences
content = re.sub(
    r'(\{/\* Open Maintenance Jobs Widget \*/\}\s*)<div className="bg-white shadow rounded-lg p-4 sm:p-6">',
    r'\1<div className={`bg-white shadow rounded-lg p-4 sm:p-6 ${getMaintenanceWidgetBorderColor(maintenanceData)}`}>',
    content
)

# Parts Awaiting Action Widget (line ~1075)
old_parts = '<div className="bg-white shadow rounded-lg p-4 sm:p-6">'
new_parts = '<div className={`bg-white shadow rounded-lg p-4 sm:p-6 ${getPartsWidgetBorderColor(partsData)}`}>'
# Need to be more specific
content = re.sub(
    r'(\{/\* Parts Awaiting Action Widget \*/\}\s*)<div className="bg-white shadow rounded-lg p-4 sm:p-6">',
    r'\1<div className={`bg-white shadow rounded-lg p-4 sm:p-6 ${getPartsWidgetBorderColor(partsData)}`}>',
    content
)

with open('frontend/src/pages/DashboardPage.tsx', 'w') as f:
    f.write(content)

print("Applied colored left borders to widget cards")
