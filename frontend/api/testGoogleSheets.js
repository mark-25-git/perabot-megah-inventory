// Minimal test endpoint for Google Sheets connection
export default async function handler(req, res) {
  console.log('=== TEST GOOGLE SHEETS ENDPOINT CALLED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Timestamp:', new Date().toISOString());

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Step 1: Check environment variables
    console.log('🔍 Step 1: Checking environment variables...');
    
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      console.error('❌ GOOGLE_SERVICE_ACCOUNT_KEY not found');
      return res.status(500).json({
        success: false,
        error: 'GOOGLE_SERVICE_ACCOUNT_KEY not configured',
        step: 'environment_variables'
      });
    }

    if (!process.env.GOOGLE_SHEET_ID) {
      console.error('❌ GOOGLE_SHEET_ID not found');
      return res.status(500).json({
        success: false,
        error: 'GOOGLE_SHEET_ID not configured',
        step: 'environment_variables'
      });
    }

    console.log('✅ Environment variables found');
    console.log('📊 Sheet ID:', process.env.GOOGLE_SHEET_ID);

    // Step 2: Try to import googleapis
    console.log('🔍 Step 2: Testing googleapis import...');
    
    let google;
    try {
      google = require('googleapis');
      console.log('✅ googleapis imported successfully');
    } catch (importError) {
      console.error('❌ Failed to import googleapis:', importError.message);
      return res.status(500).json({
        success: false,
        error: 'googleapis package not available',
        details: importError.message,
        step: 'package_import'
      });
    }

    // Step 3: Parse service account key
    console.log('🔍 Step 3: Parsing service account key...');
    
    let serviceAccountKey;
    try {
      serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      console.log('✅ Service account key parsed successfully');
      console.log('📧 Service account email:', serviceAccountKey.client_email);
    } catch (parseError) {
      console.error('❌ Failed to parse service account key:', parseError.message);
      return res.status(500).json({
        success: false,
        error: 'Invalid service account key format',
        details: parseError.message,
        step: 'key_parsing'
      });
    }

    // Step 4: Create JWT client
    console.log('🔍 Step 4: Creating JWT client...');
    
    let auth;
    try {
      auth = new google.auth.JWT(
        serviceAccountKey.client_email,
        null,
        serviceAccountKey.private_key,
        ['https://www.googleapis.com/auth/spreadsheets.readonly']
      );
      console.log('✅ JWT client created successfully');
    } catch (authError) {
      console.error('❌ Failed to create JWT client:', authError.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to create JWT client',
        details: authError.message,
        step: 'jwt_creation'
      });
    }

    // Step 5: Authorize client
    console.log('🔍 Step 5: Authorizing client...');
    
    try {
      await auth.authorize();
      console.log('✅ Client authorized successfully');
    } catch (authError) {
      console.error('❌ Failed to authorize client:', authError.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to authorize client',
        details: authError.message,
        step: 'authorization'
      });
    }

    // Step 6: Test basic sheet access
    console.log('🔍 Step 6: Testing basic sheet access...');
    
    try {
      const sheets = google.sheets({ version: 'v4', auth });
      const sheetId = process.env.GOOGLE_SHEET_ID;
      
      // Just try to get sheet metadata first
      const metadata = await sheets.spreadsheets.get({
        spreadsheetId: sheetId
      });
      
      console.log('✅ Successfully accessed sheet metadata');
      console.log('📊 Sheet title:', metadata.data.properties.title);
      console.log('📋 Sheet count:', metadata.data.sheets.length);
      
      return res.status(200).json({
        success: true,
        message: 'Google Sheets connection successful!',
        sheetTitle: metadata.data.properties.title,
        sheetCount: metadata.data.sheets.length,
        timestamp: new Date().toISOString()
      });
      
    } catch (sheetError) {
      console.error('❌ Failed to access sheet:', sheetError.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to access Google Sheet',
        details: sheetError.message,
        step: 'sheet_access'
      });
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.error('Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      error: 'Unexpected error',
      details: error.message,
      step: 'unknown',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
