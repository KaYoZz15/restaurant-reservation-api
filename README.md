# Restaurant Reservation API

API REST développée avec **Node.js**, **Express** et **MySQL** permettant de gérer les réservations d’un restaurant.

Ce projet est réalisé dans le cadre d’un travail de groupe et vise à mettre en place une architecture backend propre avec une base de données relationnelle et des endpoints REST.

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

Créer un fichier `.env` à la racine du projet.

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

Les autres fonctionnalités (authentification, gestion des réservations, logique métier, etc.) seront implémentées par les autres membres du groupe.

--- 

# API Documentation

## Authentification

L’API utilise **JWT (JSON Web Token)** pour sécuriser certaines routes.

---

## Inscription

### POST `/signup`

Permet de créer un compte utilisateur avec le rôle **client**.

#### Exemple de requête

```json
POST /signup

{
  "email": "john@example.com",
  "password": "password123",
  "fname": "John",
  "lname": "Doe",
  "phone": "0611223344"
}
```

Le mot de passe est **hashé avec bcrypt** avant d’être enregistré en base de données.

---

## Connexion

### POST `/login`

Permet à un utilisateur de se connecter et d’obtenir un **token JWT**.

#### Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Réponse

```json
{
  "token": "JWT_TOKEN"
}
```

---

## Route protégée

### GET `/me`

Permet de récupérer les informations de l’utilisateur connecté.

#### Header requis

```
Authorization: Bearer <JWT_TOKEN>
```

---

# Gestion des rôles

Deux rôles existent dans le système :

- `client`
- `admin`

Certaines routes sont **réservées aux administrateurs**.

Les contrôles d’accès sont réalisés via :

- `authMiddleware`
- `requireRole('admin')`

---

# Gestion des réservations (Admin)

Les administrateurs peuvent **consulter et valider les réservations**.

Ces endpoints nécessitent :

- Header `Authorization: Bearer <JWT_TOKEN>`
- Un utilisateur ayant le rôle **admin**

---

## Récupérer toutes les réservations

### GET `/reservations`

Permet de récupérer toutes les réservations enregistrées dans le système.

#### Exemple de réponse

```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "name": "Jean Dupont",
      "phone": "0600000000",
      "number_of_people": 4,
      "reservation_date": "2026-03-20",
      "reservation_time": "19:30:00",
      "note": "Table près de la fenêtre",
      "status": "pending"
    }
  ]
}
```

---

## Valider une réservation

### PATCH `/reservations/:id/validate`

Permet à un administrateur de **valider une réservation en attente**.

#### Comportement

```
pending → confirmed
```

#### Contraintes

- la réservation doit exister
- une réservation déjà **confirmée** ne peut plus être modifiée
- une réservation **cancelled** ne peut pas être confirmée

#### Exemple de réponse

```json
{
  "success": true,
  "message": "Reservation validated successfully",
  "data": {
    "id": 1,
    "status": "confirmed"
  }
}
```

---

# Endpoint disponible

## GET `/menu`

Retourne la liste des plats disponibles du restaurant.

#### Réponse

```json
{
  "success": true,
  "count": 4,
  "data": []
}
```

---

# Contribution

## Fonctionnalités implémentées par Adam

- authentification utilisateur (`signup` / `login`)
- génération et vérification de **JWT**
- gestion des rôles **client / admin**
- protection des routes via **middleware**
- consultation des réservations (**admin**)
- validation des réservations (**admin**)
