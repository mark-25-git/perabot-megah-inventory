export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  // Only allow GET and POST
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { action, ...params } = req.query;
    
    if (!action) {
      res.status(400).json({ error: 'Missing action parameter' });
      return;
    }

    // Build the Google Apps Script URL
    const gasUrl = 'https://script.google.com/macros/s/AKfycbz7FTfsXUKOZ0yf30uk4txEDPo0hbfHaG8Z5k-QFbdUcLlFQz_lgQAwC_yLkI1gx4/exec';
    
    // Prepare the request to GAS
    const requestOptions = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    // Add body for POST requests
    if (req.method === 'POST' && req.body) {
      requestOptions.body = JSON.stringify(req.body);
    }

    // Make request to Google Apps Script
    const response = await fetch(`${gasUrl}?action=${action}`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`GAS request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.text();
    
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Return the response from GAS
    res.status(200).send(data);

  } catch (error) {
    console.error('Proxy error:', error);
    
    // Set CORS headers even for errors
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    res.status(500).json({ 
      error: 'Proxy request failed', 
      message: error.message 
    });
  }
}


