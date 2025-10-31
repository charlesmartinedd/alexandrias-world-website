// Script to integrate the complete SVG map with styling
const fs = require('fs');
const path = require('path');

// Read the complete SVG
const svgContent = fs.readFileSync(path.join(__dirname, 'world-map-complete.svg'), 'utf8');

// Extract just the SVG inner content (skip XML declaration and DOCTYPE)
const svgMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
const svgInner = svgMatch ? svgMatch[0] : svgContent;

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
            margin-bottom: 20px;
            text-shadow: 3px 3px 6px rgba(0,0,0,0.3);
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

        /* Override SVG default styles */
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

        /* All country paths */
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
            transform: scale(1.02);
        }

        /* Hide country labels from original SVG */
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
    </style>
</head>
<body>
    <h1>🌍 Alexandria's World Map 🌎</h1>

    <div class="container">
        <div id="map-info">Click on any country to learn its name!</div>

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
        </div>
    </div>

    <script>
        // Country name mapping from country codes
        const countryNames = {
            'AF': 'Afghanistan', 'AX': 'Åland Islands', 'AL': 'Albania', 'DZ': 'Algeria',
            'AS': 'American Samoa', 'AD': 'Andorra', 'AO': 'Angola', 'AI': 'Anguilla',
            'AQ': 'Antarctica', 'AG': 'Antigua and Barbuda', 'AR': 'Argentina', 'AM': 'Armenia',
            'AW': 'Aruba', 'AU': 'Australia', 'AT': 'Austria', 'AZ': 'Azerbaijan',
            'BS': 'Bahamas', 'BH': 'Bahrain', 'BD': 'Bangladesh', 'BB': 'Barbados',
            'BY': 'Belarus', 'BE': 'Belgium', 'BZ': 'Belize', 'BJ': 'Benin',
            'BM': 'Bermuda', 'BT': 'Bhutan', 'BO': 'Bolivia', 'BQ': 'Bonaire',
            'BA': 'Bosnia and Herzegovina', 'BW': 'Botswana', 'BV': 'Bouvet Island', 'BR': 'Brazil',
            'IO': 'British Indian Ocean Territory', 'BN': 'Brunei', 'BG': 'Bulgaria', 'BF': 'Burkina Faso',
            'BI': 'Burundi', 'KH': 'Cambodia', 'CM': 'Cameroon', 'CA': 'Canada',
            'CV': 'Cape Verde', 'KY': 'Cayman Islands', 'CF': 'Central African Republic', 'TD': 'Chad',
            'CL': 'Chile', 'CN': 'China', 'CX': 'Christmas Island', 'CC': 'Cocos Islands',
            'CO': 'Colombia', 'KM': 'Comoros', 'CG': 'Congo', 'CD': 'Congo (Democratic Republic)',
            'CK': 'Cook Islands', 'CR': 'Costa Rica', 'CI': 'Côte d\\'Ivoire', 'HR': 'Croatia',
            'CU': 'Cuba', 'CW': 'Curaçao', 'CY': 'Cyprus', 'CZ': 'Czech Republic',
            'DK': 'Denmark', 'DJ': 'Djibouti', 'DM': 'Dominica', 'DO': 'Dominican Republic',
            'EC': 'Ecuador', 'EG': 'Egypt', 'SV': 'El Salvador', 'GQ': 'Equatorial Guinea',
            'ER': 'Eritrea', 'EE': 'Estonia', 'ET': 'Ethiopia', 'FK': 'Falkland Islands',
            'FO': 'Faroe Islands', 'FJ': 'Fiji', 'FI': 'Finland', 'FR': 'France',
            'GF': 'French Guiana', 'PF': 'French Polynesia', 'TF': 'French Southern Territories', 'GA': 'Gabon',
            'GM': 'Gambia', 'GE': 'Georgia', 'DE': 'Germany', 'GH': 'Ghana',
            'GI': 'Gibraltar', 'GR': 'Greece', 'GL': 'Greenland', 'GD': 'Grenada',
            'GP': 'Guadeloupe', 'GU': 'Guam', 'GT': 'Guatemala', 'GG': 'Guernsey',
            'GN': 'Guinea', 'GW': 'Guinea-Bissau', 'GY': 'Guyana', 'HT': 'Haiti',
            'HM': 'Heard Island', 'VA': 'Holy See', 'HN': 'Honduras', 'HK': 'Hong Kong',
            'HU': 'Hungary', 'IS': 'Iceland', 'IN': 'India', 'ID': 'Indonesia',
            'IR': 'Iran', 'IQ': 'Iraq', 'IE': 'Ireland', 'IM': 'Isle of Man',
            'IL': 'Israel', 'IT': 'Italy', 'JM': 'Jamaica', 'JP': 'Japan',
            'JE': 'Jersey', 'JO': 'Jordan', 'KZ': 'Kazakhstan', 'KE': 'Kenya',
            'KI': 'Kiribati', 'KP': 'North Korea', 'KR': 'South Korea', 'XK': 'Kosovo',
            'KW': 'Kuwait', 'KG': 'Kyrgyzstan', 'LA': 'Laos', 'LV': 'Latvia',
            'LB': 'Lebanon', 'LS': 'Lesotho', 'LR': 'Liberia', 'LY': 'Libya',
            'LI': 'Liechtenstein', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'MO': 'Macao',
            'MK': 'Macedonia', 'MG': 'Madagascar', 'MW': 'Malawi', 'MY': 'Malaysia',
            'MV': 'Maldives', 'ML': 'Mali', 'MT': 'Malta', 'MH': 'Marshall Islands',
            'MQ': 'Martinique', 'MR': 'Mauritania', 'MU': 'Mauritius', 'YT': 'Mayotte',
            'MX': 'Mexico', 'FM': 'Micronesia', 'MD': 'Moldova', 'MC': 'Monaco',
            'MN': 'Mongolia', 'ME': 'Montenegro', 'MS': 'Montserrat', 'MA': 'Morocco',
            'MZ': 'Mozambique', 'MM': 'Myanmar', 'NA': 'Namibia', 'NR': 'Nauru',
            'NP': 'Nepal', 'NL': 'Netherlands', 'NC': 'New Caledonia', 'NZ': 'New Zealand',
            'NI': 'Nicaragua', 'NE': 'Niger', 'NG': 'Nigeria', 'NU': 'Niue',
            'NF': 'Norfolk Island', 'MP': 'Northern Mariana Islands', 'NO': 'Norway', 'OM': 'Oman',
            'PK': 'Pakistan', 'PW': 'Palau', 'PS': 'Palestine', 'PA': 'Panama',
            'PG': 'Papua New Guinea', 'PY': 'Paraguay', 'PE': 'Peru', 'PH': 'Philippines',
            'PN': 'Pitcairn', 'PL': 'Poland', 'PT': 'Portugal', 'PR': 'Puerto Rico',
            'QA': 'Qatar', 'RE': 'Réunion', 'RO': 'Romania', 'RU': 'Russia',
            'RW': 'Rwanda', 'BL': 'Saint Barthélemy', 'SH': 'Saint Helena', 'KN': 'Saint Kitts and Nevis',
            'LC': 'Saint Lucia', 'MF': 'Saint Martin', 'PM': 'Saint Pierre and Miquelon', 'VC': 'Saint Vincent',
            'WS': 'Samoa', 'SM': 'San Marino', 'ST': 'São Tomé and Príncipe', 'SA': 'Saudi Arabia',
            'SN': 'Senegal', 'RS': 'Serbia', 'SC': 'Seychelles', 'SL': 'Sierra Leone',
            'SG': 'Singapore', 'SX': 'Sint Maarten', 'SK': 'Slovakia', 'SI': 'Slovenia',
            'SB': 'Solomon Islands', 'SO': 'Somalia', 'ZA': 'South Africa', 'GS': 'South Georgia',
            'SS': 'South Sudan', 'ES': 'Spain', 'LK': 'Sri Lanka', 'SD': 'Sudan',
            'SR': 'Suriname', 'SJ': 'Svalbard', 'SZ': 'Swaziland', 'SE': 'Sweden',
            'CH': 'Switzerland', 'SY': 'Syria', 'TW': 'Taiwan', 'TJ': 'Tajikistan',
            'TZ': 'Tanzania', 'TH': 'Thailand', 'TL': 'Timor-Leste', 'TG': 'Togo',
            'TK': 'Tokelau', 'TO': 'Tonga', 'TT': 'Trinidad and Tobago', 'TN': 'Tunisia',
            'TR': 'Turkey', 'TM': 'Turkmenistan', 'TC': 'Turks and Caicos', 'TV': 'Tuvalu',
            'UG': 'Uganda', 'UA': 'Ukraine', 'AE': 'United Arab Emirates', 'GB': 'United Kingdom',
            'US': 'United States', 'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VU': 'Vanuatu',
            'VE': 'Venezuela', 'VN': 'Vietnam', 'VG': 'British Virgin Islands', 'VI': 'U.S. Virgin Islands',
            'WF': 'Wallis and Futuna', 'EH': 'Western Sahara', 'YE': 'Yemen', 'ZM': 'Zambia',
            'ZW': 'Zimbabwe'
        };

        // Get all country groups
        const countryGroups = document.querySelectorAll('g[id]');
        const mapInfo = document.getElementById('map-info');

        countryGroups.forEach(group => {
            const countryCode = group.id;
            const countryName = countryNames[countryCode] || countryCode;

            // Click handler
            group.addEventListener('click', function() {
                mapInfo.textContent = '🌟 You discovered: ' + countryName + '! 🌟';
                mapInfo.style.color = '#FF6B6B';
                mapInfo.style.transform = 'scale(1.1)';

                setTimeout(function() {
                    mapInfo.style.transform = 'scale(1)';
                }, 300);
            });

            // Hover handlers
            group.addEventListener('mouseover', function() {
                mapInfo.textContent = '👉 Hovering over: ' + countryName;
                mapInfo.style.color = '#4ECDC4';
            });

            group.addEventListener('mouseout', function() {
                mapInfo.textContent = 'Click on any country to learn its name!';
                mapInfo.style.color = '#333';
            });
        });
    </script>
</body>
</html>`;

// Write the complete HTML file
fs.writeFileSync(path.join(__dirname, 'index.html'), htmlContent, 'utf8');
console.log('✅ Complete interactive map created: index.html');
