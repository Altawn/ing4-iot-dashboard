import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Wind, Activity, Filter } from 'lucide-react';
import Widget from './Widget';

const MeasuresWidget = () => {
    const [sensors, setSensors] = useState([]);
    const [users, setUsers] = useState({});
    const [selectedSensor, setSelectedSensor] = useState('');
    const [measures, setMeasures] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch sensors and users on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Sensors
                const sensorsRes = await fetch('http://localhost:3001/api/sensors');
                const sensorsData = await sensorsRes.json();
                setSensors(sensorsData);

                // Fetch Users (to map countries)
                const usersRes = await fetch('http://localhost:3001/api/users');
                const usersData = await usersRes.json();

                // Map users by ID for easy lookup
                const userMap = {};
                usersData.forEach(user => {
                    const id = user._id?.$oid || user._id;
                    if (id) userMap[id] = user;
                });
                setUsers(userMap);

            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);

    // Fetch measures when sensor selection changes
    useEffect(() => {
        const fetchMeasures = async () => {
            if (!selectedSensor) {
                setMeasures([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`http://localhost:3001/api/measures?sensorID=${selectedSensor}`);
                const data = await res.json();
                setMeasures(data);
            } catch (err) {
                console.error("Error fetching measures:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeasures();
    }, [selectedSensor]);

    // Helper to get icon based on type
    const getIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'temperature': return <Thermometer size={18} color="#ef4444" />;
            case 'humidity': return <Droplets size={18} color="#3b82f6" />;
            case 'airpollution': return <Wind size={18} color="#8b5cf6" />;
            default: return <Activity size={18} color="var(--text-secondary)" />;
        }
    };

    // Helper to resolve country
    const getSensorCountry = (sensor) => {
        if (!sensor || !sensor.userID) return '';
        const uid = sensor.userID.$oid || sensor.userID;
        const user = users[uid];
        return user?.location ? (user.location.charAt(0).toUpperCase() + user.location.slice(1)) : 'Inconnu';
    };

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const selectedSensorObj = sensors.find(s => s._id === selectedSensor);

    return (
        <Widget title="Mesures par Capteur">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>

                {/* Sensor Selector */}
                <div style={{ position: 'relative' }}>
                    <Filter size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <select
                        value={selectedSensor}
                        onChange={(e) => setSelectedSensor(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 14px 12px 38px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: '#f9f9f7',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem',
                            outline: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">-- Sélectionner un capteur --</option>
                        {sensors.map(sensor => (
                            <option key={sensor._id} value={sensor._id}>
                                {sensor.location} - {getSensorCountry(sensor)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Country Indicator (If selected) */}
                {selectedSensorObj && (
                    <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 8px',
                        background: 'var(--card-balance)',
                        borderRadius: '8px',
                        width: 'fit-content'
                    }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></span>
                        Localisation : <span style={{ color: '#065f46', fontWeight: '600' }}>{getSensorCountry(selectedSensorObj)}</span>
                    </div>
                )}

                {/* Measures List */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    paddingRight: '4px'
                }}>
                    {loading && <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Chargement...</p>}

                    {!loading && selectedSensor && measures.length === 0 && (
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>Aucune mesure trouvée.</p>
                    )}

                    {!loading && !selectedSensor && (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '40px', opacity: 0.6 }}>
                            <Activity size={48} style={{ marginBottom: '12px', display: 'block', margin: '0 auto' }} />
                            <p>Sélectionnez un capteur pour analyser les données en temps réel.</p>
                        </div>
                    )}

                    {measures.map((measure, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '12px 16px',
                            background: '#f9f9f7',
                            borderRadius: '16px',
                            border: '1px solid var(--border-color)',
                            transition: 'all 0.2s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    padding: '6px',
                                    borderRadius: '50%',
                                    background: 'var(--bg-primary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {getIcon(measure.type)}
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: '500', textTransform: 'capitalize' }}>
                                        {measure.type}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        {formatDate(measure.creationDate)}
                                    </div>
                                </div>
                            </div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                {measure.value}
                                <span style={{ fontSize: '0.8rem', marginLeft: '2px', color: 'var(--text-secondary)' }}>
                                    {measure.type === 'temperature' ? '°C' : measure.type === 'humidity' ? '%' : ''}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Widget>
    );
};

export default MeasuresWidget;
