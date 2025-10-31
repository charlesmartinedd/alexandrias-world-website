// Configuration for dynamically loading images from GitHub
const GITHUB_RAW_URL = 'https://raw.githubusercontent.com/charlesmartinedd/alexandrias-world-book-design/main/countries';

// Helper function to get image URL from GitHub
function getImageUrl(country, imageName) {
    // Convert country name to lowercase with underscores (matching repo structure)
    const countryFolder = country.toLowerCase().replace(/ /g, '_');
    return `${GITHUB_RAW_URL}/${countryFolder}/images/${imageName}`;
}

// Helper function to get story JSON URL from GitHub
function getStoryUrl(country) {
    const countryFolder = country.toLowerCase().replace(/ /g, '_');
    return `${GITHUB_RAW_URL}/${countryFolder}/story/story.json`;
}

// Countries that have complete storybooks (update this list as you add more)
const AVAILABLE_COUNTRIES = {
    'JP': 'japan',
    // Add more as you create them
    // 'BR': 'brazil',
    // 'MX': 'mexico',
};

// Check if a country has a storybook available
function hasStorybook(countryCode) {
    return countryCode in AVAILABLE_COUNTRIES;
}

// Get country folder name from code
function getCountryFolder(countryCode) {
    return AVAILABLE_COUNTRIES[countryCode];
}
