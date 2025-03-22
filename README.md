# 🚀 Autom8

<div align="center">

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)

🌟 Solution professionnelle d'automatisation des processus métier

[Documentation](#-documentation) •
[Installation](#-installation) •
[Configuration](#-configuration) •
[Fonctionnalités](#-fonctionnalités-principales) •
[Contact](#-contact)

</div>

---

## 📚 Documentation

> Application web moderne développée avec React et TypeScript, offrant une interface utilisateur responsive et intuitive.

### ⭐ Points forts
- 🎯 Interface utilisateur moderne et intuitive
- 📱 Design responsive et adaptatif
- 🔒 Sécurité renforcée avec authentification personnalisée
- 🚀 Performance optimisée avec Vite
- 🎨 Design soigné avec Tailwind CSS

## ✨ Fonctionnalités principales

<details>
<summary>🏠 <strong>Page d'accueil</strong></summary>

- Témoignages clients dynamiques
- Design moderne et épuré
- Interface responsive
</details>

<details>
<summary>💰 <strong>Tarification</strong></summary>

- Options mensuelles et annuelles
- 17% de réduction sur l'abonnement annuel
- Affichage dynamique des prix
- Solutions entreprise personnalisées
</details>

<details>
<summary>📝 <strong>Blog</strong></summary>

- Articles en Markdown pour une maintenance facile
- Mise en page responsive (1-3 colonnes)
- Métadonnées des articles (date, temps de lecture, auteur)
- Design moderne avec cartes interactives
</details>

<details>
<summary>📧 <strong>Contact</strong></summary>

- Formulaire intégré avec EmailJS
- Design avec effets visuels et dégradés
- Validation des champs en temps réel
- Envoi automatique à xenatronics@gmx.fr
</details>

<details>
<summary>🔄 <strong>Outils</strong></summary>

- Conversion PDF vers Images avec compression ZIP
- Interface intuitive
- Traitement rapide des fichiers
</details>

<details>
<summary>🔐 <strong>Administration</strong></summary>

- Système d'authentification personnalisé pour les superusers
- Gestion des articles du blog
- Gestion des témoignages clients
- Interface d'administration sécurisée
</details>

## 🛠️ Stack technique

### ⚛️ Frontend
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Latest-purple?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-teal?logo=tailwind-css)
![EmailJS](https://img.shields.io/badge/EmailJS-Integration-red)

### 🗄️ Backend
![Supabase](https://img.shields.io/badge/Supabase-Database-green?logo=supabase)
![PyMuPDF](https://img.shields.io/badge/PyMuPDF-PDF_Processing-blue)
![REST API](https://img.shields.io/badge/REST-API-green)

### 🔧 Outils
![Git](https://img.shields.io/badge/Git-Version_Control-orange?logo=git)
![npm](https://img.shields.io/badge/npm-Package_Manager-red?logo=npm)
![ESLint](https://img.shields.io/badge/ESLint-Linting-purple?logo=eslint)
![PostCSS](https://img.shields.io/badge/PostCSS-Styling-dd3a0a?logo=postcss)

## 📋 Prérequis

> Assurez-vous d'avoir installé les éléments suivants :

- 📦 Node.js (v16+)
- 📦 npm ou yarn
- 🌐 Navigateur moderne (Chrome, Firefox, Safari, Edge)

## 🚀 Installation

<details>
<summary>📥 <strong>Étapes d'installation</strong></summary>

1. **Cloner le repository**
```bash
git clone https://github.com/pat13310/autom8.git
cd autom8
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configuration**
Créer un fichier `.env` à la racine du projet :
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_anon
VITE_EMAILJS_USER_ID=votre_id_emailjs
```

4. **Lancer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```
</details>

## ⚙️ Configuration

> ⚠️ **IMPORTANT**: Les variables d'environnement sont sensibles et ne doivent JAMAIS être partagées ou committées dans Git.

### 1. Configuration de Supabase

1. Créez un compte sur [Supabase](https://supabase.com)
2. Créez un nouveau projet
3. Dans les paramètres du projet, récupérez :
   - `Project URL` → sera utilisé comme `VITE_SUPABASE_URL`
   - `anon/public key` → sera utilisé comme `VITE_SUPABASE_ANON_KEY`

### 2. Fichier d'environnement

1. Créez un fichier `.env` à la racine du projet
2. ⚠️ **Ne committez JAMAIS ce fichier** (il est déjà dans .gitignore)
3. Ajoutez les variables suivantes :

```env
# Supabase - Configuration requise
VITE_SUPABASE_URL=https://votre-projet.supabase.co     # URL de votre projet
VITE_SUPABASE_ANON_KEY=votre-clé-anon                  # Clé publique de votre projet

# EmailJS - Pour le formulaire de contact
VITE_EMAILJS_USER_ID=votre-id-emailjs                  # Optionnel si vous n'utilisez pas le formulaire
```

### 3. Vérification

Pour vérifier que votre configuration est correcte :

```bash
npm run dev
```

Si tout est bien configuré :
- La connexion à Supabase sera établie
- Le formulaire de contact sera fonctionnel
- Les données seront correctement chargées

En cas d'erreur, vérifiez :
1. Que le fichier `.env` existe
2. Que les variables sont correctement nommées
3. Que les valeurs correspondent à votre projet Supabase

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

## ⚡ Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | 🏃‍♂️ Lance le serveur de développement |
| `npm run build` | 🏗️ Compile le projet pour la production |
| `npm run test` | 🧪 Lance les tests |
| `npm run lint` | 🔍 Vérifie le code avec ESLint |

## 🤝 Contribution

> Les contributions sont les bienvenues !

1. 🍴 Forker le projet
2. 🔧 Créer une branche (`git checkout -b feature/amélioration`)
3. 📝 Commiter vos changements (`git commit -m 'feat: Ajout d'une nouvelle fonctionnalité'`)
4. 🚀 Pousser la branche (`git push origin feature/amélioration`)
5. 📫 Ouvrir une Pull Request

## 📞 Contact

<div align="center">

[![Email](https://img.shields.io/badge/Email-Contact-blue?style=for-the-badge&logo=gmail)](mailto:xenatronics@gmx.fr)
[![Website](https://img.shields.io/badge/Website-Autom8-green?style=for-the-badge&logo=web)](https://autom8.fr)

Pour toute question ou suggestion :
- 📧 Utilisez le formulaire de contact sur le site
- 💼 Consultez nos offres entreprise pour un accompagnement personnalisé

</div>

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

---

<div align="center">

Développé avec ❤️ par l'équipe Autom8

</div>
