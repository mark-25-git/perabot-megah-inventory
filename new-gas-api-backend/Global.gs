// Global.gs
// This file contains global constants accessible across the entire project.

const SPREADSHEET_ID = "1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g";

// Centralized Sheet Object Declarations
const logSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Inventory Log");
const snapshotSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Inventory Snapshot");
const productSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Product Master");

// Global variable for caching product SKUs to avoid repeated sheet reads
let cachedProductSkus = null;
