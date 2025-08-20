import { google } from 'googleapis';

// Google Sheets API handler
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if we have the required environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error('Google Service Account key not configured');
    }

    if (!process.env.GOOGLE_SHEET_ID) {
      throw new Error('Google Sheet ID not configured');
    }

    // Parse the service account key
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
    
    // Create JWT client
    const auth = new google.auth.JWT(
      serviceAccountKey.client_email,
      null,
      serviceAccountKey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    // Create Google Sheets client
    const sheets = google.sheets({ version: 'v4', auth });

    // Get the sheet ID from environment variable
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    // For MVP, let's try to read from the Inventory Log sheet first
    // Based on Global.gs.txt, this should be the main inventory data
    const range = 'Inventory Log!A:E'; // Read first 5 columns from Inventory Log sheet

    console.log(`Fetching data from sheet: ${spreadsheetId}, range: ${range}`);
    console.log(`Service account email: ${serviceAccountKey.client_email}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    
    if (!rows || rows.length === 0) {
      console.log('No data found in Inventory Log sheet, trying first sheet...');
      
      // Fallback to first sheet if Inventory Log is empty
      const fallbackResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: 'A:E',
      });
      
      const fallbackRows = fallbackResponse.data.values;
      
      if (!fallbackRows || fallbackRows.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'No data found in any sheet',
          items: [],
          totalRows: 0,
          sheetId: spreadsheetId,
          attemptedRanges: ['Inventory Log!A:E', 'A:E']
        });
      }
      
      // Use fallback data
      const headers = fallbackRows[0];
      const dataRows = fallbackRows.slice(1);
      
      const items = dataRows.map((row, index) => ({
        id: index + 1,
        sku: row[0] || '',
        name: row[1] || '',
        category: row[2] || '',
        quantity: parseInt(row[3]) || 0,
        location: row[4] || ''
      }));

      console.log(`Successfully fetched ${items.length} items from first sheet`);

      return res.status(200).json({
        success: true,
        message: 'Data fetched successfully from first sheet',
        items,
        totalRows: items.length,
        headers,
        sheetId: spreadsheetId,
        source: 'first_sheet',
        timestamp: new Date().toISOString()
      });
    }

    // Use Inventory Log data
    const headers = rows[0];
    const dataRows = rows.slice(1);

    // Map the data to a more structured format
    // Adjust these field mappings based on your actual sheet structure
    const items = dataRows.map((row, index) => ({
      id: index + 1,
      sku: row[0] || '',
      name: row[1] || '',
      category: row[2] || '',
      quantity: parseInt(row[3]) || 0,
      location: row[4] || ''
    }));

    console.log(`Successfully fetched ${items.length} items from Inventory Log sheet`);

    res.status(200).json({
      success: true,
      message: 'Data fetched successfully from Inventory Log sheet',
      items,
      totalRows: items.length,
      headers,
      sheetId: spreadsheetId,
      source: 'inventory_log',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching inventory from Google Sheets:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch inventory data',
      message: error.message,
      sheetId: process.env.GOOGLE_SHEET_ID,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
