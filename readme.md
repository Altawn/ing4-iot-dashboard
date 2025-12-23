# IoT Dashboard - Projet CREaTE 2025

Bienvenue sur le **Dashboard IoT**, une application web interactive conçue pour visualiser et gérer des données de capteurs IoT à travers le monde. Ce projet a été développé dans le cadre du cursus ingénieur.

## 🚀 Fonctionnalités Principales

*   **Globe 3D Interactif** : Visualisation géospatiale des capteurs avec `react-globe.gl`.
*   **Tableau de Bord** : Affichage de statistiques et graphiques (température, humidité, etc.) via `recharts`.
*   **Administration** : Interface complète de gestion (CRUD) des utilisateurs, capteurs et mesures.
*   **Widgets Intelligents** : Assistant de recherche et comparateur de composants (intégrant SerpAPI).
*   **Design Moderne** : Interface responsive, mode sombre/clair, et composants stylisés.

## 🛠 Technologies Utilisées

Ce projet repose sur une architecture moderne séparant le frontend du backend.

### Frontend (`/web`)
*   **Framework** : React 19
*   **Build Tool** : Vite 7
*   **Visualisation** : React Globe GL, Recharts
*   **Design System** : Storybook 10, Lucide React (Icônes)
*   **Routage** : React Router Dom 7

### Backend (`/server`)
*   **Serveur** : Node.js avec Express 5
*   **Base de Données** : MongoDB (via Mongoose 9)
*   **API Externe** : SerpAPI (Google Search Results)

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir installé :
*   **Node.js** (Version 18 ou supérieure recommandée)
*   **npm** (Généralement inclus avec Node.js)
*   **MongoDB** (Si vous utilisez une base locale, ou un compte MongoDB Atlas)

## 🏁 Getting Started (Démarrage Rapide)

Suivez ces étapes pour lancer le projet sur votre machine locale.

### 1. Récupération du Projet
Clonez le dépôt Git sur votre machine :
```bash
git clone https://github.com/Altawn/ing4-iot-dashboard.git
cd ing4-iot-dashboard
```

### 2. Configuration du Backend (`server`)

Le backend gère l'API et la connexion à la base de données.

1.  Accédez au dossier serveur :
    ```bash
    cd server
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Configurez les variables d'environnement :
    *   Créez un fichier `.env` à la racine du dossier `server`.
    *   Copiez le contenu de `.env.example` ou utilisez le modèle suivant :
        ```env
        MONGO_URI=mongodb+srv://<votre_url_mongodb>
        SERP_API_KEY=<votre_cle_serpapi>
        PORT=3001
        ```
4.  Lancez le serveur :
    ```bash
    npm start
    ```
    *Le serveur devrait démarrer sur `http://localhost:3001`.*

### 3. Configuration du Frontend (`web`)

Le frontend est l'interface utilisateur de l'application.

1.  Ouvrez un **nouveau terminal** et accédez au dossier web :
    ```bash
    cd web
    ```
2.  Installez les dépendances :
    ```bash
    npm install
    ```
3.  Lancez l'application en mode développement :
    ```bash
    npm run dev
    ```
    *L'application sera accessible (généralement) sur `http://localhost:5173`.*

## � Architecture du Projet

Structure simplifiée des dossiers principaux :

```
ing4-iot-dashboard/
├── server/                 # Backend Node.js/Express
│   ├── app.js              # Point d'entrée serveur & API
│   ├── serpService.js      # Service pour l'API SerpApi
│   └── package.json        # Dépendances Backend
│
└── web/                    # Frontend React/Vite
    ├── public/             # Assets statiques
    ├── src/
    │   ├── components/     # Composants réutilisables (Widgets, Globe, etc.)
    │   ├── layouts/        # Mises en page (Layout principal)
    │   ├── pages/          # Pages principales (Dashboard, Admin)
    │   ├── stories/        # Stories pour Storybook
    │   └── styles/         # Fichiers CSS
    ├── package.json        # Dépendances Frontend
    └── vite.config.js      # Config Vite
```

## �📚 Documentation Additionnelle

### Storybook
Pour visualiser et tester les composants d'interface isolément :
```bash
cd web
npm run storybook
```
Le Storybook sera accessible sur le port **6006**.

## 🔗 Ressources du Projet

*   [📅 To-Do List / Suivi de projet](https://airtable.com/invite/l?inviteId=invFx8ztv4w30BtcQ&inviteToken=55f8b4d35e348fd2c690760034d7006c0de3a12611cf76a4bff8f8c66775bc74&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts)
*   [🎨 Maquettes Figma](https://www.figma.com/design/5iHfNCu1jxLufNa8jZw7D4/iot-dashboard?node-id=0-1&t=4DBPvSHceJCzHcRZ-1)

---
*Projet réalisé par l'équipe Meyer-Roussilhon-Aubert - Promo 2025*