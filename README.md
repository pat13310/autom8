# 🚀 Autom8

🌟 Site web professionnel développé avec React et TypeScript, offrant une interface utilisateur moderne et responsive pour l'automatisation des processus métier.

## ✨ Fonctionnalités principales

- 🏠 **Page d'accueil**
  - Témoignages clients dynamiques
  - Design moderne et épuré
  - Interface responsive

- 💰 **Tarification**
  - Options mensuelles et annuelles
  - 17% de réduction sur l'abonnement annuel
  - Affichage dynamique des prix
  - Solutions entreprise personnalisées

- 📝 **Blog**
  - Articles en Markdown pour une maintenance facile
  - Mise en page responsive (1-3 colonnes)
  - Métadonnées des articles (date, temps de lecture, auteur)
  - Design moderne avec cartes interactives

- 📧 **Contact**
  - Formulaire intégré avec EmailJS
  - Design avec effets visuels et dégradés
  - Validation des champs en temps réel
  - Envoi automatique à xenatronics@gmx.fr

- 🔄 **Outils**
  - Conversion PDF vers Images avec compression ZIP
  - Interface intuitive
  - Traitement rapide des fichiers

- 🔐 **Administration**
  - Système d'authentification personnalisé pour les superusers
  - Gestion des articles du blog
  - Gestion des témoignages clients
  - Interface d'administration sécurisée

## 🛠️ Technologies utilisées

- ⚛️ **Frontend**
  - React 18
  - TypeScript
  - Vite (bundler)
  - Tailwind CSS
  - EmailJS

- 🗄️ **Backend**
  - Supabase (base de données)
  - PyMuPDF (conversion PDF)
  - API REST

- 🔧 **Outils**
  - Git
  - npm/yarn
  - ESLint
  - PostCSS

## 📋 Prérequis

- 📦 Node.js (v16+)
- 📦 npm ou yarn
- 🌐 Navigateur moderne (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

1. 📥 **Cloner le repository**
```bash
git clone https://github.com/pat13310/autom8.git
cd autom8
```

2. 📦 **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. ⚙️ **Configuration**
Créer un fichier `.env` à la racine du projet :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon
VITE_EMAILJS_USER_ID=votre_id_emailjs
```

4. 🏃‍♂️ **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

## 📁 Structure du projet

```
/src
├── 🧩 components/     # Composants réutilisables
│   ├── layout/       # Composants de mise en page
│   └── ui/          # Composants d'interface
├── 📄 pages/         # Pages de l'application
├── 📚 lib/           # Utilitaires et fonctions
├── 🎨 styles/        # Fichiers CSS et styles
└── 📝 types/         # Types TypeScript
```

## 🔧 Scripts disponibles

- 🏃‍♂️ `npm run dev` : Lance le serveur de développement
- 🏗️ `npm run build` : Compile le projet pour la production
- 🧪 `npm run test` : Lance les tests
- 🔍 `npm run lint` : Vérifie le code avec ESLint

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. 🍴 Forker le projet
2. 🔧 Créer une branche pour votre fonctionnalité
3. 📝 Commiter vos changements
4. 🚀 Pousser vers la branche
5. 📫 Ouvrir une Pull Request

## 📞 Contact

Pour toute question ou suggestion :
- 📧 Utilisez le formulaire de contact sur le site
- 💼 Consultez nos offres entreprise pour un accompagnement personnalisé

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
