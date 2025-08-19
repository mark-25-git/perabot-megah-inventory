//Dashboard.gs
// This file contains the backend logic for the Dashboard API.
// These constants are now expected to be defined ONCE in Global.gs
// and are globally accessible here.
// DO NOT DECLARE THEM HERE if they are in Global.gs.
// const SPREADSHEET_ID = "1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g";
// const logSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Inventory Log");
// const snapshotSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName("Inventory Snapshot");
// Set the default low stock threshold globally for the backend
const DEFAULT_LOW_STOCK_THRESHOLD = 20;

/**
 * Helper function to retrieve product names for SKUs from the Product Master sheet.
 * Assumes 'Product Master' sheet exists and has 'SKU' and 'ProductName' columns.
 * Caches results for efficiency.
 */
let productMasterCache = null;

// New helper function to get SKUs from the Product Master and cache them
// Note: `cachedProductSkus` is declared in Global.gs
function getCachedProductSkus() {
  if (!cachedProductSkus) {
    const skus = productSheet.getRange('B2:B').getValues().flat().filter(String).map(s => s.trim().toUpperCase());
    cachedProductSkus = skus;
    Logger.log('Product SKUs loaded into cache.');
  }
  return cachedProductSkus;
}

function getProductName(sku) {
  if (!productMasterCache) {
    try {
      const productMasterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product Master");
      if (!productMasterSheet) {
        Logger.log("Product Master sheet not found. Product names will not be available.");
        productMasterCache = {}; // Cache an empty object to prevent repeated lookup errors
        return sku; // Return SKU itself if sheet not found
      }
      const productData = productMasterSheet.getDataRange().getValues();
      const headers = productData.shift();
      const skuCol = headers.indexOf('SKU');
      const nameCol = headers.indexOf('ProductName');
      if (skuCol === -1 || nameCol === -1) {
        Logger.log("SKU or ProductName column not found in Product Master. Product names will not be available.");
        productMasterCache = {}; // Cache empty to prevent repeated lookup errors
        return sku; // Return SKU itself if columns not found
      }

      productMasterCache = {};
      productData.forEach(row => {
        productMasterCache[row[skuCol]] = row[nameCol];
      });
    } catch (e) {
      Logger.log("Error loading Product Master data: " + e.message);
      productMasterCache = {}; // Fallback to empty cache on error
      return sku;
    }
  }
  return productMasterCache[sku] || sku; // Return product name or SKU if not found
}

/**
 * Helper function to calculate stock metrics for a given set of inventory data.
 * @param {Array<object>} inventoryData - An array of {sku: string, stock: number, productName: string} objects.
 * @returns {object} Calculated total stock and distinct SKUs.
 */
function calculateStockMetrics(inventoryData) {
  const totalStock = inventoryData.reduce((sum, item) => sum + item.stock, 0);
  const distinctSkus = inventoryData.length; // Already distinct at this point
  return { totalStock, distinctSkus };
}

/**
 * Helper function to calculate sales metrics for a given location or overall.
 * @param {Array<Array<any>>} logEntries - Raw data from Inventory Log (excluding headers).
 * @param {string} filterLocation - 'Overall', 'Shop', or 'Warehouse'.
 * @param {Date} today - Normalized Date object for today.
 * @returns {object} SalesToday, SalesBySku (map), DailySales (map).
 */
function calculateSalesMetrics(logEntries, filterLocation, today) {
  let salesToday = 0;
  const salesBySku = {};
  const dailySales = {};

  const timestampCol = 1; // Column B
  const skuCol = 2; // Column C
  const quantityCol = 3;  // Column D
  const modeCol = 4; // Column E
  const sourceCol = 5;    // Column F (SourceLocation)

  logEntries.forEach(row => {
    const timestamp = new Date(row[timestampCol]);
    const entryDate = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate());
    const mode = row[modeCol];
    const sourceLocation = row[sourceCol];
    const quantity = parseInt(row[quantityCol], 10);
    const sku = row[skuCol];

    if (isNaN(quantity)) {
        Logger.log(`Skipping log entry with invalid quantity: ${JSON.stringify(row)}`);
        return;
    }

    if (mode === 'SALE') {
      if (filterLocation === 'Overall' || sourceLocation === filterLocation) {
        // Sales Today
        if (entryDate.getTime() === today.getTime()) {
          salesToday += quantity;
        }

        // Sales by SKU
        salesBySku[sku] = (salesBySku[sku] || 0) + quantity;

        // Daily Sales Trend
        const dateString = Utilities.formatDate(entryDate, Session.getScriptTimeZone(), "yyyy-MM-dd");
        dailySales[dateString] = (dailySales[dateString] || 0) + quantity;
      }
    }
  });

  return { salesToday, salesBySku, dailySales };
}

/**
 * Helper function to get top selling SKUs with an "Other" category for beyond top 5.
 * @param {object} salesBySkuMap - Map of SKU to total sold quantity.
 * @returns {Array<object>} Top 5 selling SKUs and an "Other" category if applicable.
 */
function getTopSellingSkusWithOther(salesBySkuMap) {
  const allSkus = Object.entries(salesBySkuMap)
    .map(([sku, totalSold]) => ({ sku, totalSold, productName: getProductName(sku) }))
    .sort((a, b) => b.totalSold - a.totalSold);
  const top5 = allSkus.slice(0, 5);
  let otherTotal = 0;

  if (allSkus.length > 5) {
    for (let i = 5; i < allSkus.length; i++) {
      otherTotal += allSkus[i].totalSold;
    }
    top5.push({ sku: 'Other', productName: 'Other', totalSold: otherTotal });
  }
  return top5;
}

/**
 * Helper function to retrieve movement records for the last X days.
 * @param {Array<Array<any>>} logEntries - Raw data from Inventory Log (excluding headers).
 * @param {number} days - Number of past days to retrieve records for.
 * @returns {Array<object>} Filtered movement records.
 */
function getMovementRecords(logEntries, days) {
  const records = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - days);

  const timestampCol = 1; // Column B
  const skuCol = 2; // Column C
  const quantityCol = 3;  // Column D
  const modeCol = 4; // Column E
  const sourceCol = 5;    // Column F (SourceLocation)
  const destCol = 6; // Column G (DestinationLocation)
  const userCol = 7;      // Column H (User)

  logEntries.forEach(row => {
    const timestamp = new Date(row[timestampCol]);
    if (timestamp >= cutoffDate) {
      const mode = row[modeCol];
      // Include RECEIVING, TRANSFER, ADJUSTMENT
      if (['RECEIVING', 'TRANSFER', 'ADJUSTMENT'].includes(mode)) {
        records.push({
          timestamp: Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm"),
          sku: row[skuCol],
          productName: getProductName(row[skuCol]),
          quantity: row[quantityCol],
          mode: mode,
          source: row[sourceCol],
          destination: row[destCol],
          user: row[userCol]
        });
      }
    }
  });
  // Sort by timestamp descending
  return records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Helper function to find SKUs in stock but with no sales in the last X days.
 * @param {Array<object>} allInventoryArray - Array of all inventory items.
 * @param {Array<Array<any>>} logEntries - Raw data from Inventory Log (excluding headers).
 * @param {number} days - Number of past days to check for sales.
 * @returns {Array<object>} List of inactive SKUs.
 */
function getInactiveSkus(allInventoryArray, logEntries, days) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoffDate = new Date(today);
  cutoffDate.setDate(today.getDate() - days);

  const soldSkus = new Set();
  const timestampCol = 1; // Column B
  const skuCol = 2; // Column C
  const modeCol = 4;      // Column E

  logEntries.forEach(row => {
    const timestamp = new Date(row[timestampCol]);
    const mode = row[modeCol];
    const sku = row[skuCol];

    if (mode === 'SALE' && timestamp >= cutoffDate) {
      soldSkus.add(sku);
    }
  });
  // Filter inventory for SKUs with stock > 0 and not in soldSkus set
  const inactiveSkus = allInventoryArray.filter(item => item.stock > 0 && !soldSkus.has(item.sku));
  return inactiveSkus.sort((a, b) => a.sku.localeCompare(b.sku));
}

/**
 * Fetches and processes data for the dashboard view for ALL locations.
 * @returns {object} A data object for the client-side to render, containing data for Overall, Shop, and Warehouse.
 */
function getDashboardDataForAllLocations() {
  try {
    const snapshotRawData = snapshotSheet.getDataRange().getValues();
    const snapshotHeaders = snapshotRawData.shift(); // Remove header row

    // Get column indices dynamically from snapshot sheet
    const snapshotSkuCol = snapshotHeaders.indexOf('SKU');
    const snapshotLocationCol = snapshotHeaders.indexOf('Location');
    const snapshotCurrentStockCol = snapshotHeaders.indexOf('CurrentStock');
    const snapshotLastUpdatedCol = snapshotHeaders.indexOf('LastUpdated'); // New: Get LastUpdated column index

    if (snapshotSkuCol === -1 || snapshotLocationCol === -1 || snapshotCurrentStockCol === -1 || snapshotLastUpdatedCol === -1) {
      throw new Error("Required columns (SKU, Location, CurrentStock, LastUpdated) not found in Inventory Snapshot sheet.");
    }

    // New: Calculate overall last updated time from snapshot
    let latestSnapshotUpdate = null;
    // Iterate over snapshotRawData to find the latest timestamp
    snapshotRawData.forEach(row => {
      const lastUpdatedTimestamp = new Date(row[snapshotLastUpdatedCol]);
      if (latestSnapshotUpdate === null || lastUpdatedTimestamp > latestSnapshotUpdate) {
        latestSnapshotUpdate = lastUpdatedTimestamp;
      }
    });
    const lastUpdatedOverallFormatted = latestSnapshotUpdate ? Utilities.formatDate(latestSnapshotUpdate, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss") : 'N/A';
    // Process snapshot data for all locations
    const allInventoryMap = {}; // { sku: { stock: number, productName: string } }
    const shopInventoryMap = {}; // { sku: { stock: number, productName: string } }
    const warehouseInventoryMap = {}; // { sku: { stock: number, productName: string } }

    snapshotRawData.forEach(row => {
      const sku = row[snapshotSkuCol];
      const location = row[snapshotLocationCol];
      const currentStock = parseInt(row[snapshotCurrentStockCol], 10);
      const productName = getProductName(sku); // Get product name using helper

      if (isNaN(currentStock)) {
          Logger.log(`Skipping snapshot entry with invalid current stock: ${JSON.stringify(row)}`);
          return;
      }

      // Aggregate for Overall
      if (!allInventoryMap[sku]) {
        allInventoryMap[sku] = { sku: sku, stock: 0, productName: productName };
      }
      allInventoryMap[sku].stock += currentStock;

      // Filter for specific locations
      if (location === 'Shop') {
        shopInventoryMap[sku] = { sku: sku, stock: currentStock, productName: productName };
      } else if (location === 'Warehouse') {
        warehouseInventoryMap[sku] = { sku: sku, stock: currentStock, productName: productName };
      }
    });
    // Convert maps to sorted arrays
    const allInventoryArray = Object.values(allInventoryMap).sort((a, b) => a.sku.localeCompare(b.sku));
    const shopInventoryArray = Object.values(shopInventoryMap).sort((a, b) => a.sku.localeCompare(b.sku));
    const warehouseInventoryArray = Object.values(warehouseInventoryMap).sort((a, b) => a.sku.localeCompare(b.sku));
    // Calculate stock metrics
    const overallStockMetrics = calculateStockMetrics(allInventoryArray);
    const shopStockMetrics = calculateStockMetrics(shopInventoryArray);
    const warehouseStockMetrics = calculateStockMetrics(warehouseInventoryArray);
    // Filter low stock based on the DEFAULT_LOW_STOCK_THRESHOLD
    // Sort low stock by quantity, ascending
    const overallLowStock = allInventoryArray.filter(item => item.stock < DEFAULT_LOW_STOCK_THRESHOLD).sort((a, b) => a.stock - b.stock);
    const shopLowStock = shopInventoryArray.filter(item => item.stock < DEFAULT_LOW_STOCK_THRESHOLD).sort((a, b) => a.stock - b.stock);
    const warehouseLowStock = warehouseInventoryArray.filter(item => item.stock < DEFAULT_LOW_STOCK_THRESHOLD).sort((a, b) => a.stock - b.stock);
    // Get log data for sales and movement calculations
    const logRawData = logSheet.getDataRange().getValues();
    logRawData.shift(); // Remove header row from log data

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of today

    // Calculate sales metrics for each scope
    const overallSales = calculateSalesMetrics(logRawData, 'Overall', today);
    const shopSales = calculateSalesMetrics(logRawData, 'Shop', today);
    const warehouseSales = calculateSalesMetrics(logRawData, 'Warehouse', today); // Will be 0 if no sales from warehouse

    // Process Top Selling SKUs with "Other" category
    const overallTopSellingSkus = getTopSellingSkusWithOther(overallSales.salesBySku);
    const shopTopSellingSkus = getTopSellingSkusWithOther(shopSales.salesBySku);
    const warehouseTopSellingSkus = getTopSellingSkusWithOther(warehouseSales.salesBySku); // Will be empty/trivial if no sales from warehouse

    // Prepare daily sales for chart (last 7 and 30 days)
    const salesTrendData7Days = [['Date', 'Sales Quantity']];
    for (let i = 6; i >= 0; i--) { // Last 7 days including today
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateString = Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
        salesTrendData7Days.push([dateString, overallSales.dailySales[dateString] || 0]);
    }

    const salesTrendData30Days = [['Date', 'Sales Quantity']];
    for (let i = 29; i >= 0; i--) { // Last 30 days including today
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateString = Utilities.formatDate(d, Session.getScriptTimeZone(), "yyyy-MM-dd");
        salesTrendData30Days.push([dateString, overallSales.dailySales[dateString] || 0]);
    }

    // Get movement records for warehouse
    const warehouseMovementRecords = getMovementRecords(logRawData, 30); // Last 30 days as per requirement

    // Get inactive SKUs
    const inactiveSkus = getInactiveSkus(allInventoryArray, logRawData, 14); // Last 14 days as per requirement

    return {
      lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD, // Pass fixed threshold back to UI for display
      lastUpdatedOverall: lastUpdatedOverallFormatted, // New: Pass overall last updated time
      overall: {
        totalStock: overallStockMetrics.totalStock,
        distinctSkus: overallStockMetrics.distinctSkus,
        salesToday: overallSales.salesToday, // This will be shop sales only due to prompt
        inventory: allInventoryArray,
        lowStock: overallLowStock,
        topSellingSkus: overallTopSellingSkus,
        salesTrendData7Days: salesTrendData7Days,
        salesTrendData30Days: salesTrendData30Days
      },
      shop: {
        totalStock: shopStockMetrics.totalStock,
        distinctSkus: shopStockMetrics.distinctSkus,
        salesToday: shopSales.salesToday,
        inventory: shopInventoryArray,
        lowStock: shopLowStock,
        topSellingSkus: shopTopSellingSkus,
        // Add total sales accumulated by SKU for shop
        totalSalesAccumulated: Object.entries(shopSales.salesBySku)
                                     .map(([sku, totalSold]) => ({ sku, totalSold, productName: getProductName(sku) }))
                                     .sort((a, b) => b.totalSold - a.totalSold) // Sort by total sold descending
      },
      warehouse: {
        totalStock: warehouseStockMetrics.totalStock,
        distinctSkus: warehouseStockMetrics.distinctSkus,
        // salesToday and topSellingSkus for warehouse are explicitly excluded from UI based on prompt.
        // Data is still calculated in backend but won't be displayed.
        inventory: warehouseInventoryArray,
        lowStock: warehouseLowStock,
        movementRecords: warehouseMovementRecords
      },
      inactiveSkus: inactiveSkus
    };
  } catch (e) {
    Logger.log('getDashboardDataForAllLocations Error: ' + e.message + ' Stack: ' + e.stack);
    return { error: 'Failed to load dashboard data: ' + e.message };
  }
}

/**
 * Fetches and returns only low stock data for all locations based on the default threshold.
 * This is designed for partial updates from the frontend.
 * No 'threshold' parameter needed anymore as it's fixed.
 * @returns {object} An object containing low stock arrays for overall, shop, and warehouse.
 */
function getLowStockDataForAllLocations() { // Removed threshold parameter
    try {
        const snapshotRawData = snapshotSheet.getDataRange().getValues();
        const snapshotHeaders = snapshotRawData.shift(); // Remove header row

        // Get column indices dynamically
        const snapshotSkuCol = snapshotHeaders.indexOf('SKU');
        const snapshotLocationCol = snapshotHeaders.indexOf('Location');
        const snapshotCurrentStockCol = snapshotHeaders.indexOf('CurrentStock');
        // No need for LastUpdated here, as this function is for low stock specific data

        if (snapshotSkuCol === -1 || snapshotLocationCol === -1 || snapshotCurrentStockCol === -1) {
            throw new Error("Required columns (SKU, Location, CurrentStock) not found in Inventory Snapshot sheet.");
        }

        const allInventoryMap = {};
        const shopInventoryMap = {};
        const warehouseInventoryMap = {};
        snapshotRawData.forEach(row => {
            const sku = row[snapshotSkuCol];
            const location = row[snapshotLocationCol];
            const currentStock = parseInt(row[snapshotCurrentStockCol], 10);
            const productName = getProductName(sku); // Get product name using helper

            if (isNaN(currentStock)) {
                Logger.log(`Skipping snapshot entry with invalid current stock during low stock fetch: ${JSON.stringify(row)}`);
                return;
            }

            // Aggregate for Overall
            if (!allInventoryMap[sku]) {
                allInventoryMap[sku] = { sku: sku, stock: 0, productName: productName };
            }
            allInventoryMap[sku].stock += currentStock;

            // Filter for specific locations
            if (location === 'Shop') {
                shopInventoryMap[sku] = { sku: sku, stock: currentStock, productName: productName };
            } else if (location === 'Warehouse') {
                warehouseInventoryMap[sku] = { sku: sku, stock: currentStock, productName: productName };
            }
        });

        // Convert maps to arrays and filter by DEFAULT_LOW_STOCK_THRESHOLD, then sort by stock ascending
        const overallLowStock = Object.values(allInventoryMap)
                                   .filter(item => item.stock < DEFAULT_LOW_STOCK_THRESHOLD)
                                   .sort((a, b) => a.stock - b.stock);
        const shopLowStock = Object.values(shopInventoryMap)
                               .filter(item => item.stock < DEFAULT_LOW_STOCK_THRESHOLD)
                               .sort((a, b) => a.stock - b.stock);
        const warehouseLowStock = Object.values(warehouseInventoryMap)
                                     .filter(item => item.stock < DEFAULT_LOW_STOCK_THRESHOLD)
                                     .sort((a, b) => a.stock - b.stock);
        return {
            overallLowStock: overallLowStock,
            shopLowStock: shopLowStock,
            warehouseLowStock: warehouseLowStock
        };
    } catch (e) {
        Logger.log('getLowStockDataForAllLocations Error: ' + e.message + ' Stack: ' + e.stack);
        throw new Error('Failed to fetch low stock data: ' + e.message); // Re-throw to inform frontend
    }
}
