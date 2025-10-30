// Script to update the click handler in index.html
const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Find and replace the click handler
const oldHandler = `            // Click handler
            group.addEventListener('click', function() {
                mapInfo.textContent = '🌟 You discovered: ' + countryName + '! 🌟';
                mapInfo.style.color = '#FF6B6B';
                mapInfo.style.transform = 'scale(1.1)';

                setTimeout(function() {
                    mapInfo.style.transform = 'scale(1)';
                }, 300);
            });`;

const newHandler = `            // Click handler
            group.addEventListener('click', function() {
                // Open storybook modal if available
                if (window.storybookModal && hasStorybook(countryCode)) {
                    window.storybookModal.openStory(countryCode, countryName);
                } else {
                    mapInfo.textContent = '🌟 ' + countryName + ' - Coming Soon! 🌟';
                    mapInfo.style.color = '#FF6B6B';
                    mapInfo.style.transform = 'scale(1.1)';

                    setTimeout(function() {
                        mapInfo.style.transform = 'scale(1)';
                    }, 300);
                }
            });`;

html = html.replace(oldHandler, newHandler);

fs.writeFileSync('index.html', html);
console.log('✅ Click handler updated!');
