// Debug endpoint to test Vercel API routing
export default function handler(req, res) {
  console.log('=== DEBUG ENDPOINT CALLED ===');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Path:', req.url);
  console.log('Headers:', Object.keys(req.headers));
  console.log('User Agent:', req.headers['user-agent']);
  console.log('Host:', req.headers.host);
  console.log('Timestamp:', new Date().toISOString());
  console.log('================================');

  res.status(200).json({
    success: true,
    message: "Debug endpoint working!",
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: Object.keys(req.headers),
    userAgent: req.headers['user-agent'],
    host: req.headers.host,
    environment: process.env.NODE_ENV || 'development'
  });
}
