const https = require('https');
const fs = require('fs');
const path = require('path');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const CITY = 'Bangalore';

const QUERY = `
[out:json][timeout:180];
(
  node["amenity"="hospital"](12.82, 77.38, 13.12, 77.78);
  way["amenity"="hospital"](12.82, 77.38, 13.12, 77.78);
  
  node["amenity"="school"](12.82, 77.38, 13.12, 77.78);
  way["amenity"="school"](12.82, 77.38, 13.12, 77.78);

  node["highway"="traffic_signals"](12.82, 77.38, 13.12, 77.78);
  
  node["amenity"="pharmacy"](12.82, 77.38, 13.12, 77.78);
  way["amenity"="pharmacy"](12.82, 77.38, 13.12, 77.78);
  
  node["amenity"="police"](12.82, 77.38, 13.12, 77.78);
  way["amenity"="police"](12.82, 77.38, 13.12, 77.78);

  node["building"](12.95, 77.58, 12.98, 77.61);
  way["building"](12.95, 77.58, 12.98, 77.61);
);
out center;
`;

console.log('Fetching data for ' + CITY + ' from Overpass API... This may take a minute or two.');

const req = https.request(OVERPASS_URL, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'UrbanIntelligenceDashboard/1.0'
  }
}, (res) => {
  let data = '';
  
  console.log('Response Status: ' + res.statusCode);
  
  res.on('data', chunk => {
    data += chunk;
    process.stdout.write('.');
  });
  
  res.on('end', () => {
    console.log('\nProcessing data...');
    try {
      const parsedData = JSON.parse(data);
      console.log('Retrieved ' + (parsedData.elements ? parsedData.elements.length : 0) + ' total elements.');
      
      const hospitals = [];
      const schools = [];
      const trafficNodes = [];
      const pharmacies = [];
      const police = [];
      const buildings = [];
      
      if (parsedData.elements) {
        parsedData.elements.forEach(element => {
          const lat = element.lat || (element.center && element.center.lat);
          const lon = element.lon || (element.center && element.center.lon);
          
          if (!lat || !lon) return;
          
          const tags = element.tags || {};
          const item = {
            id: element.id,
            lat,
            lon,
            name: tags.name || 'Unnamed',
          };
          
          if (tags.amenity === 'hospital') {
            item.type = 'hospital';
            hospitals.push(item);
          } else if (tags.amenity === 'school') {
            item.type = 'school';
            schools.push(item);
          } else if (tags.highway === 'traffic_signals') {
            item.type = 'traffic_node';
            trafficNodes.push(item);
          } else if (tags.amenity === 'pharmacy') {
            item.type = 'pharmacy';
            pharmacies.push(item);
          } else if (tags.amenity === 'police') {
            item.type = 'police';
            police.push(item);
          } else if (tags.building) {
            item.type = 'building';
            buildings.push(item);
          }
        });
      }
      
      const finalData = {
        city: CITY,
        timestamp: new Date().toISOString(),
        counts: {
          hospitals: hospitals.length,
          schools: schools.length,
          trafficNodes: trafficNodes.length,
          pharmacies: pharmacies.length,
          police: police.length,
          buildings: buildings.length,
        },
        data: {
          hospitals,
          schools,
          trafficNodes,
          pharmacies,
          police,
          buildings
        }
      };
      
      if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      }
      
      const outputFile = path.join(OUTPUT_DIR, CITY.toLowerCase() + '_data.json');
      fs.writeFileSync(outputFile, JSON.stringify(finalData, null, 2));
      
      console.log('\nSuccess! Data saved to ' + outputFile);
      console.log('Summary:');
      console.log('- Hospitals: ' + finalData.counts.hospitals);
      console.log('- Schools: ' + finalData.counts.schools);
      console.log('- Traffic Nodes: ' + finalData.counts.trafficNodes);
      console.log('- Pharmacies: ' + finalData.counts.pharmacies);
      console.log('- Police: ' + finalData.counts.police);
      console.log('- Buildings: ' + finalData.counts.buildings);
      
    } catch (e) {
      console.error('Error parsing JSON response:', e.message);
      fs.writeFileSync(path.join(OUTPUT_DIR, 'raw_error_response.txt'), data);
    }
  });
});

req.on('error', error => {
  console.error('Request failed:', error);
});

req.write('data=' + encodeURIComponent(QUERY));
req.end();
