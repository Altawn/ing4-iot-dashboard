import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Loader, ExternalLink } from 'lucide-react';
import Widget from './Widget';
import '../styles/shopping.css';

const ShoppingWidget = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchShopping = async (searchQuery) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(false);
        setHasSearched(true);
        try {
            const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(searchQuery)}&type=shopping`);
            const data = await res.json();

            if (data.shopping_results) {
                setResults(data.shopping_results);
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // No initial fetch, wait for user input

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchShopping(query);
    };

    return (
        <Widget title="Marketplace Composants">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
                <form onSubmit={handleSubmit} className="shopping-search-bar">
                    <input
                        type="text"
                        placeholder="Rechercher des composants..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            fontSize: '0.9rem'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Search size={18} />
                    </button>
                </form>

                <div className="widget-content" style={{ overflowY: 'auto', paddingRight: '4px' }}>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                            <Loader className="spin" size={32} />
                        </div>
                    ) : error ? (
                        <div style={{ padding: '20px', color: '#ef4444', textAlign: 'center' }}>
                            Erreur de chargement des prix.
                        </div>
                    ) : !hasSearched ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <ShoppingBag size={32} style={{ opacity: 0.5 }} />
                            <p style={{ fontSize: '0.9rem' }}>Lancez une recherche pour comparer les prix des composants.</p>
                        </div>
                    ) : results.length === 0 ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                            Aucun produit trouvé.
                        </div>
                    ) : (
                        <div className="shopping-grid">
                            {results.slice(0, 6).map((item, index) => (
                                <a
                                    key={index}
                                    href={item.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shopping-card"
                                >
                                    <div className="shopping-image-container">
                                        <img src={item.thumbnail} alt={item.title} className="shopping-image" />
                                    </div>
                                    <div className="shopping-details">
                                        <div className="shopping-title" title={item.title}>{item.title}</div>
                                        <div className="shopping-price">{item.price}</div>
                                        <div className="shopping-source">{item.source}</div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Widget>
    );
};

export default ShoppingWidget;
