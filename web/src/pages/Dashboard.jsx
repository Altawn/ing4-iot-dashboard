import React, { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import SensorGlobe from '../components/SensorGlobe';
import CombinedWidget from '../components/CombinedWidget';
import MeasuresWidget from '../components/MeasuresWidget';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    PieChart,
    Pie,
    AreaChart,
    Area,
    CartesianGrid,
    Legend
} from 'recharts';
import { User, Zap, Radio } from 'lucide-react';
import '../styles/dashboard.css';

const COLORS = ['#6366f1', '#818cf8', '#34d399', '#fbbf24', '#f472b6', '#f87171'];

const Dashboard = () => {
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

        fetch('http://localhost:3001/api/dashboard-stats')
            .then(res => res.json())
            .then(data => {
                setStats(data);
            })
            .catch(err => console.error("Stats API Error:", err));
    }, []);

    return (
        <div className="dashboard-view">
            {/* Top Header - No search bar anymore */}
            <header className="dashboard-header">
                <div className="header-titles">
                    <h1>Tableau de Bord IoT</h1>
                    <p>Système de gestion des capteurs environnementaux</p>
                </div>
            </header>

            <div className="dashboard-grid">
                {/* Left Column (Main Data) */}
                <div className="col-main">
                    {/* Statistics Widget */}
                    <Widget title="Statistiques du Réseau">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', padding: '8px 0' }}>
                            {/* Total Capteurs */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px',
                                background: '#dcfce7',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                color: '#111827'
                            }}>
                                <Radio size={24} style={{ marginBottom: '8px', opacity: 0.7 }} />
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>{stats.totalSensors}</div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Total Capteurs</div>
                            </div>

                            {/* Total Utilisateurs */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px',
                                background: '#fef9c3',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                color: '#111827'
                            }}>
                                <User size={24} style={{ marginBottom: '8px', opacity: 0.7 }} />
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>{stats.totalUsers}</div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Total Utilisateurs</div>
                            </div>

                            {/* Total Mesures */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                padding: '20px',
                                background: '#e0e7ff',
                                borderRadius: '16px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                color: '#111827'
                            }}>
                                <Zap size={24} style={{ marginBottom: '8px', opacity: 0.7 }} />
                                <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>{stats.totalMeasures}</div>
                                <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>Mesures Relevées</div>
                            </div>
                        </div>
                    </Widget>




                    {/* Globe Widget (Top of Main Column) */}
                    <Widget title="Couverture Mondiale">
                        <div style={{ width: '100%', height: '450px', position: 'relative', overflow: 'hidden', borderRadius: '16px' }}>
                            <SensorGlobe activeCountries={stats.activeCountries} />
                        </div>
                    </Widget>

                    {/* Combined Sensors Distribution Widget */}
                    <Widget title="Répartition des Capteurs">
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                            {/* Types de Capteurs - Pie Chart */}
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Types de Capteurs</h4>
                                <div style={{ width: '100%', height: 220 }}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={stats.sensorTypeData.length > 0 ? stats.sensorTypeData : [{ name: 'Chargement...', value: 1 }]}
                                                innerRadius={55}
                                                outerRadius={75}
                                                paddingAngle={8}
                                                dataKey="value"
                                            >
                                                {stats.sensorTypeData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                                            />
                                            <Legend verticalAlign="bottom" height={36} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Répartition par Pièces - Bar Chart */}
                            <div>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '12px', color: '#374151' }}>Par Pièces</h4>
                                <div style={{ width: '100%', height: 220 }}>
                                    <ResponsiveContainer>
                                        <BarChart data={stats.locationData}>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                                            <YAxis axisLine={false} tickLine={false} hide />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={30}>
                                                {stats.locationData.map((entry, index) => (
                                                    <Cell key={`bar-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </Widget>

                    {/* Activity Area Chart */}
                    <Widget title="Activité du Réseau (Capteurs par mois)">
                        <div style={{ width: '100%', height: 280, marginTop: '1rem' }}>
                            <ResponsiveContainer>
                                <AreaChart data={stats.creationHistory}>
                                    <defs>
                                        <linearGradient id="colorSensors" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="sensors"
                                        stroke="#6366f1"
                                        strokeWidth={3}
                                        fillOpacity={1}
                                        fill="url(#colorSensors)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </Widget>
                </div>

                {/* Right Column (Tools & Utilities) */}
                <div className="col-side">
                    <MeasuresWidget />
                    <CombinedWidget />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
