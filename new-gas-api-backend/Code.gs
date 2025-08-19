/**
 * Main API entry point for the inventory system.
 * Handles all API requests and returns JSON responses.
 * This replaces the old web app approach to fix iOS Safari issues.
 */

/**
 * Handles GET requests - primarily for data retrieval
 * Examples:
 * - /exec?action=getDashboard
 * - /exec?action=getAllSkus
 * - /exec?action=getInventorySnapshot
 */
function doGet(e) {
  try {
    const action = e.parameter.action;
    
    const response = {
      success: true,
      data: null,
      message: null,
      timestamp: new Date().toISOString()
    };

    switch (action) {
      case 'getDashboard':
        response.data = getDashboardDataForAllLocations();
        break;
        
      case 'getAllSkus':
        response.data = getAllSkus();
        break;
        
      case 'getInventorySnapshot':
        response.data = getInventorySnapshotData();
        break;
        
      case 'getLowStock':
        response.data = getLowStockDataForAllLocations();
        break;
        
      default:
        response.success = false;
        response.message = 'Invalid action specified';
        break;
    }

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('doGet Error: ' + error.message);
    const errorResponse = {
      success: false,
      data: null,
      message: error.message,
      timestamp: new Date().toISOString()
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
        response.data = processAdminAction(postData.data);
        response.message = response.data.message;
        response.success = response.data.success;
        break;
        
      default:
        response.success = false;
        response.message = 'Invalid action specified';
        break;
    }

    return ContentService
      .createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('doPost Error: ' + error.message);
    const errorResponse = {
      success: false,
      data: null,
      message: error.message,
      timestamp: new Date().toISOString()
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