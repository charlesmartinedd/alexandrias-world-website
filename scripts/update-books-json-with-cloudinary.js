const fs = require('fs');
const path = require('path');

// Cloudinary configuration
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/diy7vbwze/image/upload/alexandrias-world';

// Paths
const BOOKS_JSON_PATH = path.join(__dirname, '../public/data/books.json');
const UPLOAD_RESULTS_PATH = path.join(__dirname, 'cloudinary-upload-results.json');

/**
 * Update books.json with Cloudinary URLs
 */
function updateBooksJson() {
  console.log('📚 Updating books.json with Cloudinary URLs...\n');

  // Read current books.json
  const booksData = JSON.parse(fs.readFileSync(BOOKS_JSON_PATH, 'utf8'));
  console.log(`Found ${booksData.books.length} books in books.json`);

  // Read upload results
  const uploadResults = JSON.parse(fs.readFileSync(UPLOAD_RESULTS_PATH, 'utf8'));
  console.log(`Found ${uploadResults.uploaded.length} successfully uploaded images\n`);

  // Create a map of uploaded images for quick lookup
  const uploadedMap = new Map();
  uploadResults.uploaded.forEach(item => {
    const key = `${item.country}/${item.image}`;
    uploadedMap.set(key, item.url);
  });

  // Update each book's images
  let updatedBooks = 0;
  let updatedImages = 0;

  booksData.books.forEach(book => {
    const countrySlug = book.id; // e.g., "afghanistan"
    let bookUpdated = false;

    // Update cover image
    if (book.coverImage) {
      const imageName = path.basename(book.coverImage);
      const cloudinaryUrl = `${CLOUDINARY_BASE_URL}/${countrySlug}/${imageName.replace('.png', '')}`;
      book.coverImage = cloudinaryUrl;
      updatedImages++;
      bookUpdated = true;
    }

    // Update all page images
    if (book.pages && Array.isArray(book.pages)) {
      book.pages.forEach(page => {
        if (page.image) {
          const imageName = path.basename(page.image);
          const cloudinaryUrl = `${CLOUDINARY_BASE_URL}/${countrySlug}/${imageName.replace('.png', '')}`;
          page.image = cloudinaryUrl;
          updatedImages++;
        }
      });
      bookUpdated = true;
    }

    if (bookUpdated) {
      updatedBooks++;
    }
  });

  // Save updated books.json
  fs.writeFileSync(
    BOOKS_JSON_PATH,
    JSON.stringify(booksData, null, 2),
    'utf8'
  );

  console.log('✅ Update complete!\n');
  console.log('='.repeat(60));
  console.log('📊 UPDATE SUMMARY');
  console.log('='.repeat(60));
  console.log(`Books updated: ${updatedBooks}`);
  console.log(`Images updated: ${updatedImages}`);
  console.log(`\nUpdated file: ${BOOKS_JSON_PATH}`);
  console.log('\n✨ All book images now point to Cloudinary CDN!');
  console.log('\n📋 Next steps:');
  console.log('1. Commit and push the updated books.json');
  console.log('2. Wait for GitHub Pages to deploy (~2 minutes)');
  console.log('3. Test the live site');
}

// Run update
try {
  updateBooksJson();
} catch (error) {
  console.error('❌ Error updating books.json:', error);
  process.exit(1);
}
