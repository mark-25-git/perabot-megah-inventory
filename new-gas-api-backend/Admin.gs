// Admin.gs
// This file contains the backend logic for the Admin API.

/**
 * Checks if a given SKU exists in the Product Master sheet.
 */
function skuExists(sku) {
  const skus = getCachedProductSkus();
  return skus.includes(sku.trim().toUpperCase());
}

/**
 * Gets the current stock for an SKU at a specific location from the snapshot.
 */
function getCurrentStock(sku, location) {
  const snapshotData = snapshotSheet.getDataRange().getValues();
  const snapshotId = `${sku.trim().toUpperCase()}|${location}`;
  for (let i = 1; i < snapshotData.length; i++) {
    if (snapshotData[i][0] === snapshotId) {
      return parseInt(snapshotData[i][3], 10);
    }
  }
  return 0;
}

/**
 * Gets a list of all active SKUs for autocomplete suggestions.
 */
function getAllSkus() {
  const skus = getCachedProductSkus();
  return [...new Set(skus)];
}

/**
 * Processes actions from the Admin UI form, including single and bulk operations.
 */
function processAdminAction(data) {
  try {
    // const user = Session.getActiveUser().getEmail() || 'Unknown User';  //Use this when Google Group is available
    const user = 'WebApp User';
    const timestamp = new Date();

    // --- Handle Different Modes ---
    if (data.mode === 'transfer' || data.mode === 'receiving' || data.mode === 'adjustment') {
      // --- SINGLE ENTRY PROCESSING ---
      const sku = data.sku.trim().toUpperCase();
      if (!skuExists(sku)) {
        return { success: false, message: `Error: SKU "${sku}" does not exist.` };
      }
      
      let newRow;
      let successMessage;

      if (data.mode === 'transfer') {
        const quantity = parseInt(data.quantity, 10);
        const source = data.source;
        const availableStock = getCurrentStock(sku, source);
        if (availableStock < quantity) {
          return { success: false, message: `Error: Insufficient stock for transfer. Available: ${availableStock}, trying to transfer: ${quantity}.` };
        }
        newRow = [Utilities.getUuid(), timestamp, sku, quantity, 'TRANSFER', source, (source === 'Warehouse') ? 'Shop' : 'Warehouse', user, data.notes];
        successMessage = `Successfully logged transfer of ${quantity} of ${sku}.`;
      } else if (data.mode === 'receiving') {
        const quantity = parseInt(data.quantity, 10);
        newRow = [Utilities.getUuid(), timestamp, sku, quantity, 'RECEIVING', 'Supplier', data.destination, user, data.notes];
        successMessage = `Successfully logged receiving of ${quantity} of ${sku}.`;
      } else if (data.mode === 'adjustment') {
        const newQuantity = parseInt(data.newQuantity, 10);
        const currentQuantity = getCurrentStock(sku, data.location);
        const diff = newQuantity - currentQuantity;
        if (diff === 0) return { success: false, message: 'No change in quantity.' };
        const adjQuantity = Math.abs(diff);
        const source = (diff < 0) ? data.location : 'Count Adjustment';
        const destination = (diff > 0) ? data.location : 'Wastage/Missing';
        newRow = [Utilities.getUuid(), timestamp, sku, adjQuantity, 'ADJUSTMENT', source, destination, user, data.notes];
        successMessage = `Successfully logged adjustment for ${sku}.`;
      }
      
      logSheet.appendRow(newRow);
      updateInventorySnapshot([newRow]);
      return { success: true, message: successMessage };

    } else if (data.mode === 'bulk-sale') {
      // --- BULK SALE PROCESSING ---
      const sales = data.sales;
      const newLogRows = [];
      const errorMessages = [];

      for (const sale of sales) {
        const sku = sale.sku.trim().toUpperCase();
        const quantity = parseInt(sale.quantity, 10);

        if (!skuExists(sku)) {
          errorMessages.push(`SKU "${sale.sku}" not found.`);
          continue;
        }

        /*
        // --- Stock Validation (Temporarily Disabled) ---
        const availableStock = getCurrentStock(sku, 'Shop');
        if (availableStock < quantity) {
          errorMessages.push(`Insufficient stock for SKU "${sku}" (Available: ${availableStock}, Needed: ${quantity}).`);
          continue;
        }
        */

        newLogRows.push([Utilities.getUuid(), new Date(), sku, quantity, 'SALE', 'Shop', 'Customer', user, data.notes]);
      }

      if (newLogRows.length > 0) {
        const lastRow = logSheet.getLastRow();
        logSheet.getRange(lastRow + 1, 1, newLogRows.length, newLogRows[0].length).setValues(newLogRows);
        updateInventorySnapshot(newLogRows);
      }
      
      let message = `Successfully processed ${newLogRows.length} of ${sales.length} sale records.`;
      if (errorMessages.length > 0) {
        message += ` Errors: ${errorMessages.join('; ')}`;
      }
      return { success: true, message: message };

    } else {
      return { success: false, message: 'Invalid action specified.' };
    }
  } catch (e) {
    Logger.log(e);
    return { success: false, message: 'An error occurred on the server: ' + e.message };
  }
}

/**
 * Gets the entire inventory snapshot and returns it as an object for fast client-side lookups.
 * @returns {Object} An object where keys are "SKU|LOCATION" and values are quantities.
 */
function getInventorySnapshotData() {
  const snapshotData = snapshotSheet.getDataRange().getValues();
  const inventory = {};
  // Start from row 1 (index 1) to skip the header row
  for (let i = 1; i < snapshotData.length; i++) {
    const row = snapshotData[i];
    const snapshotId = row[0]; // e.g., "SKU123|Warehouse"
    const quantity = row[3];
    if (snapshotId) {
      inventory[snapshotId] = parseInt(quantity, 10) || 0;
    }
  }
  return inventory;
}
