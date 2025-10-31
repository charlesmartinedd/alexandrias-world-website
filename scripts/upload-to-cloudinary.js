const fs = require('fs');
const path = require('path');
const https = require('https');

// Cloudinary credentials
const CLOUDINARY_CLOUD_NAME = 'diy7vbwze';
const CLOUDINARY_API_KEY = '464137253732654';
const CLOUDINARY_API_SECRET = 'Lx95WXokaFOVpaIPWTELdOI45P8';

const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

// Path to images
const IMAGES_DIR = path.join(__dirname, '../../alexandrias-world-book-design/countries');

/**
 * Upload a single image to Cloudinary
 */
async function uploadImage(imagePath, publicId) {
  return new Promise((resolve, reject) => {
    const FormData = require('form-data');
    const form = new FormData();

    form.append('file', fs.createReadStream(imagePath));
    form.append('public_id', publicId);
    form.append('folder', 'alexandrias-world');
    form.append('api_key', CLOUDINARY_API_KEY);

    // Generate upload signature
    const crypto = require('crypto');
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = crypto
      .createHash('sha1')
      .update(`folder=alexandrias-world&public_id=${publicId}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`)
      .digest('hex');

    form.append('timestamp', timestamp);
    form.append('signature', signature);

    form.submit(CLOUDINARY_UPLOAD_URL, (err, res) => {
      if (err) {
        reject(err);
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.secure_url) {
            resolve(result.secure_url);
          } else {
            reject(new Error('No URL in response'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });
  });
}

/**
 * Upload all country images
 */
async function uploadAllImages() {
  console.log('🚀 Starting Cloudinary upload...\n');

  if (CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME') {
    console.error('❌ Please update your Cloudinary credentials in this script!');
    console.log('\n1. Go to: https://cloudinary.com/console');
    console.log('2. Copy your Cloud Name, API Key, and API Secret');
    console.log('3. Update the variables at the top of this file\n');
    process.exit(1);
  }

  const countries = fs.readdirSync(IMAGES_DIR);
  const results = {
    uploaded: [],
    failed: [],
    skipped: []
  };

  for (const country of countries) {
    const countryPath = path.join(IMAGES_DIR, country);
    const imagesPath = path.join(countryPath, 'images');

    if (!fs.existsSync(imagesPath)) {
      results.skipped.push(country);
      continue;
    }

    const images = fs.readdirSync(imagesPath).filter(f => f.endsWith('.png'));

    console.log(`📁 ${country} (${images.length} images)`);

    for (const image of images) {
      const imagePath = path.join(imagesPath, image);
      const publicId = `${country}/${image.replace('.png', '')}`;

      try {
        const url = await uploadImage(imagePath, publicId);
        console.log(`  ✅ ${image}`);
        results.uploaded.push({ country, image, url });
      } catch (error) {
        console.log(`  ❌ ${image}: ${error.message}`);
        results.failed.push({ country, image, error: error.message });
      }

      // Rate limiting: wait 100ms between uploads
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Save results
  const resultFile = path.join(__dirname, 'cloudinary-upload-results.json');
  fs.writeFileSync(resultFile, JSON.stringify(results, null, 2));

  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Uploaded: ${results.uploaded.length}`);
  console.log(`❌ Failed: ${results.failed.length}`);
  console.log(`⏭️  Skipped: ${results.skipped.length}`);
  console.log(`\n📄 Results saved: ${resultFile}`);
}

// Run upload
uploadAllImages().catch(console.error);
