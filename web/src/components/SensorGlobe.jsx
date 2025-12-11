import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';

// Map country names from DB to coordinates
const COUNTRY_MAPPING = {
    'ethiopia': { lat: 9.145, lng: 40.489673, iso: 'ETH' },
    'czech republic': { lat: 49.817492, lng: 15.472962, iso: 'CZE' },
    'italy': { lat: 41.871940, lng: 12.56738, iso: 'ITA' },
    'greece': { lat: 39.074208, lng: 21.824312, iso: 'GRC' },
    'china': { lat: 35.86166, lng: 104.195397, iso: 'CHN' },
    'poland': { lat: 51.919438, lng: 19.145136, iso: 'POL' },
    'thailand': { lat: 15.870032, lng: 100.992541, iso: 'THA' },
    'morocco': { lat: 31.791702, lng: -7.09262, iso: 'MAR' },
    'malaysia': { lat: 4.210484, lng: 101.975766, iso: 'MYS' },
    'slovenia': { lat: 46.151241, lng: 14.995463, iso: 'SVN' },
    'philippines': { lat: 12.879721, lng: 121.774017, iso: 'PHL' },
    'mexico': { lat: 23.634501, lng: -102.552784, iso: 'MEX' },
    'ecuador': { lat: -1.831239, lng: -78.183406, iso: 'ECU' },
    'albania': { lat: 41.153332, lng: 20.168331, iso: 'ALB' },
    'japan': { lat: 36.204824, lng: 138.252924, iso: 'JPN' },
    'peru': { lat: -9.189967, lng: -75.015152, iso: 'PER' },
    'russia': { lat: 61.52401, lng: 105.318756, iso: 'RUS' }
};

const SensorGlobe = ({ activeCountries = [] }) => {
    const globeEl = useRef();
    const [countries, setCountries] = useState({ features: [] });
    const [rings, setRings] = useState([]);

    // Convert activeCountries to coordinate data
    const countryData = useMemo(() => {
        return activeCountries
            .map(country => {
                const normalized = country.toLowerCase();
                const mapping = COUNTRY_MAPPING[normalized];
                if (mapping) {
                    return {
                        lat: mapping.lat,
                        lng: mapping.lng,
                        country: country,
                        iso: mapping.iso
                    };
                }
                return null;
            })
            .filter(Boolean);
    }, [activeCountries]);

    // Active ISO codes for highlighting
    const activeIsoCodes = useMemo(() => {
        return countryData.map(c => c.iso);
    }, [countryData]);

    useEffect(() => {
        // Load World GeoJSON
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);

        // Create ripple rings effect (Red Pings)
        const interval = setInterval(() => {
            setRings(currentRings => {
                const newRings = countryData.map(loc => ({
                    lat: loc.lat,
                    lng: loc.lng,
                    maxR: 6,
                    propagationSpeed: 2,
                    repeatPeriod: 2000
                }));
                return newRings;
            });
        }, 2000);

        return () => clearInterval(interval);
    }, [countryData]);

    useEffect(() => {
        if (globeEl.current) {
            // Auto-rotate
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;

            // Start centered on world view
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
        }
    }, []);

    // Custom HTML markers (Pins)
    const htmlMarkers = useMemo(() => {
        return countryData.map(d => ({
            lat: d.lat,
            lng: d.lng,
            size: 15,
            color: '#ef4444',
            html: `
                <div style="
                    color: #ef4444;
                    font-weight: bold;
                    font-size: 24px;
                    text-align: center;
                    pointer-events: none;
                    text-shadow: 0 0 4px rgba(0,0,0,0.8);
                ">📍</div>
                <div style="
                    color: white;
                    font-size: 10px;
                    text-align: center;
                    margin-top: -5px;
                    pointer-events: none;
                    text-shadow: 0 0 3px rgba(0,0,0,0.9);
                    font-weight: 600;
                ">${d.country}</div>
            `
        }));
    }, [countryData]);

    return (
        <div style={{
            width: '100%',
            height: '400px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Globe
                ref={globeEl}
                width={800}
                height={400}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundColor="rgba(0,0,0,0)"

                // Country Polygons with Red Highlight
                polygonsData={countries.features}
                polygonAltitude={0.01}
                polygonCapColor={d => {
                    const iso3 = d.properties.ISO_A3 || d.properties.ADM0_A3;
                    return activeIsoCodes.includes(iso3) ? 'rgba(239, 68, 68, 0.3)' : 'rgba(100, 100, 100, 0.1)';
                }}
                polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
                polygonStrokeColor={d => {
                    const iso3 = d.properties.ISO_A3 || d.properties.ADM0_A3;
                    return activeIsoCodes.includes(iso3) ? '#ef4444' : '#333';
                }}
                polygonLabel={() => ''}

                // Red Pings (Ripple Rings)
                ringsData={rings}
                ringColor={() => ['#ef4444', 'rgba(239, 68, 68, 0)']}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"

                // Custom HTML Markers (Red Pins with Labels)
                htmlElementsData={htmlMarkers}
                htmlElement={d => {
                    const el = document.createElement('div');
                    el.innerHTML = d.html;
                    el.style.pointerEvents = 'none';
                    return el;
                }}

                // Atmosphere styling (Red glow)
                atmosphereColor="#ef4444"
                atmosphereAltitude={0.15}
            />
        </div>
    );
};

export default SensorGlobe;
