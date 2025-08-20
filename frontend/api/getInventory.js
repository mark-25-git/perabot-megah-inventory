import { google } from 'googleapis';

// Google Sheets API handler
export default async function handler(req, res) {
  console.log('=== GET INVENTORY ENDPOINT CALLED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Timestamp:', new Date().toISOString());

  if (req.method !== 'GET') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔍 Checking environment variables...');
    
    // Check if we have the required environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      console.error('❌ GOOGLE_SERVICE_ACCOUNT_KEY not found');
      throw new Error('Google Service Account key not configured');
    }

    if (!process.env.GOOGLE_SHEET_ID) {
      console.error('❌ GOOGLE_SHEET_ID not found');
      throw new Error('Google Sheet ID not configured');
    }

    console.log('✅ Environment variables found');
    console.log('📊 Sheet ID:', process.env.GOOGLE_SHEET_ID);

    // Parse the service account key
    let serviceAccountKey;
    try {
      serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      console.log('✅ Service account key parsed successfully');
      console.log('📧 Service account email:', serviceAccountKey.client_email);
    } catch (parseError) {
      console.error('❌ Failed to parse service account key:', parseError.message);
      throw new Error('Invalid service account key format');
    }
    
    // Create JWT client
    console.log('🔐 Creating JWT client...');
    const auth = new google.auth.JWT(
      serviceAccountKey.client_email,
      null,
      serviceAccountKey.private_key,
      ['https://www.googleapis.com/auth/spreadsheets.readonly']
    );

    // Authorize the client
    console.log('🔑 Authorizing client...');
    await auth.authorize();
    console.log('✅ Client authorized successfully');

    // Create Google Sheets API client
    console.log('📊 Creating Google Sheets client...');
    const sheets = google.sheets({ version: 'v4', auth });

    // Get the sheet ID from environment variable
    const sheetId = process.env.GOOGLE_SHEET_ID;
    
    // Try to read from "Inventory Log" sheet first, fallback to first sheet
    let range = 'Inventory Log!A:E';
    let response;
    
    try {
      console.log(`📖 Reading from sheet: ${sheetId}, range: ${range}`);
      response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });
      console.log('✅ Successfully read from Inventory Log sheet');
    } catch (sheetError) {
      console.log('⚠️  Inventory Log sheet not found, trying first sheet...');
      console.log('Error details:', sheetError.message);
      
      // Fallback to first sheet
      range = 'A:E';
      console.log(`📖 Reading from first sheet: ${sheetId}, range: ${range}`);
      response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: range,
      });
      console.log('✅ Successfully read from first sheet');
    }

    const rows = response.data.values || [];
    console.log(`📊 Found ${rows.length} rows in sheet`);
    
    if (rows.length > 0) {
      console.log('📋 First row (headers):', rows[0]);
    }
    
    // Skip header row and format data
    const inventory = rows.slice(1).map((row, index) => ({
      id: index + 1,
      sku: row[0] || '',
      name: row[1] || '',
      category: row[2] || '',
      quantity: parseInt(row[3]) || 0,
      location: row[4] || ''
    }));

    console.log(`✅ Successfully processed ${inventory.length} inventory items`);
    console.log('📊 Sample item:', inventory[0] || 'No items found');

    res.status(200).json({
      success: true,
      data: inventory,
      total: inventory.length,
      sheetId: sheetId,
      range: range,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in getInventory:', error);
    console.error('Error stack:', error.stack);
    
    // Send detailed error response
    res.status(500).json({
      success: false,
      error: error.message,
      details: 'Failed to fetch inventory from Google Sheets',
      timestamp: new Date().toISOString(),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
