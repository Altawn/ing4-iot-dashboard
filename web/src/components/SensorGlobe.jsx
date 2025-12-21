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

    const containerRef = useRef();
    const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

    useEffect(() => {
        if (containerRef.current) {
            setDimensions({
                width: containerRef.current.offsetWidth,
                height: containerRef.current.offsetHeight
            });
        }

        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.offsetHeight
                });
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        // Load World GeoJSON
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);

        // Ripple rings effect
        const interval = setInterval(() => {
            setRings(currentRings => {
                return countryData.map(loc => ({
                    lat: loc.lat,
                    lng: loc.lng,
                    maxR: 8,
                    propagationSpeed: 2.5,
                    repeatPeriod: 2500
                }));
            });
        }, 2500);

        return () => clearInterval(interval);
    }, [countryData]);

    useEffect(() => {
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.8;
            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.2 }, 0);
        }
    }, []);

    const htmlMarkers = useMemo(() => {
        return countryData.map(d => ({
            lat: d.lat,
            lng: d.lng,
            size: 15,
            color: '#fbbf24',
            html: `
                <div style="text-align: center; pointer-events: none;">
                    <div style="color: #fbbf24; font-size: 24px;">📍</div>
                    <div style="color: white; font-size: 11px; text-shadow: 0 0 4px #000; font-weight: bold;">${d.country}</div>
                </div>
            `
        }));
    }, [countryData]);

    return (
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#000' }}>
            <Globe
                ref={globeEl}
                width={dimensions.width}
                height={dimensions.height}
                globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
                backgroundImageUrl="https://unpkg.com/three-globe/example/img/night-sky.png"
                backgroundColor="rgba(0,0,0,0)"
                showAtmosphere={true}
                atmosphereColor="#6366f1"
                atmosphereAltitude={0.25}

                polygonsData={countries.features}
                polygonAltitude={0.02}
                polygonCapColor={d => {
                    const iso3 = d.properties.ISO_A3 || d.properties.ADM0_A3;
                    return activeIsoCodes.includes(iso3) ? 'rgba(99, 102, 241, 0.6)' : 'rgba(255, 255, 255, 0.05)';
                }}
                polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
                polygonStrokeColor={d => {
                    const iso3 = d.properties.ISO_A3 || d.properties.ADM0_A3;
                    return activeIsoCodes.includes(iso3) ? '#6366f1' : 'rgba(255, 255, 255, 0.1)';
                }}

                ringsData={rings}
                ringColor={() => ['#6366f1', 'rgba(99, 102, 241, 0)']}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"

                htmlElementsData={htmlMarkers}
                htmlElement={d => {
                    const el = document.createElement('div');
                    el.innerHTML = d.html;
                    el.style.pointerEvents = 'none';
                    return el;
                }}
            />
        </div>
    );
};

export default SensorGlobe;
