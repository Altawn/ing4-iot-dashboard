import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';

// Country-level data
const COUNTRY_DATA = [
    { lat: 46.2276, lng: 2.2137, country: "France", iso: "FRA", sensors: 450 }, // HQ
    { lat: 37.0902, lng: -95.7129, country: "United States", iso: "USA", sensors: 320 },
    { lat: -25.2744, lng: 133.7751, country: "Australia", iso: "AUS", sensors: 180 },
    { lat: 35.8617, lng: 104.1954, country: "China", iso: "CHN", sensors: 210 },
    { lat: -14.2350, lng: -51.9253, country: "Brazil", iso: "BRA", sensors: 150 },
    { lat: 51.1657, lng: 10.4515, country: "Germany", iso: "DEU", sensors: 95 },
    { lat: 20.5937, lng: 78.9629, country: "India", iso: "IND", sensors: 110 },
    { lat: 56.1304, lng: -106.3468, country: "Canada", iso: "CAN", sensors: 85 },
];

const SensorGlobe = () => {
    const globeEl = useRef();
    const [countries, setCountries] = useState({ features: [] });
    const [rings, setRings] = useState([]);

    useEffect(() => {
        // Load World GeoJSON
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);

        // Create ripple rings effect (Red Pings)
        const interval = setInterval(() => {
            setRings(currentRings => {
                const newRings = COUNTRY_DATA.map(loc => ({
                    lat: loc.lat,
                    lng: loc.lng,
                    maxRadius: 5 + Math.random() * 5, // Larger radius for countries
                    propagationSpeed: 1 + Math.random(), // Slower propagation
                    repeatPeriod: 800 + Math.random() * 1000
                }));
                return newRings;
            });
        }, 2000);

        // Auto-rotate
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
        }

        return () => clearInterval(interval);
    }, []);

    // Filter active countries to highlight them
    const activeIsoCodes = useMemo(() => new Set(COUNTRY_DATA.map(c => c.iso)), []);

    return (
        <div style={{ width: '100%', height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderRadius: '12px', background: 'rgba(15, 23, 42, 0.5)' }}>
            <Globe
                ref={globeEl}
                width={800}
                height={400}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                // Atmosphere
                atmosphereColor="#ef4444"
                atmosphereAltitude={0.15}

                // Country Polygons
                polygonsData={countries.features}
                polygonCapColor={d => (activeIsoCodes.has(d.properties.ISO_A3) || activeIsoCodes.has(d.properties.ADM0_A3)) ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0,0,0,0)'}
                polygonSideColor={() => 'rgba(0,0,0,0)'}
                polygonStrokeColor={d => (activeIsoCodes.has(d.properties.ISO_A3) || activeIsoCodes.has(d.properties.ADM0_A3)) ? '#ef4444' : 'rgba(255,255,255,0.05)'}
                polygonAltitude={0.01}

                // Custom HTML Markers (Pins)
                htmlElementsData={COUNTRY_DATA}
                htmlElement={d => {
                    const el = document.createElement('div');
                    el.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
              <div style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 12px; font-size: 10px; font-weight: bold; margin-bottom: 2px; white-space: nowrap; box-shadow: 0 2px 4px rgba(0,0,0,0.5);">
                ${d.sensors} Foyers
              </div>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="#ef4444" stroke="white" stroke-width="1.5" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3" fill="white"></circle>
              </svg>
              <div style="color: rgba(255,255,255,0.8); font-size: 8px; font-weight: 600; margin-top: 2px; text-shadow: 0 1px 2px black;">${d.country}</div>
            </div>
          `;
                    el.style.pointerEvents = 'none';
                    return el;
                }}
                htmlTransitionDuration={100}

                // Arcs (Connections)
                arcsData={COUNTRY_DATA.map(p => {
                    if (p.iso === "FRA") return null;
                    return { startLat: 46.2276, startLng: 2.2137, endLat: p.lat, endLng: p.lng };
                }).filter(Boolean)}
                arcColor={() => "rgba(239, 68, 68, 0.2)"}
                arcDashLength={0.4}
                arcDashGap={0.2}
                arcDashAnimateTime={2000}
                arcStroke={0.3}

                // Rings (Pings)
                ringsData={rings}
                ringColor={() => "#ef4444"}
                ringMaxRadius="maxRadius"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"
            />
        </div>
    );
};

export default SensorGlobe;
