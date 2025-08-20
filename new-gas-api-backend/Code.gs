/**
 * Main API entry point for the inventory system.
 * Handles all API requests and returns JSON responses.
 * This replaces the old web app approach to fix iOS Safari issues.
 */

/**
 * Handles OPTIONS requests for CORS preflight
 */
function doOptions(e) {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * Handles GET requests - primarily for data retrieval
 * Examples:
 * - GET with action=getDashboard
 * - GET with action=getAllSkus
 * - GET with action=getInventorySnapshot
 * - GET with action=getLowStockData
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    Logger.log('doGet called with action: ' + action);
    
    const response = {
      success: true,
      data: null,
      message: null,
      timestamp: new Date().toISOString()
    };

    switch (action) {
      case 'getDashboard':
        Logger.log('Calling getDashboardDataForAllLocations...');
        if (typeof getDashboardDataForAllLocations === 'function') {
          response.data = getDashboardDataForAllLocations();
        } else {
          throw new Error('getDashboardDataForAllLocations function not found');
        }
        break;
        
      case 'getAllSkus':
        Logger.log('Calling getAllSkus...');
        if (typeof getAllSkus === 'function') {
          response.data = getAllSkus();
        } else {
          throw new Error('getAllSkus function not found');
        }
        break;
        
      case 'getInventorySnapshot':
        Logger.log('Calling getInventorySnapshotData...');
        if (typeof getInventorySnapshotData === 'function') {
          response.data = getInventorySnapshotData();
        } else {
          throw new Error('getInventorySnapshotData function not found');
        }
        break;
        
      case 'getLowStockData':
        Logger.log('Calling getLowStockDataForAllLocations...');
        if (typeof getLowStockDataForAllLocations === 'function') {
          response.data = getLowStockDataForAllLocations();
        } else {
          throw new Error('getLowStockDataForAllLocations function not found');
        }
        break;
        
      default:
        response.success = false;
        response.message = 'Invalid action specified: ' + action;
        break;
    }

    Logger.log('Response prepared successfully');
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('doGet Error: ' + error.message);
    Logger.log('Error stack: ' + error.stack);
    
    const errorResponse = {
      success: false,
      data: null,
      message: error.message,
      timestamp: new Date().toISOString(),
      errorType: error.constructor.name
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handles POST requests - primarily for data modification
 * Examples:
 * - POST with action=processAdmin and form data
 */
function doPost(e) {
  try {
    Logger.log('doPost called with data: ' + e.postData.contents);
    
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;
    
    const response = {
      success: true,
      data: null,
      message: null,
      timestamp: new Date().toISOString()
    };

    switch (action) {
      case 'processAdmin':
        Logger.log('Calling processAdminAction...');
        if (typeof processAdminAction === 'function') {
          response.data = processAdminAction(postData.data);
          response.message = response.data.message;
          response.success = response.data.success;
        } else {
          throw new Error('processAdminAction function not found');
        }
        break;
        
      default:
        response.success = false;
        response.message = 'Invalid action specified: ' + action;
        break;
    }

    Logger.log('POST response prepared successfully');
    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('doPost Error: ' + error.message);
    Logger.log('Error stack: ' + error.stack);
    
    const errorResponse = {
      success: false,
      data: null,
      message: error.message,
      timestamp: new Date().toISOString(),
      errorType: error.constructor.name
    };
    
    return ContentService
      .createTextOutput(JSON.stringify(errorResponse))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * This is a one-time setup function to create the 'On Change' trigger programmatically.
 * Run this function once from the script editor to install the trigger.
 */
function createOnChangeTrigger() {
  const SPREADSHEET_ID = "1t8eqdoMh9_1l6DnvD_tqagMWWz0Ctci-_0nz4tqP86g"; // Your Spreadsheet ID

  // Deletes any existing triggers for this function to prevent duplicates
  const allTriggers = ScriptApp.getProjectTriggers();
  for (const trigger of allTriggers) {
    if (trigger.getHandlerFunction() === 'updateInventorySnapshot') {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // Creates the new trigger
  ScriptApp.newTrigger('updateInventorySnapshot') // The function to run
    .forSpreadsheet(SPREADSHEET_ID)                // The spreadsheet to watch
    .onChange()                                    // The event type
    .create();                                     // Create it!

  Logger.log('On Change trigger created successfully.');
}