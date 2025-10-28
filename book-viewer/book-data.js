// Book availability data - maps country codes to their book data
const BOOK_DATA = {
    // Format: 'COUNTRY_CODE': { name: 'Country Name', folder: 'folder_name', status: 'available/coming-soon' }

    // Available Books (55+ countries with complete images)
    'AF': { name: 'Afghanistan', folder: 'afghanistan', status: 'available', pages: 14 },
    'AL': { name: 'Albania', folder: 'albania', status: 'available', pages: 14 },
    'DZ': { name: 'Algeria', folder: 'algeria', status: 'available', pages: 14 },
    'AD': { name: 'Andorra', folder: 'andorra', status: 'available', pages: 14 },
    'AO': { name: 'Angola', folder: 'angola', status: 'available', pages: 14 },
    'AG': { name: 'Antigua and Barbuda', folder: 'antigua_and_barbuda', status: 'available', pages: 14 },
    'AR': { name: 'Argentina', folder: 'argentina', status: 'available', pages: 14 },
    'AM': { name: 'Armenia', folder: 'armenia', status: 'available', pages: 14 },
    'AU': { name: 'Australia', folder: 'australia', status: 'available', pages: 14 },
    'AT': { name: 'Austria', folder: 'austria', status: 'available', pages: 14 },
    'AZ': { name: 'Azerbaijan', folder: 'azerbaijan', status: 'available', pages: 14 },
    'BS': { name: 'Bahamas', folder: 'bahamas', status: 'available', pages: 14 },
    'BH': { name: 'Bahrain', folder: 'bahrain', status: 'available', pages: 14 },
    'BD': { name: 'Bangladesh', folder: 'bangladesh', status: 'available', pages: 14 },
    'BB': { name: 'Barbados', folder: 'barbados', status: 'available', pages: 14 },
    'BY': { name: 'Belarus', folder: 'belarus', status: 'available', pages: 14 },
    'BE': { name: 'Belgium', folder: 'belgium', status: 'available', pages: 14 },
    'BZ': { name: 'Belize', folder: 'belize', status: 'available', pages: 14 },
    'BJ': { name: 'Benin', folder: 'benin', status: 'available', pages: 14 },
    'BT': { name: 'Bhutan', folder: 'bhutan', status: 'available', pages: 14 },
    'BO': { name: 'Bolivia', folder: 'bolivia', status: 'available', pages: 14 },
    'BA': { name: 'Bosnia and Herzegovina', folder: 'bosnia_and_herzegovina', status: 'available', pages: 14 },
    'BW': { name: 'Botswana', folder: 'botswana', status: 'available', pages: 14 },
    'BR': { name: 'Brazil', folder: 'brazil', status: 'available', pages: 14 },
    'BN': { name: 'Brunei', folder: 'brunei', status: 'available', pages: 14 },
    'BG': { name: 'Bulgaria', folder: 'bulgaria', status: 'available', pages: 14 },
    'BF': { name: 'Burkina Faso', folder: 'burkina_faso', status: 'available', pages: 14 },
    'BI': { name: 'Burundi', folder: 'burundi', status: 'available', pages: 14 },
    'KH': { name: 'Cambodia', folder: 'cambodia', status: 'available', pages: 14 },
    'CM': { name: 'Cameroon', folder: 'cameroon', status: 'available', pages: 14 },
    'CA': { name: 'Canada', folder: 'canada', status: 'available', pages: 14 },
    'CV': { name: 'Cape Verde', folder: 'cape_verde', status: 'available', pages: 14 },
    'CF': { name: 'Central African Republic', folder: 'central_african_republic', status: 'available', pages: 14 },
    'TD': { name: 'Chad', folder: 'chad', status: 'available', pages: 14 },
    'CL': { name: 'Chile', folder: 'chile', status: 'available', pages: 14 },
    'CN': { name: 'China', folder: 'china', status: 'available', pages: 14 },
    'CO': { name: 'Colombia', folder: 'colombia', status: 'available', pages: 14 },
    'KM': { name: 'Comoros', folder: 'comoros', status: 'available', pages: 14 },
    'EG': { name: 'Egypt', folder: 'egypt', status: 'available', pages: 14 },
    'FR': { name: 'France', folder: 'france', status: 'available', pages: 14 },
    'DE': { name: 'Germany', folder: 'germany', status: 'available', pages: 14 },
    'IN': { name: 'India', folder: 'india', status: 'available', pages: 14 },
    'ID': { name: 'Indonesia', folder: 'indonesia', status: 'available', pages: 14 },
    'IT': { name: 'Italy', folder: 'italy', status: 'available', pages: 14 },
    'JP': { name: 'Japan', folder: 'japan', status: 'available', pages: 14 },
    'KE': { name: 'Kenya', folder: 'kenya', status: 'available', pages: 14 },
    'MX': { name: 'Mexico', folder: 'mexico', status: 'available', pages: 14 },
    'MA': { name: 'Morocco', folder: 'morocco', status: 'available', pages: 14 },
    'NG': { name: 'Nigeria', folder: 'nigeria', status: 'available', pages: 14 },
    'PE': { name: 'Peru', folder: 'peru', status: 'available', pages: 14 },
    'ZA': { name: 'South Africa', folder: 'south_africa', status: 'available', pages: 14 },
    'ES': { name: 'Spain', folder: 'spain', status: 'available', pages: 14 },
    'TH': { name: 'Thailand', folder: 'thailand', status: 'available', pages: 14 },
    'GB': { name: 'United Kingdom', folder: 'uk', status: 'available', pages: 14 },
    'US': { name: 'United States', folder: 'usa', status: 'available', pages: 14 }
};

// Page information for consistent display
const PAGE_INFO = [
    { number: 1, file: 'page_01_cover.png', title: 'Cover' },
    { number: 2, file: 'page_02_introduction.png', title: 'Introduction' },
    { number: 3, file: 'page_03_arrival.png', title: 'Arrival' },
    { number: 4, file: 'page_04_plane_window.png', title: 'Through the Plane Window' },
    { number: 5, file: 'page_05_meeting_friend.png', title: 'Meeting a New Friend' },
    { number: 6, file: 'page_06_with_family.png', title: 'With Family' },
    { number: 7, file: 'page_07_traditional_meal.png', title: 'Traditional Meal' },
    { number: 8, file: 'page_08_cultural_story.png', title: 'Cultural Story' },
    { number: 9, file: 'page_09_landmark_visit.png', title: 'Landmark Visit' },
    { number: 10, file: 'page_10_second_landmark.png', title: 'Second Landmark' },
    { number: 11, file: 'page_11_third_landmark.png', title: 'Third Landmark' },
    { number: 12, file: 'page_12_activity.png', title: 'Activity Time' },
    { number: 13, file: 'page_13_playground.png', title: 'Playground Fun' },
    { number: 14, file: 'page_14_goodbye.png', title: 'Goodbye' }
];

// Helper function to get book path
function getBookImagePath(countryCode, pageFile) {
    const book = BOOK_DATA[countryCode];
    if (!book || book.status !== 'available') return null;

    // Path will be relative to the book-viewer location
    return `../../alexandrias-world-book-design/countries/${book.folder}/images/${pageFile}`;
}

// Helper function to check if book is available
function isBookAvailable(countryCode) {
    return BOOK_DATA[countryCode] && BOOK_DATA[countryCode].status === 'available';
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BOOK_DATA, PAGE_INFO, getBookImagePath, isBookAvailable };
}
