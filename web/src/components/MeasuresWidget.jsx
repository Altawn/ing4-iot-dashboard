import React, { useState, useEffect } from 'react';
import { User, MapPin, Grid, Activity } from 'lucide-react';
import Widget from './Widget';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const MeasuresWidget = () => {
    const [users, setUsers] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');
    const [availableLocations, setAvailableLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [availableTypes, setAvailableTypes] = useState([]);
    const [selectedType, setSelectedType] = useState('');
    const [measures, setMeasures] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const usersRes = await fetch('http://localhost:3001/api/users');
                const usersData = await usersRes.json();
                setUsers(usersData);

                const sensorsRes = await fetch('http://localhost:3001/api/sensors');
                const sensorsData = await sensorsRes.json();
                setSensors(sensorsData);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchData();
    }, []);


    useEffect(() => {
        if (!selectedUserId) {
            setAvailableLocations([]);
            setSelectedLocation('');
            setAvailableTypes([]);
            setSelectedType('');
            setMeasures([]);
            return;
        }


        const userSensors = sensors.filter(s => {
            const sensorUserId = s.userID?.$oid || s.userID;
            return sensorUserId === selectedUserId;
        });


        const locations = [...new Set(userSensors.map(s => s.location))].filter(Boolean);
        setAvailableLocations(locations);

        if (locations.length > 0) {
            setSelectedLocation(locations[0]);
        } else {
            setSelectedLocation('');
        }

        setAvailableTypes([]);
        setSelectedType('');
        setMeasures([]);
    }, [selectedUserId, sensors]);


    useEffect(() => {
        const fetchMeasuresForLocation = async () => {
            if (!selectedUserId || !selectedLocation) {
                setAvailableTypes([]);
                setSelectedType('');
                setMeasures([]);
                return;
            }

            setLoading(true);
            try {

                const sensor = sensors.find(s => {
                    const sensorUserId = s.userID?.$oid || s.userID;
                    return sensorUserId === selectedUserId && s.location === selectedLocation;
                });

                if (!sensor) {
                    setMeasures([]);
                    setAvailableTypes([]);
                    setSelectedType('');
                    setLoading(false);
                    return;
                }


                const res = await fetch(`http://localhost:3001/api/measures?sensorID=${sensor._id}`);
                const data = await res.json();

                const sortedData = data.reverse();
                setMeasures(sortedData);


                const types = [...new Set(sortedData.map(m => m.type))].filter(Boolean);
                setAvailableTypes(types);

                if (types.length > 0) {
                    setSelectedType(types[0]);
                } else {
                    setSelectedType('');
                }

            } catch (err) {
                console.error("Error fetching measures:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchMeasuresForLocation();
    }, [selectedUserId, selectedLocation, sensors]);


    const getUserDisplay = (user) => {
        const userId = user._id?.$oid || user._id;
        const country = user.location ? (user.location.charAt(0).toUpperCase() + user.location.slice(1)) : 'Unknown';
        return `${userId} - ${country}`;
    };


    const filteredMeasures = selectedType
        ? measures.filter(m => m.type === selectedType)
        : [];


    const chartData = filteredMeasures.map(m => ({
        date: new Date(m.creationDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
        fullDate: new Date(m.creationDate).toLocaleString(),
        value: Number(m.value),
        type: m.type
    }));


    let chartColor = '#8b5cf6'; // Default purple
    if (selectedType?.toLowerCase() === 'temperature') chartColor = '#ef4444';
    if (selectedType?.toLowerCase() === 'humidity') chartColor = '#3b82f6';
    if (selectedType?.toLowerCase() === 'airpollution') chartColor = '#10b981';

    return (
        <Widget title="Mesures par Capteur">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '15px' }}>

                {/* Controls Container */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                    {/* User Selector */}
                    <div style={{ position: 'relative' }}>
                        <User size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <select
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
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
                            <option value="">-- Sélectionner un utilisateur --</option>
                            {users.map(user => {
                                const userId = user._id?.$oid || user._id;
                                return (
                                    <option key={userId} value={userId}>
                                        {getUserDisplay(user)}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    {/* Location Selector (Only if user selected) */}
                    {selectedUserId && availableLocations.length > 0 && (
                        <div style={{ position: 'relative' }}>
                            <MapPin size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
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
                                {availableLocations.map(location => (
                                    <option key={location} value={location}>
                                        {location.charAt(0).toUpperCase() + location.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Type Selector (Only if location selected) */}
                    {selectedLocation && availableTypes.length > 0 && (
                        <div style={{ position: 'relative' }}>
                            <Grid size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
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
                                {availableTypes.map(type => (
                                    <option key={type} value={type}>
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {/* Chart Area */}
                <div style={{ flex: 1, minHeight: '200px', position: 'relative' }}>
                    {loading && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.7)', zIndex: 10 }}>
                            <p style={{ color: 'var(--text-secondary)' }}>Chargement...</p>
                        </div>
                    )}

                    {!loading && !selectedUserId && (
                        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', opacity: 0.6 }}>
                            <Activity size={48} style={{ marginBottom: '12px' }} />
                            <p style={{ textAlign: 'center' }}>Sélectionnez un utilisateur pour voir l'évolution.</p>
                        </div>
                    )}

                    {!loading && selectedUserId && availableLocations.length === 0 && (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>Aucun capteur trouvé pour cet utilisateur.</p>
                        </div>
                    )}

                    {!loading && selectedLocation && availableTypes.length === 0 && (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>Aucune mesure trouvée pour cette localisation.</p>
                        </div>
                    )}

                    {!loading && selectedType && chartData.length > 0 && (
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    labelStyle={{ color: '#6b7280', fontSize: '0.8rem', marginBottom: '4px' }}
                                    formatter={(value) => [value, selectedType === 'temperature' ? 'Température (°C)' : selectedType === 'humidity' ? 'Humidité (%)' : 'Valeur']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={chartColor}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </Widget>
    );
};

export default MeasuresWidget;
