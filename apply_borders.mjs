import fs from 'fs';

let content = fs.readFileSync('frontend/src/pages/DashboardPage.tsx', 'utf-8');

// Asset Status Summary Widget
const oldAsset = '<div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow rounded-lg p-4 sm:p-6 border border-blue-100">';
const newAsset = '<div className={`bg-gradient-to-br from-blue-50 via-white to-blue-50 shadow rounded-lg p-4 sm:p-6 border border-blue-100 ${getAssetStatusWidgetBorderColor(assetStatus)}`}>';
content = content.replace(oldAsset, newAsset);

// PMI Due Soon Widget
const oldPMI = '<div className="bg-gradient-to-br from-red-50 via-white to-yellow-50 shadow rounded-lg p-4 sm:p-6 border border-red-100">';
const newPMI = '<div className={`bg-gradient-to-br from-red-50 via-white to-yellow-50 shadow rounded-lg p-4 sm:p-6 border border-red-100 ${getPMIWidgetBorderColor(pmiData)}`}>';
content = content.replace(oldPMI, newPMI);

// Open Maintenance Jobs Widget - need regex for specific match
content = content.replace(
  /({\/\* Open Maintenance Jobs Widget \*\/}\s*)<div className="bg-white shadow rounded-lg p-4 sm:p-6">/,
  `$1<div className={\`bg-white shadow rounded-lg p-4 sm:p-6 \${getMaintenanceWidgetBorderColor(maintenanceData)}\`}>`
);

// Parts Awaiting Action Widget
content = content.replace(
  /({\/\* Parts Awaiting Action Widget \*\/}\s*)<div className="bg-white shadow rounded-lg p-4 sm:p-6">/,
  `$1<div className={\`bg-white shadow rounded-lg p-4 sm:p-6 \${getPartsWidgetBorderColor(partsData)}\`}>`
);

fs.writeFileSync('frontend/src/pages/DashboardPage.tsx', content);
console.log('Applied colored left borders to widget cards');
