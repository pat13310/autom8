import { Link, useParams } from 'react-router-dom';
import { Bot, Zap, BarChart, Shield, Calendar, Clock, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import { NotFound } from '@/components/not-found';

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  image: string;
  category: string;
  icon: any;
}

const posts: BlogPost[] = [
  {
    slug: 'automatisation-ia',
    title: "L'automatisation par l'IA : révolution du travail",
    description: "Découvrez comment l'intelligence artificielle transforme l'automatisation des processus métier.",
    content: `
# L'automatisation par l'IA : révolution du travail

L'intelligence artificielle transforme radicalement notre façon de travailler. Dans cet article, nous explorons comment l'IA révolutionne l'automatisation des processus métier.

## L'impact de l'IA sur l'automatisation

L'IA permet aujourd'hui d'automatiser des tâches complexes qui nécessitaient auparavant une intervention humaine. Cette évolution apporte plusieurs avantages :

- Réduction des erreurs
- Augmentation de la productivité
- Optimisation des coûts
- Amélioration de la qualité

## Les applications concrètes

### 1. Traitement des documents

L'IA peut désormais :
- Lire et comprendre des documents
- Extraire des informations pertinentes
- Classer automatiquement les fichiers
- Générer des rapports

### 2. Service client

Les chatbots nouvelle génération offrent :
- Une disponibilité 24/7
- Des réponses personnalisées
- Une résolution rapide des problèmes
- Une expérience client améliorée

## L'avenir de l'automatisation

L'automatisation par l'IA continuera d'évoluer, offrant des possibilités toujours plus avancées pour les entreprises.
    `,
    date: '20 mars 2024',
    readTime: '5 min de lecture',
    author: 'Marie Laurent',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: "Intelligence Artificielle",
    icon: Bot,
  },
  {
    slug: 'performance-entreprise',
    title: "Optimiser la performance de votre entreprise",
    description: "Les meilleures pratiques pour améliorer l'efficacité opérationnelle de votre organisation.",
    content: `
# Optimiser la performance de votre entreprise

Découvrez les stratégies clés pour améliorer l'efficacité opérationnelle de votre organisation.

## Les piliers de la performance

### 1. Automatisation des processus

L'automatisation est essentielle pour :
- Réduire les tâches répétitives
- Minimiser les erreurs
- Accélérer les processus
- Optimiser les ressources

### 2. Formation continue

Investir dans la formation permet de :
- Développer les compétences
- Améliorer la productivité
- Motiver les équipes
- Favoriser l'innovation

## Mesurer la performance

### Indicateurs clés

- Taux de productivité
- Satisfaction client
- ROI des projets
- Taux d'erreur

### Outils d'analyse

Utilisez des outils modernes pour :
- Suivre les KPIs
- Analyser les tendances
- Identifier les opportunités
- Prendre des décisions éclairées
    `,
    date: '15 mars 2024',
    readTime: '4 min de lecture',
    author: 'Thomas Dubois',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: "Performance",
    icon: Zap,
  },
  {
    slug: 'analyse-donnees',
    title: "L'importance de l'analyse des données",
    description: "Comment exploiter vos données pour prendre de meilleures décisions.",
    content: `
# L'importance de l'analyse des données

## Introduction

Dans le monde numérique d'aujourd'hui, les données sont le nouveau pétrole. Leur analyse permet de prendre des décisions éclairées et d'optimiser les performances.

## Les types d'analyse

### 1. Analyse descriptive
- Que s'est-il passé ?
- Tendances historiques
- Patterns récurrents

### 2. Analyse prédictive
- Que va-t-il se passer ?
- Modèles prévisionnels
- Anticipation des besoins

### 3. Analyse prescriptive
- Que devrions-nous faire ?
- Recommandations d'actions
- Optimisation des décisions

## Les bénéfices

1. Meilleure compréhension du marché
2. Optimisation des processus
3. Réduction des coûts
4. Innovation produit
    `,
    date: '10 mars 2024',
    readTime: '6 min de lecture',
    author: 'Sophie Martin',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: "Analyse",
    icon: BarChart,
  },
  {
    slug: 'securite-donnees',
    title: "Sécurité des données : les bonnes pratiques",
    description: "Protégez efficacement vos données d'entreprise avec ces conseils essentiels.",
    content: `
# Sécurité des données : les bonnes pratiques

## Introduction

La sécurité des données est devenue une priorité absolue pour toutes les entreprises. Voici les meilleures pratiques à adopter.

## Les piliers de la sécurité

### 1. Authentification
- Multi-facteurs
- Mots de passe forts
- Gestion des accès

### 2. Chiffrement
- Données au repos
- Données en transit
- Clés de chiffrement

### 3. Sauvegarde
- Stratégie 3-2-1
- Tests de restauration
- Continuité d'activité

## Conformité RGPD

1. Droits des utilisateurs
2. Protection des données
3. Documentation
4. Notification des incidents
    `,
    date: '5 mars 2024',
    readTime: '7 min de lecture',
    author: 'Paul Durand',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: "Sécurité",
    icon: Shield,
  }
];

export function Blog() {
  return (
    <div className="bg-white py-10 sm:py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
        <h2 className="text-sm font-semibold leading-6 text-blue-600 uppercase tracking-wider">Votre blog</h2>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-3xl mb-8">
            Blog & Actualités
          </h1>
          <p className="text-lg leading-8 text-gray-600">
            Découvrez nos derniers articles sur l'automatisation et l'innovation.
          </p>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="flex flex-col bg-white rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all hover:border-blue-100 group">
              <div className="relative w-full">
                <img
                  src={post.image}
                  alt={post.title}
                  className="aspect-[16/9] w-full rounded-t-xl bg-gray-100 object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/60 to-transparent p-4 rounded-b-xl">
                  <div className="flex items-center gap-x-4 text-xs text-white">
                    <time dateTime={post.date} className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {post.date}
                    </time>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.author}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 p-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    <Link to={`/blog/${post.slug}`}>
                      <span className="absolute inset-0" />
                      {post.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-gray-600 line-clamp-3">
                    {post.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-blue-600 group-hover:text-blue-700">
                  Lire l'article
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const post = posts.find(p => p.slug === slug);

  if (!post) {
    return <NotFound />;
  }

  return (
    <div className="bg-white py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <article className="mx-auto max-w-3xl">
          <div className="relative mb-8">
            <img
              src={post.image}
              alt={post.title}
              className="aspect-[16/9] w-full rounded-xl bg-gray-100 object-cover shadow-md"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/60 to-transparent p-6 rounded-b-xl">
              
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/90">
                <time dateTime={post.date} className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {post.date}
                </time>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {post.readTime}
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author}
                </div>
              </div>
            </div>
          </div>

          <div className="prose prose-lg prose-blue mx-auto">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <div className="mt-12 flex justify-center">
            <Link to="/blog">
              <Button variant="outline" className="gap-2">
                <ArrowRight className="h-4 w-4 rotate-180" />
                Retour aux articles
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}