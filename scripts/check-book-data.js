const fs = require('fs');

const data = JSON.parse(fs.readFileSync('public/data/books.json', 'utf8'));

console.log('\n📊 BOOK STATUS ANALYSIS\n');
console.log('Total countries:', data.totalCountries);

const complete = data.countries.filter(c => c.status === 'complete');
const incomplete = data.countries.filter(c => c.status === 'incomplete');
const empty = data.countries.filter(c => c.status === 'empty');

console.log('Complete books:', complete.length);
console.log('Incomplete books:', incomplete.length);
console.log('Empty books:', empty.length);

if (incomplete.length > 0) {
  console.log('\n⚠️  INCOMPLETE BOOKS (missing some pages):\n');
  incomplete.forEach((country, i) => {
    console.log(`${i+1}. ${country.name} - ${country.availablePages}/${country.totalPages} pages`);
    console.log(`   Missing pages: ${country.missingPages.join(', ')}`);
  });
}

if (empty.length > 0) {
  console.log('\n❌ EMPTY BOOKS (no pages at all):\n');
  empty.forEach((country, i) => {
    console.log(`${i+1}. ${country.name}`);
  });
}

// Check for books with broken image URLs
console.log('\n🔍 CHECKING IMAGE URLs:\n');
let issueCount = 0;
complete.forEach(c => {
  if (c.pages.length === 0 || !c.pages[0]) {
    console.log(`⚠️  ${c.name}: Marked complete but has ${c.pages.length} pages`);
    issueCount++;
  }
  // Check if cover image exists
  if (!c.coverImage || !c.coverImage.imageUrl) {
    console.log(`⚠️  ${c.name}: No cover image`);
    issueCount++;
  }
});

if (issueCount === 0) {
  console.log('✅ All complete books have valid data!');
}

console.log(`\n📈 Summary: ${complete.length} books ready to display`);
