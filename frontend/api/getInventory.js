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

    // Authorize the client
    await auth.authorize();

    // Create Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth });

    // Get the sheet ID from environment variable
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    // Try to read from "Inventory Log" sheet first, fallback to first sheet
    let range = 'Inventory Log!A:E';
    let response;
    
    try {
      response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });
    } catch (sheetError) {
      console.log('Inventory Log sheet not found, trying first sheet...');
      // Fallback to first sheet
      range = 'A:E';
      response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });
    }

    const rows = response.data.values || [];
    
    // Skip header row and format data
    const inventory = rows.slice(1).map((row, index) => ({
      id: index + 1,
      sku: row[0] || '',
      name: row[1] || '',
      category: row[2] || '',
      quantity: parseInt(row[3]) || 0,
      location: row[4] || ''
    }));

    console.log(`Successfully fetched ${inventory.length} inventory items from sheet: ${sheetId}, range: ${range}`);

    res.status(200).json({
      success: true,
      data: inventory,
      total: inventory.length,
      sheetId: sheetId,
      range: range
    });

  } catch (error) {
    console.error('Error fetching inventory:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to fetch inventory from Google Sheets'
    });
  }
}
