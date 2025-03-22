# Autom8

Application web moderne développée avec React et TypeScript, offrant une interface utilisateur professionnelle et responsive.

## Fonctionnalités principales

- 🏠 **Page d'accueil** avec témoignages clients dynamiques
- 💰 **Tarification** avec options mensuelles/annuelles et réduction de 17% sur l'abonnement annuel
- 📝 **Blog** avec articles en Markdown et mise en page responsive
- 📧 **Formulaire de contact** intégré avec EmailJS
- 🔄 **Conversion PDF vers Images** avec compression ZIP
- 🔐 **Système d'authentification** personnalisé pour les superusers

## Technologies utilisées

- React + TypeScript
- Vite (bundler)
- Tailwind CSS
- Supabase (base de données)
- EmailJS (formulaire de contact)
- PyMuPDF (conversion PDF)

## Prérequis

- Node.js
- npm ou yarn

## Installation

1. Cloner le repository
```bash
git clone [url-du-repo]
```

2. Installer les dépendances
```bash
npm install
```

3. Créer un fichier `.env` avec les variables nécessaires
```
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon
VITE_EMAILJS_USER_ID=votre_id_emailjs
```

4. Lancer le serveur de développement
```bash
npm run dev
```

## Structure du projet

- `/src`
  - `/components` : Composants réutilisables
  - `/pages` : Pages principales de l'application
  - `/lib` : Utilitaires et fonctions
  - `/styles` : Fichiers CSS
  - `/types` : Types TypeScript

## Contact

Pour toute question, contactez-nous via le formulaire sur le site.
