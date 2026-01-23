const asset = {
  serialNumber: "SN-HISTORY-TEST-" + Date.now(),
  partNumber: "PN-HISTORY-TEST-001",
  name: "History Test Asset",
  status: "FMC",
  assignedLocationId: 1329,
  currentLocationId: 1427,
  programId: 1,
  remarks: "Test asset for history feature verification"
};

console.log(JSON.stringify(asset, null, 2));
