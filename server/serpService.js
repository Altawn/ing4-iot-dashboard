const SerpApi = require('google-search-results-nodejs');
const search = new SerpApi.GoogleSearch(process.env.SERP_API_KEY);

/**
 * Effectue une recherche via SerpApi
 * @param {string} query - La requête de recherche
 * @param {string} engine - Le moteur de recherche (google, google_shopping, google_news, etc)
 * @returns {Promise<object>} - Les résultats de la recherche
 */
const searchSerp = (query, engine = 'google') => {
    return new Promise((resolve, reject) => {
        const params = {
            q: query,
            engine: engine,
            google_domain: 'google.fr',
            gl: 'fr',
            hl: 'fr'
        };

        search.json(params, (data) => {
            resolve(data);
        });
    });
};

module.exports = { searchSerp };
