import React, { useState } from 'react';
import { Search, ExternalLink, Loader } from 'lucide-react';
import Widget from './Widget';

const SearchWidget = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(false);
        setResults(null);

        try {
            const res = await fetch(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
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

    // Helper to render featured snippet or first organic result
    const renderContent = () => {
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

        // 1. Try Featured Snippet (Answer Box)
        if (results.answer_box) {
            return (
                <div style={{
                    padding: '12px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    borderLeft: '4px solid #38bdf8',
                    borderRadius: '4px',
                    marginBottom: '10px'
                }}>
                    <h4 style={{ fontSize: '0.9rem', color: '#38bdf8', marginBottom: '4px' }}>Réponse Rapide</h4>
                    <p style={{ fontSize: '0.95rem', lineHeight: '1.4', wordBreak: 'break-word' }}>{results.answer_box.snippet || results.answer_box.answer}</p>
                </div>
            );
        }

        // 2. Fallback to First Organic Result
        if (results.organic_results && results.organic_results.length > 0) {
            const first = results.organic_results[0];
            return (
                <div style={{ padding: '8px 0' }}>
                    <a href={first.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                        <h4 style={{ color: '#38bdf8', fontSize: '1rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {first.title} <ExternalLink size={12} />
                        </h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', wordBreak: 'break-word' }}>{first.snippet}</p>
                    </a>
                </div>
            );
        }

        return <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Aucun résultat pertinent trouvé.</p>;
    };

    return (
        <Widget title="Assistant Connecté">
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '10px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '8px' }}>
                    <input
                        type="text"
                        placeholder="Comment appairer..."
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
                            background: '#38bdf8',
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

                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    minHeight: '120px',
                    paddingRight: '4px',
                    overflowX: 'hidden'
                }}>
                    {renderContent()}
                </div>
            </div>
        </Widget>
    );
};

export default SearchWidget;
