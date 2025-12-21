import React, { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import SensorGlobe from '../components/SensorGlobe';
import ShoppingWidget from '../components/ShoppingWidget';
import SearchWidget from '../components/SearchWidget';
import MeasuresWidget from '../components/MeasuresWidget';
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
        <div className="dashboard-container">
            {/* ========== MAIN CONTENT AREA (Left - Scrollable) ========== */}
            <div className="dashboard-main">

                {/* Widget 1: Type de capteur */}
                <Widget title="Types de Capteurs" className="compact">
                    <div style={{ width: '100%', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={stats.sensorTypeData.length > 0 ? stats.sensorTypeData : [{ name: 'Chargement...', value: 1 }]}
                                    innerRadius={35}
                                    outerRadius={55}
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
                                    height={24}
                                    iconSize={10}
                                    formatter={(value) => <span style={{ color: '#94a3b8', fontSize: '11px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Widget>

                {/* Widget 2: Total utilisateurs */}
                <Widget title="Total Utilisateurs" className="compact">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'row', gap: '15px' }}>
                        <h4 className="stat-value" style={{ fontSize: '3rem', fontWeight: '800', color: '#a855f7', lineHeight: 1 }}>{stats.totalUsers}</h4>
                        <div className="stat-icon-bg" style={{ background: 'rgba(168, 85, 247, 0.1)', width: '48px', height: '48px', borderRadius: '12px' }}>
                            <User size={28} color="#a855f7" />
                        </div>
                    </div>
                </Widget>

                {/* Widget 3: Capteurs par localisation */}
                <Widget title="Capteurs par Localisation" className="compact">
                    <div style={{ width: '100%', height: 160 }}>
                        <ResponsiveContainer>
                            <BarChart data={stats.locationData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis
                                    dataKey="name"
                                    stroke="#94a3b8"
                                    tick={{ fontSize: 9 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={45}
                                />
                                <YAxis stroke="#94a3b8" tick={{ fontSize: 9 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                                    itemStyle={{ color: '#f8fafc' }}
                                />
                                <Bar dataKey="value" fill="#38bdf8" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Widget>

                {/* Widget 5: Activité Capteurs (Large) */}
                <Widget title="Activité Capteurs (Nouveaux par Mois)" className="large chart-widget">
                    <div style={{ width: '100%', height: 280 }}>
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

                {/* Widget 7: Couverture Mondiale (Large) */}
                <Widget title="Couverture Mondiale" className="large globe-widget">
                    <SensorGlobe activeCountries={stats.activeCountries} />
                </Widget>

            </div>

            {/* ========== SIDEBAR (Right - Sticky/Fixed) ========== */}
            <div className="dashboard-sidebar">

                {/* Widget 4: Mesures par capteur */}
                <MeasuresWidget />

                {/* Widget 6: Assistant connecté */}
                <SearchWidget />

                {/* Widget 8: Marketplace Composant */}
                <ShoppingWidget />

            </div>
        </div>
    );
};

export default Dashboard;
