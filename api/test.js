// Simple test endpoint to verify API connectivity
export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    res.status(200).json({
      success: true,
      message: 'API connection successful!',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0'
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}
