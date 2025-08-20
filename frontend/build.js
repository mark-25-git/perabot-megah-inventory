// Simple build script for Vercel
// This script just copies files to satisfy Vercel's build requirements

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting build process...');

// Create output directory if it doesn't exist
const outputDir = path.join(__dirname, 'public');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✅ Created public directory');
}

// Copy static files to public directory
const filesToCopy = [
  'index.html',
  'app.js',
  'styles.css'
];

filesToCopy.forEach(file => {
  const sourcePath = path.join(__dirname, file);
  const destPath = path.join(outputDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file} to public directory`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

// Also copy the API directory to public for Vercel to find
const apiSourceDir = path.join(__dirname, 'api');
const apiDestDir = path.join(outputDir, 'api');

if (fs.existsSync(apiSourceDir)) {
  if (!fs.existsSync(apiDestDir)) {
    fs.mkdirSync(apiDestDir, { recursive: true });
  }
  
  const apiFiles = fs.readdirSync(apiSourceDir);
  apiFiles.forEach(file => {
    const sourcePath = path.join(apiSourceDir, file);
    const destPath = path.join(apiDestDir, file);
    
    if (fs.statSync(sourcePath).isFile()) {
      fs.copyFileSync(sourcePath, destPath);
      console.log(`✅ Copied API file ${file} to public/api directory`);
    }
  });
}

console.log('🎉 Build completed successfully!');
console.log('📁 Output directory:', outputDir);
console.log('📁 API directory:', apiDestDir);
