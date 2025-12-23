import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Plus, X, User, Radio, Activity } from 'lucide-react';
import '../styles/dashboard.css'; // Re-use dashboard styles for consistency

const Admin = () => {
    const [activeTab, setActiveTab] = useState('users');
    const [data, setData] = useState([]);
    const [users, setUsers] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});


    const fetchUsers = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/users');
            const result = await res.json();
            setUsers(result);
        } catch (error) {
            console.error("Error fetching users:", error);
        }
    };


    const fetchSensors = async () => {
        try {
            const res = await fetch('http://localhost:3001/api/sensors');
            const result = await res.json();
            setSensors(result);
        } catch (error) {
            console.error("Error fetching sensors:", error);
        }
    };


    const fetchData = async () => {
        setLoading(true);
        try {
            let endpoint;
            if (activeTab === 'users') endpoint = 'users';
            else if (activeTab === 'sensors') endpoint = 'sensors';
            else endpoint = 'measures';
            const res = await fetch(`http://localhost:3001/api/${endpoint}`);
            const result = await res.json();
            if (Array.isArray(result)) {
                setData(result);
            } else {
                console.error("Expected array but got:", result);
                setData([]);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        fetchUsers();
        fetchSensors();
    }, [activeTab]);

    const handleDelete = async (id) => {
        if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?")) return;
        try {
            // Extract actual ID value (handle both string and {$oid: "..."} format)
            const actualId = id?.$oid || id;

            let endpoint;
            if (activeTab === 'users') endpoint = 'users';
            else if (activeTab === 'sensors') endpoint = 'sensors';
            else endpoint = 'measures';

            await fetch(`http://localhost:3001/api/${endpoint}/${actualId}`, {
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
            let endpoint;
            if (activeTab === 'users') endpoint = 'users';
            else if (activeTab === 'sensors') endpoint = 'sensors';
            else endpoint = 'measures';
            const method = editingItem ? 'PUT' : 'POST';
            const url = editingItem
                ? `http://localhost:3001/api/${endpoint}/${editingItem._id}`
                : `http://localhost:3001/api/${endpoint}`;

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


    const renderTableHeaders = () => {
        if (activeTab === 'users') {
            return (
                <>
                    <th>ID</th>
                    <th>Localisation</th>
                    <th>Personnes</th>
                    <th>Taille (m²)</th>
                    <th>Actions</th>
                </>
            );
        } else if (activeTab === 'sensors') {
            return (
                <>
                    <th>ID</th>
                    <th>Localisation</th>
                    <th>Date Création</th>
                    <th>Actions</th>
                </>
            );
        } else {
            return (
                <>
                    <th>ID</th>
                    <th>Type</th>
                    <th>Valeur</th>
                    <th>ID Capteur</th>
                    <th>Actions</th>
                </>
            );
        }
    };


    const safeRender = (value) => {
        if (value === null || value === undefined) return '';
        if (typeof value === 'object') return JSON.stringify(value);
        return value;
    };


    const renderTableRows = () => {
        return data.map((item) => {

            const actualId = item._id?.$oid || item._id;

            return (
                <tr key={actualId}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{safeRender(item._id)}</td>
                    {activeTab !== 'measures' && <td>{safeRender(item.location)}</td>}
                    {activeTab === 'users' ? (
                        <>
                            <td>{safeRender(item.personsInHouse)}</td>
                            <td>{safeRender(item.houseSize)}</td>
                        </>
                    ) : activeTab === 'sensors' ? (
                        <>
                            <td>{safeRender(item.creationDate)}</td>
                        </>
                    ) : (
                        <>
                            <td>{safeRender(item.type)}</td>
                            <td>{safeRender(item.value)}</td>
                            <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>{safeRender(item.sensorID)}</td>
                        </>
                    )}
                    <td>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="icon-btn edit-btn" onClick={() => openModal(item)}>
                                <Edit size={16} />
                            </button>
                            <button className="icon-btn delete-btn" onClick={() => handleDelete(actualId)}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </td>
                </tr>
            )
        });
    };

    return (
        <div style={{ padding: '20px', color: 'var(--text-primary)' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Panneau d'Administration</h2>


                <div style={{ display: 'flex', background: 'var(--bg-card)', borderRadius: '12px', padding: '6px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                    <button
                        onClick={() => setActiveTab('users')}
                        style={{
                            display: 'flex', gap: '8px', alignItems: 'center',
                            padding: '10px 20px', borderRadius: '8px',
                            background: activeTab === 'users' ? '#6366f1' : 'transparent',
                            color: activeTab === 'users' ? 'white' : 'var(--text-secondary)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                            fontWeight: '600'
                        }}
                    >
                        <User size={18} /> Utilisateurs
                    </button>
                    <button
                        onClick={() => setActiveTab('sensors')}
                        style={{
                            display: 'flex', gap: '8px', alignItems: 'center',
                            padding: '10px 20px', borderRadius: '8px',
                            background: activeTab === 'sensors' ? '#6366f1' : 'transparent',
                            color: activeTab === 'sensors' ? 'white' : 'var(--text-secondary)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                            fontWeight: '600'
                        }}
                    >
                        <Radio size={18} /> Capteurs
                    </button>
                    <button
                        onClick={() => setActiveTab('measures')}
                        style={{
                            display: 'flex', gap: '8px', alignItems: 'center',
                            padding: '10px 20px', borderRadius: '8px',
                            background: activeTab === 'measures' ? '#6366f1' : 'transparent',
                            color: activeTab === 'measures' ? 'white' : 'var(--text-secondary)',
                            border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                            fontWeight: '600'
                        }}
                    >
                        <Activity size={18} /> Mesures
                    </button>
                </div>
            </div>


            <div className="glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h3>Gestion {activeTab === 'users' ? 'Utilisateurs' : activeTab === 'sensors' ? 'Capteurs' : 'Mesures'}</h3>
                    <button
                        onClick={() => openModal()}
                        style={{
                            display: 'flex', gap: '8px', alignItems: 'center',
                            background: '#6366f1', color: 'white', border: 'none',
                            padding: '10px 20px', borderRadius: '10px', cursor: 'pointer',
                            fontWeight: '600', boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
                        }}
                    >
                        <Plus size={18} /> Ajouter
                    </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                                {renderTableHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Chargement des données...</td></tr>
                            ) : (
                                renderTableRows()
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-panel" style={{ width: '400px', padding: '24px', position: 'relative', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                        <button
                            onClick={() => setShowModal(false)}
                            style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
                        >
                            <X size={24} />
                        </button>

                        <h3 style={{ marginBottom: '20px' }}>
                            {editingItem ? 'Modifier' : 'Ajouter'} {activeTab === 'users' ? 'Utilisateur' : activeTab === 'sensors' ? 'Capteur' : 'Mesure'}
                        </h3>

                        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {activeTab !== 'measures' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Localisation</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location || ''}
                                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                                        style={{
                                            width: '100%', padding: '10px', borderRadius: '6px',
                                            border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                                        }}
                                    />
                                </div>
                            )}

                            {activeTab === 'sensors' && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Date de Création</label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.creationDate || ''}
                                            onChange={e => setFormData({ ...formData, creationDate: e.target.value })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>ID Utilisateur (Propriétaire)</label>
                                        <select
                                            required
                                            value={formData.userID || ''}
                                            onChange={e => setFormData({ ...formData, userID: e.target.value })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                                            }}
                                        >
                                            <option value="">-- Sélectionner Utilisateur --</option>
                                            {users.map(user => {
                                                const userId = user._id?.$oid || user._id;
                                                const userLocation = user.location ? (user.location.charAt(0).toUpperCase() + user.location.slice(1)) : 'Inconnu';
                                                return (
                                                    <option key={userId} value={userId}>
                                                        {userLocation} - {user.personsInHouse} personne(s)
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </>
                            )}

                            {activeTab === 'users' && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Personnes dans la maison</label>
                                        <input
                                            type="number"
                                            value={formData.personsInHouse || ''}
                                            onChange={e => setFormData({ ...formData, personsInHouse: Number(e.target.value) })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Taille Maison</label>
                                        <select
                                            value={formData.houseSize || 'small'}
                                            onChange={e => setFormData({ ...formData, houseSize: e.target.value })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                                            }}
                                        >
                                            <option value="small">Petit</option>
                                            <option value="medium">Moyen</option>
                                            <option value="big">Grand</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {activeTab === 'measures' && (
                                <>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Type</label>
                                        <input
                                            type="text"
                                            placeholder="ex: temperature"
                                            value={formData.type || ''}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Valeur</label>
                                        <input
                                            type="text"
                                            value={formData.value || ''}
                                            onChange={e => setFormData({ ...formData, value: e.target.value })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>ID Capteur</label>
                                        <select
                                            required
                                            value={formData.sensorID || ''}
                                            onChange={e => setFormData({ ...formData, sensorID: e.target.value })}
                                            style={{
                                                width: '100%', padding: '10px', borderRadius: '6px',
                                                border: '1px solid var(--border-color)', background: 'var(--bg-secondary)', color: 'var(--text-primary)'
                                            }}
                                        >
                                            <option value="">-- Sélectionner Capteur --</option>
                                            {sensors.map(sensor => {
                                                const sensorId = sensor._id?.$oid || sensor._id;
                                                const sensorLocation = sensor.location ? (sensor.location.charAt(0).toUpperCase() + sensor.location.slice(1)) : 'Inconnu';
                                                return (
                                                    <option key={sensorId} value={sensorId}>
                                                        {sensorLocation} ({sensor.creationDate})
                                                    </option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                style={{
                                    marginTop: '8px', padding: '14px', borderRadius: '10px',
                                    background: '#6366f1', color: 'white', border: 'none',
                                    fontWeight: 'bold', cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(99, 102, 241, 0.3)'
                                }}
                            >
                                Sauvegarder
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;
