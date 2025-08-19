//SnapshotUpdater.gs
// This file contains the automated trigger function to update the Inventory Snapshot sheet.

// These constants are now expected to be defined ONCE in Global.gs
// and are globally accessible here. DO NOT DECLARE THEM HERE if they are in Global.gs.
// const SPREADSHEET_ID = "1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g";
// const logSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Inventory Log");
// const snapshotSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Inventory Snapshot");


/**
 * Main function to update the Inventory Snapshot sheet.
 * It can process a batch of new entries directly, or if called without arguments,
 * it processes the latest entry in the Inventory Log.
 * @param {Array<Array>} [latestEntries] An optional array of new log entries (rows) to process.
 * If not provided, the function reads the last row from Inventory Log.
 */
function updateInventorySnapshot(latestEntries) { // Now accepts an argument
  Logger.log('--- updateInventorySnapshot Started ---');

  let entriesToProcess = [];

  if (latestEntries && Array.isArray(latestEntries) && latestEntries.length > 0) {
    // If a batch of entries is provided, process them directly.
    entriesToProcess = latestEntries;
    Logger.log(`Processing ${entriesToProcess.length} entries passed directly.`);
  } else {
    // Fallback: If no entries provided (e.g., called from Admin.gs or a manual trigger),
    // process only the very last row added to the Inventory Log.
    const lastRow = logSheet.getLastRow();
    if (lastRow < 2) { 
      Logger.log("SNAPSHOT_WARNING: No new log entries to process (logSheet empty or only headers).");
      return; 
    }
    entriesToProcess.push(logSheet.getRange(lastRow, 1, 1, 9).getValues()[0]);
    Logger.log("Processing single latest entry from Inventory Log (no batch provided).");
  }

  try {
    // Pre-fetch all current snapshot data for efficient updates
    const snapshotValues = snapshotSheet.getDataRange().getValues();
    const snapshotHeaders = snapshotValues.shift(); // Remove headers
    const snapshotMap = new Map(); // Map to store current stock for quick lookups
    const pendingUpdates = new Map(); // Map to store changes before writing back

    // Populate snapshotMap with existing data for quick lookups and updates
    snapshotValues.forEach((row, index) => {
        // Assuming Column A (index 0) is Snapshot ID (SKU|Location), Column D (index 3) is Current Stock
        if (row[0] && row[3] !== undefined) {
            snapshotMap.set(row[0], {
                sku: row[1],
                location: row[2],
                stock: parseInt(row[3], 10) || 0,
                rowIndex: index + 2 // Actual 1-based sheet row index (original index + 1 for 0-based to 1-based, +1 for header row removed)
            });
        }
    });
    Logger.log(`Loaded ${snapshotMap.size} entries from Inventory Snapshot.`);


    for (const newLogEntry of entriesToProcess) {
      const [transId, ts, sku, qty, mode, source, destination, user, notes] = newLogEntry;
      const quantity = parseInt(qty, 10);

      Logger.log(`Processing log entry: SKU: ${sku}, Mode: ${mode}, Qty: ${quantity}, Source: ${source}, Dest: ${destination}`);

      // Helper function to apply changes to the pendingUpdates map
      const applyChange = (targetSku, targetLocation, change) => {
          if (!targetSku || !targetLocation) return;

          const currentSnapshotId = `${targetSku}|${targetLocation}`;
          let currentStock = snapshotMap.has(currentSnapshotId) ? snapshotMap.get(currentSnapshotId).stock : 0;
          let newStock = currentStock + change;
          
          // Store the update in pendingUpdates, consolidating multiple changes for the same SKU/Location
          if (pendingUpdates.has(currentSnapshotId)) {
              newStock = pendingUpdates.get(currentSnapshotId).stock + change;
          }
          pendingUpdates.set(currentSnapshotId, {
              sku: targetSku,
              location: targetLocation,
              stock: newStock,
              rowIndex: snapshotMap.has(currentSnapshotId) ? snapshotMap.get(currentSnapshotId).rowIndex : -1 // -1 indicates new row
          });
      };

      // Based on the mode, update the source and/or destination location's stock
      if (mode === 'SALE' || mode === 'TRANSFER' || mode === 'ADJUSTMENT') {
        if (source && source !== 'Supplier' && source !== 'Count Adjustment') {
          applyChange(sku, source, -quantity); // Decrease stock
          Logger.log(`Decreasing stock for ${sku} at ${source} by ${quantity}.`);
        }
      }

      if (mode === 'RECEIVING' || mode === 'TRANSFER' || mode === 'ADJUSTMENT') {
        if (destination && destination !== 'Customer' && destination !== 'Wastage/Missing') {
          applyChange(sku, destination, quantity); // Increase stock
          Logger.log(`Increasing stock for ${sku} at ${destination} by ${quantity}.`);
        }
      }
    } // End of for loop for entriesToProcess

    // --- Apply all pending updates to the Snapshot Sheet ---
    const rowsToAppendToSnapshot = [];
    for (const [snapshotId, data] of pendingUpdates.entries()) {
        const targetRowIndex = data.rowIndex;
        if (targetRowIndex !== -1) {
            // Update existing row in place using specific cell writes
            snapshotSheet.getRange(targetRowIndex, 4).setValue(data.stock); // Column D for Current Stock
            snapshotSheet.getRange(targetRowIndex, 5).setValue(new Date()); // Column E for Last Updated
            Logger.log(`Updated existing snapshot for ${snapshotId}. New stock: ${data.stock}`);
        } else {
            // Collect new rows to append
            rowsToAppendToSnapshot.push([snapshotId, data.sku, data.location, data.stock, new Date()]);
            Logger.log(`Preparing new snapshot row for ${snapshotId}. Stock: ${data.stock}`);
        }
    }

    if (rowsToAppendToSnapshot.length > 0) {
        // Use batch append for new snapshot entries
        // Ensure this is correct for your custom utility or switch to loop if issues persist
        // If snapshotSheet.appendRows is NOT a custom utility, use:
        rowsToAppendToSnapshot.forEach(row => snapshotSheet.appendRow(row));
        Logger.log(`Appended ${rowsToAppendToSnapshot.length} new rows to Inventory Snapshot.`);
    }
    Logger.log('Inventory Snapshot update complete.');
    
  } catch (err) {
    // Log errors to the spreadsheet itself for easy debugging
    const errorRow = logSheet.getLastRow() || 1; // Fallback to row 1 if logSheet is empty
    logSheet.getRange(errorRow, 10).setValue("SNAPSHOT_ERROR: " + err.message + " at " + new Date());
    Logger.log("SNAPSHOT_ERROR: " + err.message + " Stack: " + err.stack); // Also log to Apps Script console with stack
  } finally {
      Logger.log('--- updateInventorySnapshot Finished ---');
  }
}

// Optional: You can keep a trigger creation function if you still want
// the 'on change' trigger to exist for manual edits, but it won't be
// the sole mechanism for script-driven updates.
function createOnChangeTrigger() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('updateInventorySnapshot')
      .forSpreadsheet(spreadsheet)
      .onChange()
      .create();
  Logger.log('On Change trigger created for updateInventorySnapshot.');
}
