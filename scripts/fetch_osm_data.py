import requests
import json
import os

# Overpass API URL
OVERPASS_URL = "http://overpass-api.de/api/interpreter"

# Bounding box for the city (e.g., Pune central area)
# Format: (south, west, north, east)
BBOX = "(18.45, 73.75, 18.60, 73.95)"

# The Overpass QL query
query = f"""
[out:json][timeout:180];
(
  node["amenity"="hospital"]{BBOX};
  way["amenity"="hospital"]{BBOX};
  
  node["amenity"="school"]{BBOX};
  way["amenity"="school"]{BBOX};

  node["highway"="traffic_signals"]{BBOX};
);
out center;
"""

def fetch_infrastructure_data():
    print("Fetching data from Overpass API... This may take a moment.")
    try:
        response = requests.post(OVERPASS_URL, data={'data': query})
        response.raise_for_status()  # Check for HTTP errors
        
        data = response.json()
        elements = data.get('elements', [])
        
        hospitals = []
        schools = []
        traffic_signals = []
        
        for element in elements:
            # For ways, Overpass provides 'center' when using 'out center;'
            lat = element.get('lat') or (element.get('center', {}).get('lat'))
            lon = element.get('lon') or (element.get('center', {}).get('lon'))
            
            if not lat or not lon:
                continue
                
            tags = element.get('tags', {})
            name = tags.get('name', 'Unnamed')
            
            item = {
                'id': element['id'],
                'lat': lat,
                'lon': lon,
                'name': name
            }
            
            if tags.get('amenity') == 'hospital':
                hospitals.append(item)
            elif tags.get('amenity') == 'school':
                schools.append(item)
            elif tags.get('highway') == 'traffic_signals':
                traffic_signals.append(item)
                
        print(f"Found {len(hospitals)} hospitals, {len(schools)} schools, and {len(traffic_signals)} traffic signals.")
        
        # Save to output file
        output_dir = os.path.join(os.path.dirname(__file__), '../public/data')
        os.makedirs(output_dir, exist_ok=True)
        
        output_file = os.path.join(output_dir, 'infrastructure_data.json')
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump({
                'hospitals': hospitals,
                'schools': schools,
                'traffic_signals': traffic_signals
            }, f, indent=2, ensure_ascii=False)
            
        print(f"Data saved successfully to {output_file}")
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from Overpass API: {e}")
    except json.JSONDecodeError:
        print("Error decoding JSON response from Overpass API.")

if __name__ == "__main__":
    fetch_infrastructure_data()
