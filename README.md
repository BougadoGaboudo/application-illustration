# Bougado Illustrator : Projet Galerie d'Illustrations et Commissions

Ce projet est une application web permettant de gérer et vendre des illustrations ainsi que de traiter des commandes personnalisées.

## Installation

Suivez ces étapes pour installer et configurer le projet sur votre environnement local.

### Prérequis

- Node.js (version 16 ou supérieure)
- MySQL (ou autre base de données compatible avec Prisma)

### Étapes d'installation

1. **Cloner le dépôt**

   ```bash
   git clone https://github.com/BougadoGaboudo/application-illustration.git
   cd application-illustration
   ```

2. **Installer les dépendances**

   ```bash
   npm install
   ```

3. **Configuration de l'environnement**

   Créez un fichier `.env` à la racine du projet avec les variables suivantes :

   ```
   DATABASE_URL="mysql://user:password@localhost:3306/nom_de_votre_base"
   JWT_SECRET="votre_secret_jwt_tres_securise"
   ```

4. **Créer la base de données**

   Avant de synchroniser le schéma Prisma, vous devez créer votre base de données :

   ```bash
   # Connectez-vous à MySQL
   mysql -u votre_utilisateur -p

   # Une fois connecté, créez la base de données
   CREATE DATABASE nom_de_votre_base;

   # Quittez MySQL
   exit
   ```

5. **Initialiser la base de données**

   ```bash
   npx prisma db push
   ```

6. **Ajouter des données de test**

   ```bash
   node seed.js
   ```

7. **Démarrer l'application en mode développement**

   ```bash
   npm run dev
   ```

   L'application sera disponible à l'adresse [http://localhost:3000](http://localhost:3000).

## Fonctionnalités principales

- **Galerie d'illustrations** (/gallery): Visualisation et filtrage par type et tags
- **Boutique** (/shop): Vente d'illustrations avec choix de formats et types d'impression
- **Système de commissions** (/commission): Demandes de créations personnalisées
- **Espace client** (/dashboard): Suivi des commandes et gestion du panier
- **Espace administrateur** (/admin): Gestion des illustrations et commissions

## Structure du projet

- `/pages` : Pages de l'application (Next.js)
- `/components` : Composants React réutilisables
- `/public` : Fichiers statiques
- `/prisma` : Modèle de données
- `/lib` : Fonctions utilitaires et logique métier

## Accès à l'application

Après l'installation, un compte administrateur et un compte client seront créés automatiquement. Vous pouvez vous connecter à l'application en utilisant les informations suivantes :

- **Email** : admin@admin.com
- **Mot de passe** : 123

- **Email** : client@client.com
- **Mot de passe** : 123

Vous pouvez également créer d'autres utilisateurs client via la page d'inscription (en cliquant sur l'icone du panier ou /register).

---

© 2025 - Bougado Illustrator
