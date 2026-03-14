from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import math
from typing import List, Dict, Any

app = FastAPI(title="Urban Intelligence API")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data helper
def get_infrastructure_data():
    # Attempt to load the pre-fetched OpenStreetMap data
    data_path = os.path.join(os.path.dirname(__file__), '../public/data/infrastructure_data.json')
    try:
        with open(data_path, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        # Fallback to the original mock data if the fetched data doesn't exist
        fallback_path = os.path.join(os.path.dirname(__file__), '../public/data/pune_data.json')
        try:
            with open(fallback_path, 'r') as f:
                return json.load(f).get('data', {})
        except FileNotFoundError:
            raise HTTPException(status_code=404, detail="Infrastructure data not found. Please run the fetch script.")

@app.get("/")
def read_root():
    return {"status": "online", "message": "Urban Intelligence API is running."}

@app.get("/api/infrastructure")
def get_infrastructure():
    data = get_infrastructure_data()
    return {
        "city": "Pune",
        "timestamp": "2026-03-14T12:00:00Z",
        "data": data
    }

# Haversine distance formula
def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dLat = math.radians(lat2 - lat1)
    dLon = math.radians(lon2 - lon1)
    a = (math.sin(dLat / 2) * math.sin(dLat / 2) +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dLon / 2) * math.sin(dLon / 2))
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance

@app.get("/api/underserved")
def get_underserved_areas(type: str = "hospitals", threshold: float = 3.0):
    data = get_infrastructure_data()
    
    source_points = []
    if type == "hospitals":
        source_points = data.get("hospitals", [])
    elif type == "schools":
        source_points = data.get("schools", [])
    else:
        raise HTTPException(status_code=400, detail="Invalid amenities type")

    # In a real app, this would query a hexagonal grid (like H3) or a set of residential zones
    # For this dashboard demonstration, we will generate a grid of test points over the bounding box
    # and return points that are > threshold km from any source point.
    
    # Pune bounding box approx
    lat_start, lat_end = 18.45, 18.60
    lon_start, lon_end = 73.75, 73.95
    steps = 15
    
    underserved_zones = []
    
    lat_step = (lat_end - lat_start) / steps
    lon_step = (lon_end - lon_start) / steps
    
    for i in range(steps):
        for j in range(steps):
            test_lat = lat_start + (i * lat_step)
            test_lon = lon_start + (j * lon_step)
            
            # Find distance to closest amenity
            min_dist = float('inf')
            for pt in source_points:
                dist = calculate_distance(test_lat, test_lon, pt['lat'], pt['lon'])
                if dist < min_dist:
                    min_dist = dist
                    
            if min_dist > threshold:
                underserved_zones.append({
                    "lat": test_lat,
                    "lon": test_lon,
                    "distance_to_nearest": min_dist,
                    "radius": threshold
                })
                
    return {
        "status": "success",
        "threshold_km": threshold,
        "amenity_type": type,
        "underserved_zones": underserved_zones
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
