import re

# Read the file
with open('frontend/src/pages/DashboardPage.tsx', 'r') as f:
    content = f.read()

# Replace spinner loading states with skeletons

# 1. Asset Status Pie Chart Widget
content = re.sub(
    r'(\{/\* Asset Status Pie Chart Widget \*/\}<div className="bg-white shadow rounded-lg p-4 sm:p-6">\s*<h3 className="text-sm font-medium text-gray-500 mb-4">Asset Status Distribution</h3>\s*)\{loading \? \(\s*<div className="flex items-center justify-center py-8">\s*<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>\s*</div>\s*\) : error \? \(',
    r'\1{loading ? (\n            <SkeletonDashboardWidget size="medium" title="Asset Status Distribution" />\n          ) : error ? (',
    content,
    flags=re.DOTALL
)

# 2. PMI Due Soon Widget - use SkeletonList
content = re.sub(
    r'(\{pmiLoading \? \(\s*<div className="flex items-center justify-center py-8">\s*<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>\s*</div>\s*\) : pmiError \? \()',
    r'{pmiLoading ? (\n            <SkeletonList items={5} showIcon={true} className="max-h-80" />\n          ) : pmiError ? (',
    content,
    flags=re.DOTALL
)

# 3. PMI Calendar Heat Map Widget
content = re.sub(
    r'(\{pmiLoading \? \(\s*<div className="flex items-center justify-center py-8">\s*<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>\s*</div>\s*\) : pmiError \? \()',
    r'{pmiLoading ? (\n            <SkeletonDashboardWidget size="large" title="PMI Due Calendar - 90 Day View" />\n          ) : pmiError ? (',
    content,
    flags=re.DOTALL
)

# 4. Open Maintenance Jobs Widget
content = re.sub(
    r'(\{maintenanceLoading \? \(\s*<div className="flex items-center justify-center py-8">\s*<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>\s*</div>\s*\) : maintenanceError \? \()',
    r'{maintenanceLoading ? (\n            <SkeletonList items={5} showIcon={true} className="max-h-80" />\n          ) : maintenanceError ? (',
    content,
    flags=re.DOTALL
)

# Write the file
with open('frontend/src/pages/DashboardPage.tsx', 'w') as f:
    f.write(content)

print("Updated DashboardPage.tsx with skeleton loaders")
