import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, User, Radio } from 'lucide-react';
import '../styles/dashboard.css'; // Re-use dashboard styles for consistency

const Admin = () => {
    const [activeTab, setActiveTab] = useState('users'); // 'users' or 'sensors'
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    // Fetch data based on active tab
    const fetchData = async () => {
        setLoading(true);
        try {
            const endpoint = activeTab === 'users' ? 'users' : 'sensors';
            const res = await fetch(`http://localhost:3000/api/${endpoint}`);
            const result = await res.json();
            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            const endpoint = activeTab === 'users' ? 'users' : 'sensors';
            await fetch(`http://localhost:3000/api/${endpoint}/${id}`, {
                method: 'DELETE'
            });
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error deleting:", error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const endpoint = activeTab === 'users' ? 'users' : 'sensors';
            const method = editingItem ? 'PUT' : 'POST';
            const url = editingItem
                ? `http://localhost:3000/api/${endpoint}/${editingItem._id}`
                : `http://localhost:3000/api/${endpoint}`;

            await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            setShowModal(false);
            setFormData({});
            setEditingItem(null);
            fetchData();
        } catch (error) {
            console.error("Error saving:", error);
        }
    };

    const openModal = (item = null) => {
        setEditingItem(item);
        setFormData(item || {});
        setShowModal(true);
    };

    // Render Table Headers dynamically
    const renderTableHeaders = () => {
        if (activeTab === 'users') {
            return (
                <>
                    <th>ID</th>
                    <th>Location</th>
                    <th>Persons</th>
                    <th>Size (m²)</th>
                    <th>Actions</th>
                </>
            );
        } else {
            return (
                <>
                    <th>ID</th>
                    <th>Location</th>
                    <th>Creation Date</th>
                    <th>Gallery</th>
                    <th>Actions</th>
                </>
            );
        }
    };

    // Render Table Rows
    const renderTableRows = () => {
        return data.map((item) => (
            <tr key={item._id}>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{item._id}</td>
                <td>{item.location}</td>
                {activeTab === 'users' ? (
                    <>
                        <td>{item.personsInHouse}</td>
                        <td>{item.houseSize}</td>
                    </>
                ) : (
                    <>
                        <td>{item.creationDate}</td>
                        <td>{item.gallery ? item.gallery.length : 0} photos</td>
                    </>
                )}
                <td>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="icon-btn edit-btn" onClick={() => openModal(item)}>
                            <Edit size={16} />
                        </button>
                        <button className="icon-btn delete-btn" onClick={() => handleDelete(item._id)}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <div style={{ padding: '20px', color: '#f8fafc' }}>
            {/* Header section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Administration Panel</h2>

                {/* Tab Switcher */}
                <div style={{ display: 'flex', background: '#1e293b', borderRadius: '8px', padding: '4px' }}>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            display: 'flex', gap: '8px', alignItems: 'center',
                            padding: '8px 16px', borderRadius: '6px',
                            background: activeTab === 'users' ? '#3b82f6' : 'transparent',
                            color: activeTab === 'users' ? 'white' : '#94a3b8',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <User size={18} /> Users
                    </button>
                    <button
                        onClick={() => setActiveTab('sensors')}
                        style={{
                            display: 'flex', gap: '8px', alignItems: 'center',
                            padding: '8px 16px', borderRadius: '6px',
                            background: activeTab === 'sensors' ? '#3b82f6' : 'transparent',
                            color: activeTab === 'sensors' ? 'white' : '#94a3b8',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                        }}
                    >
                        <Radio size={18} /> Sensors
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Manage {activeTab === 'users' ? 'Users' : 'Sensors'}</h3>
                    <button
                        onClick={() => openModal()}
                        style={{
                            display: 'flex', gap: '8px', alignItems: 'center',
                            background: '#22c55e', color: 'white', border: 'none',
                            padding: '8px 16px', borderRadius: '6px', cursor: 'pointer',
                            fontWeight: '600'
                        }}
                    >
                        <Plus size={18} /> Add New
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                                {renderTableHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading data...</td></tr>
                            ) : (
                                renderTableRows()
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '24px', position: 'relative', background: '#0f172a' }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ marginBottom: '20px' }}>
                            {editingItem ? 'Edit' : 'Add New'} {activeTab === 'users' ? 'User' : 'Sensor'}
                        </h3>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Location</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.location || ''}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    style={{
                                        width: '100%', padding: '10px', borderRadius: '6px',
                                        border: '1px solid #334155', background: '#1e293b', color: 'white'
                                    }}
                                />
                            </div>

                            {activeTab === 'users' && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Persons in House</label>
                                        <input
                                            type="number"
                                            value={formData.personsInHouse || ''}
                                            onChange={e => setFormData({ ...formData, personsInHouse: Number(e.target.value) })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid #334155', background: '#1e293b', color: 'white'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>House Size (m²)</label>
                                        <input
                                            type="number"
                                            value={formData.houseSize || ''}
                                            onChange={e => setFormData({ ...formData, houseSize: Number(e.target.value) })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid #334155', background: '#1e293b', color: 'white'
                                            }}
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'sensors' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: '#94a3b8' }}>Creation Date (YYYY-MM-DD)</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 2025-01-15"
                                        value={formData.creationDate || ''}
                                        onChange={e => setFormData({ ...formData, creationDate: e.target.value })}
                                        style={{
                                            width: '100%', padding: '10px', borderRadius: '6px',
                                            border: '1px solid #334155', background: '#1e293b', color: 'white'
                                        }}
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                style={{
                                    marginTop: '8px', padding: '12px', borderRadius: '6px',
                                    background: '#3b82f6', color: 'white', border: 'none',
                                    fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                Save Changes
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
