import React, { useEffect, useState, useRef, useMemo } from 'react';
import Globe from 'react-globe.gl';


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


    const activeIsoCodes = useMemo(() => {
        return countryData.map(c => c.iso);
    }, [countryData]);

    useEffect(() => {

        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);


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

            globeEl.current.controls().autoRotate = true;
            globeEl.current.controls().autoRotateSpeed = 0.5;


            globeEl.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 }, 0);
        }
    }, []);



    return (
        <div className="globe-container">
            <Globe
                ref={globeEl}
                width={800}
                height={400}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                backgroundColor="rgba(0,0,0,0)"


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


                ringsData={rings}
                ringColor={() => ['#ef4444', 'rgba(239, 68, 68, 0)']}
                ringMaxRadius="maxR"
                ringPropagationSpeed="propagationSpeed"
                ringRepeatPeriod="repeatPeriod"


                htmlElementsData={countryData}
                htmlElement={d => {
                    const el = document.createElement('div');
                    el.className = 'globe-marker';
                    el.innerHTML = `
                        <div class="globe-marker-icon">📍</div>
                        <div class="globe-marker-label">${d.country}</div>
                    `;
                    return el;
                }}


                atmosphereColor="#ef4444"
                atmosphereAltitude={0.15}
            />
        </div>
    );
};

export default SensorGlobe;
