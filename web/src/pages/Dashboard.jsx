import React, { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import SensorGlobe from '../components/SensorGlobe';
import ShoppingWidget from '../components/ShoppingWidget';
import SearchWidget from '../components/SearchWidget';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar } from 'recharts';
import { Cloud, Wind, Droplets, User, Radio, MapPin } from 'lucide-react';
import '../styles/dashboard.css';

const COLORS = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#f87171'];

const Dashboard = () => {
    const [weather, setWeather] = useState(null);
    const [stats, setStats] = useState({
        totalSensors: 0,
        totalUsers: 0,
        totalMeasures: 0,
        sensorTypeData: [],
        locationData: [],
        creationHistory: [],
        activeCountries: []
    });

    useEffect(() => {
        // Mocking Weather API call
        setTimeout(() => {
            setWeather({
                temp: 22,
                city: 'Paris',
                condition: 'Nuageux'
            });
        }, 1000);

        // Fetching Real Dashboard Stats from MongoDB
        fetch('http://localhost:3001/api/dashboard-stats')
            .then(res => res.json())
            .then(data => {
                console.log('Dashboard stats:', data);
                setStats(data);
            })
            .catch(err => console.error("Stats API Error:", err));
    }, []);

    return (
        <div className="dashboard-grid">
            {/* Widget 1: Sensor Types (Pie Chart) */}
            <Widget title={`Types de Capteurs (${stats.totalMeasures} mesures)`} className="stat-card">
                <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={stats.sensorTypeData.length > 0 ? stats.sensorTypeData : [{ name: 'Chargement...', value: 1 }]}
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {stats.sensorTypeData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '12px' }}>{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </Widget>

            {/* Widget 2: Total Users */}
            <Widget title="Total Utilisateurs" className="stat-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '15px' }}>
                    <h4 className="stat-value" style={{ fontSize: '3.5rem', fontWeight: '800', color: '#a855f7', lineHeight: 1 }}>{stats.totalUsers}</h4>
                    <div className="stat-icon-bg" style={{ background: 'rgba(168, 85, 247, 0.1)', width: '56px', height: '56px', borderRadius: '16px' }}>
                        <User size={32} color="#a855f7" />
                    </div>
                </div>
            </Widget>

            {/* Widget 3: Sensors by Location (Bar Chart) */}
            <Widget title="Capteurs par Localisation" className="stat-card">
                <div style={{ width: '100%', height: 200 }}>
                    <ResponsiveContainer>
                        <BarChart data={stats.locationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis
                                dataKey="name"
                                stroke="#94a3b8"
                                tick={{ fontSize: 11 }}
                                angle={-45}
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Bar dataKey="value" fill="#38bdf8" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Widget>

            {/* Widget 4: Weather (External API) */}
            <Widget title="Météo Locale" className="weather-widget">
                {weather ? (
                    <div className="weather-content">
                        <div className="weather-main">
                            <Cloud size={48} className="weather-icon" />
                            <span className="temp">{weather.temp}°C</span>
                        </div>
                        <div className="weather-details">
                            <div className="detail-item">
                                <Wind size={16} /> <span>12 km/h</span>
                            </div>
                            <div className="detail-item">
                                <Droplets size={16} /> <span>45%</span>
                            </div>
                        </div>
                        <p className="city-name">{weather.city}</p>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>{weather.condition}</p>
                    </div>
                ) : (
                    <p>Chargement météo...</p>
                )}
            </Widget>

            {/* Widget 5a: Assistant (Search) */}
            <SearchWidget />

            {/* Widget 5b: Marketplace (Shopping) */}
            <ShoppingWidget />

            {/* Widget 6: Sensor Activity Over Time (Area Chart) */}
            <Widget title="Activité Capteurs (Nouveaux par Mois)" fullWidth className="chart-widget">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={stats.creationHistory}>
                            <defs>
                                <linearGradient id="colorSensors" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                            <XAxis dataKey="name" stroke="#94a3b8" />
                            <YAxis stroke="#94a3b8" />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                itemStyle={{ color: '#f8fafc' }}
                            />
                            <Area type="monotone" dataKey="sensors" stroke="#38bdf8" fillOpacity={1} fill="url(#colorSensors)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Widget>

            {/* Widget 7: Live Global Coverage */}
            <Widget title="Couverture Mondiale" fullWidth className="globe-widget">
                <SensorGlobe activeCountries={stats.activeCountries} />
            </Widget>
        </div>
    );
};

export default Dashboard;
