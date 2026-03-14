# Urban Intelligence Dashboard 🏙️

A premium, interactive web application to analyze infrastructure, density, and underserved areas in any city. 

![Dashboard Overview](/Users/rajveersingh/.gemini/antigravity/brain/21f2aad7-47e1-4e19-ab38-afc2add28d4d/analytics_view_1773421812303.png)

## Problem Statement
City planners and citizens need tools to understand how infrastructure is distributed. The **Urban Intelligence Dashboard** visualizes hospital density, school distribution, traffic nodes, and building density for a selected city (e.g., Pune).

**Core Feature:** Find underserved areas in a city.  
*Example:* The dashboard actively calculates and highlights city grids that lack hospitals or schools within a customizable X kilometer radius.

## Data Sources
- **OpenStreetMap Data via Overpass API**: Used to extract geo-locational data for hospitals, schools, traffic signals, and buildings in Pune.

## Project Architecture & Tech Stack

The application uses a modern, high-performance tech stack:
- **Next.js (App Router):** For both the React frontend and the backend API Routes serving the data.
- **Tailwind CSS & Framer Motion:** For a highly interactive, premium "Dark Mode Glassmorphism" UI aesthetic.
- **Leaflet & React-Leaflet:** To render the interactive city map, plot coordinates, and draw geographical polygons for underserved areas.
- **Recharts:** For rendering the Analytics Data Dashboard, including density radars and bar charts.
- **Backend Scripting:** Node.js script using `https` and `fs` to communicate with the Overpass API, filter the data, and generate static JSON representations of the city infrastructure.

### Division of Work
- **Student 1 (Data & Backend):** Created `scripts/fetch_osm_data.js` to extract data from the Overpass API, structured the JSON, and built the Next.js API route (`/api/infrastructure`) to serve it. Implemented mathematical geographic utilities (`src/lib/geoUtils.ts`) using the Haversine formula to find underserved map grids.
- **Student 2 (Frontend & Visualization):** Built the highly visual React dashboard (`src/app/page.tsx`), the Leaflet map component (`src/components/map/InfrastructureMap.tsx`), the interactive Recharts dashboard (`src/components/charts/AnalyticsDashboard.tsx`), and styled the application using Tailwind CSS.

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd urban-intelligence-dashboard
   ```

2. **Install dependencies:**
   Ensure you have Node.js 18+ installed.
   ```bash
   npm install
   ```

3. **Fetch OpenStreetMap Data (Optional, data is pre-fetched for Pune):**
   ```bash
   node scripts/fetch_osm_data.js
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **View the Dashboard:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Interactive Map:** Pan and zoom across the city. Toggle layers for Hospitals (Red), Schools (Blue), Traffic Nodes (Yellow), and Buildings (Purple).
- **Analytics Dashboard:** View real-time infrastructure counts and a Density Distribution Index radar chart.
- **Underserved Area Detection:** Use the sidebar to set a target amenity (e.g., Hospitals) and a distance threshold (e.g., 3km). The app calculates the Haversine distance for grid zones across the city and highlights areas in red that fail to meet the threshold.

![Underserved Areas Map](/Users/rajveersingh/.gemini/antigravity/brain/21f2aad7-47e1-4e19-ab38-afc2add28d4d/underserved_areas_map_1773421792383.png)
