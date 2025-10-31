// Script to create enhanced map with embedded SVG (no CORS issues)
const fs = require('fs');
const path = require('path');

console.log('🎨 Creating enhanced map with embedded SVG...');

// Read the SVG map
const svgPath = path.join(__dirname, '../interactive-map/world-map-complete.svg');
const svgContent = fs.readFileSync(svgPath, 'utf8');

// Extract SVG content
const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
const svgInner = svgMatch ? svgMatch[0] : svgContent;

// Read book data
const bookData = fs.readFileSync(path.join(__dirname, 'book-data.js'), 'utf8');

// Create the complete HTML with embedded SVG
const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alexandria's World - Interactive Map</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Comic Sans MS', 'Arial Rounded MT Bold', cursive, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }

        h1 {
            text-align: center;
            color: white;
            font-size: 3em;
            margin-bottom: 10px;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
        }

        .subtitle {
            text-align: center;
            color: white;
            font-size: 1.3em;
            margin-bottom: 20px;
            opacity: 0.95;
        }

        .container {
            width: 90%;
            max-width: 1400px;
            margin: 0 auto;
            background: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        }

        #map-info {
            text-align: center;
            font-size: 1.5em;
            color: #333;
            margin-bottom: 20px;
            min-height: 40px;
            font-weight: bold;
            transition: all 0.3s ease;
        }

        svg {
            width: 100%;
            height: auto;
            display: block;
        }

        #Ocean {
            fill: #E3F2FD !important;
        }

        /* Africa - Coral Orange */
        #DZ path, #AO path, #BJ path, #BW path, #BF path, #BI path, #CM path, #CV path, #CF path, #TD path, #KM path, #CG path, #CD path,
        #CI path, #DJ path, #EG path, #GQ path, #ER path, #ET path, #GA path, #GM path, #GH path, #GN path, #GW path, #KE path, #LS path,
        #LR path, #LY path, #MG path, #MW path, #ML path, #MR path, #MU path, #YT path, #MA path, #MZ path, #NA path, #NE path, #NG path,
        #RE path, #RW path, #SH path, #ST path, #SN path, #SC path, #SL path, #SO path, #ZA path, #SS path, #SD path, #SZ path, #TZ path,
        #TG path, #TN path, #UG path, #EH path, #ZM path, #ZW path {
            fill: #FF7F50 !important;
        }

        /* Asia - Light Green */
        #AF path, #AM path, #AZ path, #BH path, #BD path, #BT path, #BN path, #KH path, #CN path, #CX path, #CC path, #IO path, #GE path,
        #HK path, #IN path, #ID path, #IR path, #IQ path, #IL path, #JP path, #JO path, #KZ path, #KP path, #KR path, #KW path, #KG path,
        #LA path, #LB path, #MO path, #MY path, #MV path, #MN path, #MM path, #NP path, #OM path, #PK path, #PS path, #PH path, #QA path,
        #SA path, #SG path, #LK path, #SY path, #TW path, #TJ path, #TH path, #TL path, #TR path, #TM path, #AE path, #UZ path, #VN path, #YE path {
            fill: #90EE90 !important;
        }

        /* Europe - Sky Blue */
        #AX path, #AL path, #AD path, #AT path, #BY path, #BE path, #BA path, #BG path, #HR path, #CY path, #CZ path, #DK path, #EE path,
        #FO path, #FI path, #FR path, #DE path, #GI path, #GR path, #GG path, #VA path, #HU path, #IS path, #IE path, #IM path, #IT path,
        #JE path, #LV path, #LI path, #LT path, #LU path, #MK path, #MT path, #MD path, #MC path, #ME path, #NL path, #NO path, #PL path,
        #PT path, #RO path, #RU path, #SM path, #RS path, #SK path, #SI path, #ES path, #SJ path, #SE path, #CH path, #UA path, #GB path, #XK path {
            fill: #87CEEB !important;
        }

        /* North America - Lavender Purple */
        #AI path, #AG path, #AW path, #BS path, #BB path, #BZ path, #BM path, #BQ path, #CA path, #KY path, #CR path, #CU path, #CW path,
        #DM path, #DO path, #SV path, #GL path, #GD path, #GP path, #GT path, #HT path, #HN path, #JM path, #MQ path, #MX path, #MS path,
        #NI path, #PA path, #PM path, #PR path, #BL path, #KN path, #LC path, #MF path, #VC path, #SX path, #TT path, #TC path, #US path, #VG path, #VI path {
            fill: #DDA0DD !important;
        }

        /* South America - Golden Yellow */
        #AR path, #BO path, #BR path, #CL path, #CO path, #EC path, #FK path, #GF path, #GY path, #PY path, #PE path, #SR path, #UY path, #VE path {
            fill: #FFD700 !important;
        }

        /* Oceania - Hot Pink */
        #AS path, #AU path, #CK path, #FJ path, #PF path, #GU path, #KI path, #MH path, #FM path, #NR path, #NC path, #NZ path, #NU path,
        #NF path, #MP path, #PW path, #PG path, #PN path, #WS path, #SB path, #TK path, #TO path, #TV path, #VU path, #WF path {
            fill: #FF69B4 !important;
        }

        /* Antarctica - Light Gray */
        #AQ path, #BV path, #TF path, #HM path, #GS path {
            fill: #E0E0E0 !important;
        }

        /* Country styling */
        g[id] path {
            stroke: white !important;
            stroke-width: 0.5 !important;
            transition: all 0.3s ease;
            cursor: pointer;
        }

        g[id]:hover path {
            stroke: #333 !important;
            stroke-width: 1.5 !important;
            filter: brightness(0.85);
        }

        /* Available book indicator - glowing effect */
        g[data-book="available"] path {
            filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.6));
        }

        g[data-book="available"]:hover path {
            filter: brightness(1.1) drop-shadow(0 0 5px rgba(255, 215, 0, 0.9));
        }

        text {
            display: none;
        }

        .legend {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-top: 20px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 10px;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 1.1em;
            font-weight: bold;
        }

        .legend-color {
            width: 30px;
            height: 30px;
            border-radius: 5px;
            border: 2px solid #333;
        }

        .legend-special {
            background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
            animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }

        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .modal-content {
            position: relative;
            background: white;
            margin: 5% auto;
            padding: 0;
            max-width: 600px;
            border-radius: 25px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.5);
            animation: slideUp 0.4s ease;
            overflow: hidden;
        }

        @keyframes slideUp {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }

        .modal-header {
            background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);
            padding: 30px;
            text-align: center;
            color: white;
        }

        .modal-title {
            font-size: 2.5em;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
        }

        .modal-subtitle {
            font-size: 1.3em;
            opacity: 0.95;
        }

        .cover-container {
            padding: 30px;
            text-align: center;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }

        .cover-image {
            max-width: 100%;
            height: auto;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            transition: transform 0.3s ease;
        }

        .cover-image:hover {
            transform: scale(1.05);
        }

        .modal-buttons {
            display: flex;
            gap: 15px;
            padding: 30px;
            justify-content: center;
            background: white;
        }

        .explore-button, .close-modal-button {
            padding: 18px 40px;
            font-size: 1.4em;
            font-family: inherit;
            font-weight: bold;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }

        .explore-button {
            background: linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%);
            color: white;
            flex: 2;
        }

        .explore-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(47, 128, 237, 0.4);
        }

        .close-modal-button {
            background: #e0e0e0;
            color: #666;
            flex: 1;
        }

        .close-modal-button:hover {
            background: #d0d0d0;
            transform: translateY(-2px);
        }

        .coming-soon {
            padding: 30px;
            text-align: center;
        }

        .coming-soon-text {
            font-size: 1.8em;
            color: #666;
            margin: 20px 0;
        }

        .coming-soon-emoji {
            font-size: 4em;
            margin: 20px 0;
        }

        .close-x {
            position: absolute;
            top: 15px;
            right: 20px;
            font-size: 2em;
            color: white;
            cursor: pointer;
            z-index: 10;
            transition: transform 0.3s ease;
        }

        .close-x:hover {
            transform: scale(1.2);
        }

        /* Loading state */
        .loading-cover {
            width: 400px;
            height: 500px;
            background: linear-gradient(135deg, #e0e0e0 0%, #f0f0f0 100%);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 3em;
            animation: pulse 1.5s ease-in-out infinite;
        }

        /* Responsive */
        @media (max-width: 768px) {
            h1 {
                font-size: 2em;
            }

            .modal-content {
                margin: 10% 20px;
            }

            .modal-title {
                font-size: 1.8em;
            }

            .explore-button, .close-modal-button {
                font-size: 1.1em;
                padding: 15px 25px;
            }
        }
    </style>
</head>
<body>
    <h1>🌍 Alexandria's World Map 🌎</h1>
    <p class="subtitle">✨ Click on a glowing country to read Alexandria's adventure! ✨</p>

    <div class="container">
        <div id="map-info">Hover over countries to explore!</div>

        ${svgInner}

        <div class="legend">
            <div class="legend-item">
                <div class="legend-color" style="background: #FF7F50;"></div>
                <span>Africa</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #90EE90;"></div>
                <span>Asia</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #87CEEB;"></div>
                <span>Europe</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #DDA0DD;"></div>
                <span>North America</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #FFD700;"></div>
                <span>South America</span>
            </div>
            <div class="legend-item">
                <div class="legend-color" style="background: #FF69B4;"></div>
                <span>Oceania</span>
            </div>
            <div class="legend-item">
                <div class="legend-color legend-special"></div>
                <span>✨ Book Available!</span>
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div id="bookModal" class="modal">
        <div class="modal-content">
            <span class="close-x" onclick="closeModal()">&times;</span>
            <div class="modal-header">
                <h2 class="modal-title" id="modalTitle">Alexandria's Adventure</h2>
                <p class="modal-subtitle" id="modalSubtitle">Join Alexandria on her journey!</p>
            </div>
            <div class="cover-container" id="coverContainer">
                <div class="loading-cover">⏳</div>
            </div>
            <div class="modal-buttons" id="modalButtons">
                <button class="explore-button" id="exploreButton" onclick="openBook()">
                    📚 Explore This Book FREE!
                </button>
                <button class="close-modal-button" onclick="closeModal()">
                    Maybe Later
                </button>
            </div>
        </div>
    </div>

    <script>
${bookData.replace('if (typeof module !== \'undefined\' && module.exports) {\n    module.exports = { BOOK_DATA, PAGE_INFO, getBookImagePath, isBookAvailable };\n}', '')}

        let currentCountryCode = null;
        const modal = document.getElementById('bookModal');
        const mapInfo = document.getElementById('map-info');

        // Initialize map after DOM loaded
        document.addEventListener('DOMContentLoaded', function() {
            initializeMap();
        });

        function initializeMap() {
            const countryGroups = document.querySelectorAll('g[id]');

            countryGroups.forEach(group => {
                const countryCode = group.id;

                // Mark countries with available books
                if (isBookAvailable(countryCode)) {
                    group.setAttribute('data-book', 'available');
                }

                // Click handler
                group.addEventListener('click', function() {
                    if (isBookAvailable(countryCode)) {
                        openModal(countryCode);
                    } else {
                        showComingSoon(countryCode);
                    }
                });

                // Hover handlers
                group.addEventListener('mouseover', function() {
                    const name = BOOK_DATA[countryCode]?.name || countryCode;
                    const available = isBookAvailable(countryCode);

                    if (available) {
                        mapInfo.textContent = \`✨ \${name} - Click to read Alexandria's adventure!\`;
                        mapInfo.style.color = '#FF6B6B';
                    } else {
                        mapInfo.textContent = \`📍 \${name} - Coming soon!\`;
                        mapInfo.style.color = '#4ECDC4';
                    }
                });

                group.addEventListener('mouseout', function() {
                    mapInfo.textContent = 'Hover over countries to explore!';
                    mapInfo.style.color = '#333';
                });
            });

            console.log('✅ Map initialized with', countryGroups.length, 'countries');
            console.log('✨ Books available:', Object.keys(BOOK_DATA).filter(isBookAvailable).length);
        }

        function openModal(countryCode) {
            currentCountryCode = countryCode;
            const bookData = BOOK_DATA[countryCode];

            // Set modal content
            document.getElementById('modalTitle').textContent = \`Alexandria's \${bookData.name} Adventure!\`;
            document.getElementById('modalSubtitle').textContent = \`Discover the wonders of \${bookData.name}\`;

            // Load cover image
            const coverPath = getBookImagePath(countryCode, 'page_01_cover.png');
            const coverContainer = document.getElementById('coverContainer');

            coverContainer.innerHTML = '<div class="loading-cover">⏳</div>';

            const img = new Image();
            img.onload = function() {
                coverContainer.innerHTML = \`<img src="\${coverPath}" alt="\${bookData.name} Cover" class="cover-image">\`;
            };
            img.onerror = function() {
                coverContainer.innerHTML = \`<div class="coming-soon-emoji">📚</div><p>Cover image loading...</p>\`;
            };
            img.src = coverPath;

            // Show modal
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function showComingSoon(countryCode) {
            const name = BOOK_DATA[countryCode]?.name || countryCode;

            document.getElementById('modalTitle').textContent = name;
            document.getElementById('modalSubtitle').textContent = 'Alexandria will visit soon!';
            document.getElementById('coverContainer').innerHTML = \`
                <div class="coming-soon">
                    <div class="coming-soon-emoji">🚀</div>
                    <p class="coming-soon-text">This adventure is coming soon!</p>
                    <p style="color: #999; font-size: 1.2em;">Check back later to join Alexandria in \${name}!</p>
                </div>
            \`;
            document.getElementById('modalButtons').style.display = 'none';

            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
            currentCountryCode = null;

            // Reset buttons display
            document.getElementById('modalButtons').style.display = 'flex';
        }

        function openBook() {
            if (currentCountryCode && isBookAvailable(currentCountryCode)) {
                window.location.href = \`book-reader.html?country=\${currentCountryCode}\`;
            }
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeModal();
            }
        });
    </script>
</body>
</html>
`;

// Write the file
fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
console.log('✅ Enhanced map created: index.html');
console.log('📁 No CORS issues - SVG is embedded inline!');
console.log('🚀 Ready to use in both local and web environments!');
