import { google } from 'googleapis';

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

    // Get the sheet data
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Inventory Log!A:E', // Try Inventory Log first, fallback to first sheet
    });

    const rows = response.data.values || [];
    
    if (rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No data found in sheet',
        data: [],
        count: 0
      });
    }

    // Extract headers and data
    const headers = rows[0];
    const data = rows.slice(1).map((row, index) => {
      const item = {};
      headers.forEach((header, colIndex) => {
        item[header] = row[colIndex] || '';
      });
      item.id = index + 1; // Add row ID
      return item;
    });

    res.status(200).json({
      success: true,
      message: 'Data fetched successfully',
      data: data,
      count: data.length,
      headers: headers
    });

  } catch (error) {
    console.error('Google Sheets API error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch data from Google Sheets',
      message: error.message
    });
  }
}
