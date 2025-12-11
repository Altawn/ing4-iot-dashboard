import React, { useEffect, useState } from 'react';
import Widget from '../components/Widget';
import SensorGlobe from '../components/SensorGlobe';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Cloud, Wind, Droplets, User, Radio, AlertTriangle } from 'lucide-react';
import '../styles/dashboard.css';

const data = [
    { name: 'Mon', sensors: 4000, active: 2400 },
    { name: 'Tue', sensors: 3000, active: 1398 },
    { name: 'Wed', sensors: 2000, active: 9800 },
    { name: 'Thu', sensors: 2780, active: 3908 },
    { name: 'Fri', sensors: 1890, active: 4800 },
    { name: 'Sat', sensors: 2390, active: 3800 },
    { name: 'Sun', sensors: 3490, active: 4300 },
];

const Dashboard = () => {
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        // Mocking Weather API call
        setTimeout(() => {
            setWeather({
                temp: 22,
                city: 'Paris',
                condition: 'Cloudy'
            });
        }, 1000);
    }, []);

    return (
        <div className="dashboard-grid">
            {/* Widget 1: Total Sensors */}
            <Widget className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon-bg">
                        <Radio size={24} color="#38bdf8" />
                    </div>
                    <div>
                        <p className="stat-label">Total Sensors</p>
                        <h4 className="stat-value">1,234</h4>
                    </div>
                </div>
            </Widget>

            {/* Widget 2: Active Users */}
            <Widget className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon-bg" style={{ background: 'rgba(168, 85, 247, 0.1)' }}>
                        <User size={24} color="#a855f7" />
                    </div>
                    <div>
                        <p className="stat-label">Active Users</p>
                        <h4 className="stat-value">856</h4>
                    </div>
                </div>
            </Widget>

            {/* Widget 3: Alerts */}
            <Widget className="stat-card">
                <div className="stat-content">
                    <div className="stat-icon-bg" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                        <AlertTriangle size={24} color="#ef4444" />
                    </div>
                    <div>
                        <p className="stat-label">System Alerts</p>
                        <h4 className="stat-value">3</h4>
                    </div>
                </div>
            </Widget>

            {/* Widget 4: Weather (External API) */}
            <Widget title="Local Weather" className="weather-widget">
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
                    </div>
                ) : (
                    <p>Loading weather...</p>
                )}
            </Widget>

            {/* Widget 5: Main Chart (Graph) */}
            <Widget title="Sensor Activity" fullWidth className="chart-widget">
                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer>
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
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
                            <Area type="monotone" dataKey="active" stroke="#38bdf8" fillOpacity={1} fill="url(#colorActive)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </Widget>

            {/* Widget 6: Live Global Coverage */}
            <Widget title="Live Global Coverage" fullWidth className="globe-widget">
                <SensorGlobe />
            </Widget>
        </div>
    );
};

export default Dashboard;
