# Restaurant Reservation API

API REST développée avec **Node.js**, **Express** et **MySQL** permettant de gérer les réservation d'un restaurant.

Ce projet est réalisé dans le cadre d'un travail de groupe et vise Ã  mettre en place une architecture backend propre avec une base de donnée relationnelle et des endpoints REST.

---

# Technologies utilisées

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- Nodemon (développement)

---

# Installation

Cloner le projet :

```bash
git clone <url-du-repo>
cd restaurant-reservation-api
```

Installer les dépendances :

```bash
npm install
```

---

# Configuration

Créer un fichier `.env` Ã  la racine du projet.

Exemple :

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=restaurant_reservation

JWT_SECRET=your_secret_key
```

---

# Base de données

Le schéma SQL se trouve dans :

```
database/schema.sql
```

Ce script permet de créer :

- la base de données
- les tables
- les relations
- quelques données de test

Pour initialiser la base :

Importer le fichier `schema.sql` dans **MySQL** ou **phpMyAdmin**.

---

# Lancer le projet

Mode développement :

```bash
npm run dev
```

Mode production :

```bash
npm start
```

Le serveur démarre sur :

```
http://localhost:3000
```

---

# Endpoint disponible

## GET /menu

Retourne la liste des plats disponibles du restaurant.

Exemple :

```
GET http://localhost:3000/menu
```

Réponse :

```json
{
  "success": true,
  "count": 4,
  "data": []
}
```

---

# Structure du projet

```
restaurant-reservation-api
│
├── config
│   └── database.js
│
├── controllers
│
├── models
│
├── routes
│
├── middlewares
│
├── database
│   └── schema.sql
│
├── .env.example
├── server.js
└── README.md
```

---

# Contribution

Kevin a réalisé la mise en place complète du socle du projet :

- Initialisation du projet **Node.js / Express**
- Mise en place de la **structure du projet (architecture MVC)**
- Configuration de la **connexion MySQL**
- Création du **schéma SQL de la base de données**
- Implémentation du premier endpoint API **GET /menu**
- Mise en place de la **gestion de projet et organisation des tâches avec Jira**

Arthur a réalisé l’implémentation des fonctionnalités de gestion des réservations côté client :

- Mise en place de l’**authentification JWT** sur les endpoints de réservation
- Implémentation des endpoints **POST /reservations** et **GET /my-reservations**
- Ajout de la logique métier de **vérification de capacité** et d’**attribution automatique des tables**
- Implémentation des endpoints **PUT /reservations/:id** et **DELETE /reservations/:id**
- Ajout des règles de sécurité métier : **vérification du propriétaire** et modification autorisée uniquement en statut **pending**

D’autres fonctionnalités (authentification complète, gestion avancée des réservations, logique métier, etc.) pourront être implémentées par les autres membres du groupe.

---

# Auteur

Kevin
