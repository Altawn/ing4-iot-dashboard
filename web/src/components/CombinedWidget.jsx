import React, { useState } from 'react';
import { Search, ShoppingBag, ExternalLink, Loader } from 'lucide-react';
import Widget from './Widget';
import '../styles/shopping.css';

const CombinedWidget = () => {
    const [mode, setMode] = useState('assistant'); // 'assistant' or 'marketplace'
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(false);
        setResults(null);
        setHasSearched(true);

        try {
            const endpoint = mode === 'marketplace'
                ? `http://localhost:3001/api/search?q=${encodeURIComponent(query)}&type=shopping`
                : `http://localhost:3001/api/search?q=${encodeURIComponent(query)}`;

            const res = await fetch(endpoint);
            const data = await res.json();

            if (data.error) throw new Error(data.error);
            setResults(data);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    // Reset when mode changes
    const handleModeChange = (newMode) => {
        setMode(newMode);
        setQuery('');
        setResults(null);
        setError(false);
        setHasSearched(false);
    };

    // Render Assistant Content
    const renderAssistantContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                    <Loader className="spin" size={24} />
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ padding: '10px', color: '#ef4444', textAlign: 'center', fontSize: '0.9rem' }}>
                    Erreur lors de la recherche. Vérifiez votre connexion API.
                </div>
            );
        }

        if (!results) return null;

        // Try Featured Snippet (Answer Box)
        if (results.answer_box) {
            return (
                <div style={{
                    padding: '16px',
                    background: 'var(--card-upgrade)',
                    borderLeft: '4px solid #6366f1',
                    borderRadius: '12px',
                    marginBottom: '10px'
                }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#6366f1', marginBottom: '4px', fontWeight: 'bold' }}>Réponse Rapide</h4>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.4', wordBreak: 'break-word', color: '#111827' }}>{results.answer_box.snippet || results.answer_box.answer}</p>
                </div>
            );
        }

        // Fallback to First Organic Result
        if (results.organic_results && results.organic_results.length > 0) {
            const first = results.organic_results[0];
            return (
                <div style={{ padding: '8px 0' }}>
                    <a href={first.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                        <h4 style={{ color: '#6366f1', fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
                            {first.title} <ExternalLink size={12} />
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', wordBreak: 'break-word' }}>{first.snippet}</p>
                    </a>
                </div>
            );
        }

        return <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Aucun résultat pertinent trouvé.</p>;
    };

    // Render Marketplace Content
    const renderMarketplaceContent = () => {
        if (loading) {
            return (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    <Loader className="spin" size={32} />
                </div>
            );
        }

        if (error) {
            return (
                <div style={{ padding: '20px', color: '#ef4444', textAlign: 'center' }}>
                    Erreur de chargement des prix.
                </div>
            );
        }

        if (!hasSearched) {
            return (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                    <ShoppingBag size={32} style={{ opacity: 0.5 }} />
                    <p style={{ fontSize: '0.9rem' }}>Lancez une recherche pour comparer les prix des composants.</p>
                </div>
            );
        }

        const shoppingResults = results?.shopping_results || [];

        if (shoppingResults.length === 0) {
            return (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>
                    Aucun produit trouvé.
                </div>
            );
        }

        return (
            <div className="shopping-grid">
                {shoppingResults.slice(0, 6).map((item, index) => (
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
        );
    };

    return (
        <Widget title="Assistant & Boutique">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '8px', padding: '4px', background: '#f3f4f6', borderRadius: '12px' }}>
                    <button
                        onClick={() => handleModeChange('assistant')}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: mode === 'assistant' ? '#6366f1' : 'transparent',
                            color: mode === 'assistant' ? 'white' : '#6b7280',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <Search size={16} />
                        Assistant
                    </button>
                    <button
                        onClick={() => handleModeChange('marketplace')}
                        style={{
                            flex: 1,
                            padding: '8px 12px',
                            background: mode === 'marketplace' ? '#10b981' : 'transparent',
                            color: mode === 'marketplace' ? 'white' : '#6b7280',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                        }}
                    >
                        <ShoppingBag size={16} />
                        Boutique
                    </button>
                </div>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder={mode === 'assistant' ? "Comment appairer..." : "Rechercher des composants..."}
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
                            background: mode === 'assistant' ? '#6366f1' : '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0 16px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: mode === 'assistant'
                                ? '0 4px 6px -1px rgba(99, 102, 241, 0.2)'
                                : '0 4px 6px -1px rgba(16, 185, 129, 0.2)'
                        }}
                    >
                        <Search size={18} />
                    </button>
                </form>

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: '120px',
                    paddingRight: '4px',
                    overflowX: 'hidden'
                }}>
                    {mode === 'assistant' ? renderAssistantContent() : renderMarketplaceContent()}
                </div>
            </div>
        </Widget>
    );
};

export default CombinedWidget;
