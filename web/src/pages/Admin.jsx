import React from 'react';
import Widget from '../components/Widget';
import { Database, Plus, Trash2, Edit2 } from 'lucide-react';

const Admin = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Widget title="Database Management" fullWidth>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    Manage your Users, Sensors and Measures here.
                </p>

                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <button style={{
                        background: 'var(--accent-color)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontWeight: '600'
                    }}>
                        <Plus size={18} /> Add New Sensor
                    </button>
                </div>

                {/* Placeholder Table */}
                <div className="glass-panel" style={{ overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                            <tr>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>ID</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Type</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Location</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
                                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>#SNS-001</td>
                                <td style={{ padding: '1rem' }}>Temperature</td>
                                <td style={{ padding: '1rem' }}>Living Room</td>
                                <td style={{ padding: '1rem', color: '#4ade80' }}>Active</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button style={{ padding: '4px' }}><Edit2 size={16} color="var(--accent-color)" /></button>
                                    <button style={{ padding: '4px' }}><Trash2 size={16} color="#ef4444" /></button>
                                </td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                <td style={{ padding: '1rem' }}>#SNS-002</td>
                                <td style={{ padding: '1rem' }}>Humidity</td>
                                <td style={{ padding: '1rem' }}>Kitchen</td>
                                <td style={{ padding: '1rem', color: '#fbbf24' }}>Warning</td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button style={{ padding: '4px' }}><Edit2 size={16} color="var(--accent-color)" /></button>
                                    <button style={{ padding: '4px' }}><Trash2 size={16} color="#ef4444" /></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Widget>
        </div>
    );
};

export default Admin;
