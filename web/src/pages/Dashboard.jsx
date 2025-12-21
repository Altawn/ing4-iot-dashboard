import React, { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import SensorGlobe from '../components/SensorGlobe';
import ShoppingWidget from '../components/ShoppingWidget';
import SearchWidget from '../components/SearchWidget';
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
        // Fetching Real Dashboard Stats from MongoDB
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
                    <h1>IoT Dashboard</h1>
                    <p>Système de gestion des capteurs environnementaux</p>
                </div>
            </header>

            <div className="dashboard-grid">
                {/* Left Column */}
                <div className="col-main">
                    {/* Summary Cards - No curves */}
                    <div className="summary-cards">
                        <div className="card-item balance">
                            <div className="card-top">
                                <span className="card-label">Total Capteurs</span>
                                <span className="trend positive"><Radio size={14} /></span>
                            </div>
                            <div className="card-value">{stats.totalSensors}</div>
                        </div>

                        <div className="card-item sales">
                            <div className="card-top">
                                <span className="card-label">Total Utilisateurs</span>
                                <span className="trend positive"><User size={14} /></span>
                            </div>
                            <div className="card-value">{stats.totalUsers}</div>
                        </div>

                        <div className="card-item upgrade">
                            <div className="card-info">
                                <h3>{stats.totalMeasures}</h3>
                                <p>Mesures relevées au total sur le réseau</p>
                            </div>
                            <button className="btn-pro"><Zap size={14} style={{ marginRight: '6px' }} /> Actif</button>
                        </div>
                    </div>

                    {/* Sensor Type Pie and Location Bar Side by Side */}
                    <div className="secondary-charts-grid">
                        <Widget title="Types de Capteurs">
                            <div style={{ width: '100%', height: 250 }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={stats.sensorTypeData.length > 0 ? stats.sensorTypeData : [{ name: 'Chargement...', value: 1 }]}
                                            innerRadius={65}
                                            outerRadius={85}
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
                        </Widget>

                        <Widget title="Répartition par Ville">
                            <div style={{ width: '100%', height: 250 }}>
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
                        </Widget>
                    </div>

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

                    {/* Globe Widget */}
                    <Widget title="Couverture Mondiale">
                        <div style={{ width: '100%', height: '450px', position: 'relative' }}>
                            <SensorGlobe activeCountries={stats.activeCountries} />
                        </div>
                    </Widget>
                </div>

                {/* Right Column (Sidebar Widgets) */}
                <div className="col-side">
                    <MeasuresWidget />
                    <SearchWidget />
                    <ShoppingWidget />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
