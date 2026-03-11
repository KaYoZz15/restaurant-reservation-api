# Restaurant Reservation API

API REST developpee avec **Node.js**, **Express** et **MySQL** permettant de gerer les reservations d'un restaurant.

Ce projet est realise dans le cadre d'un travail de groupe et vise a mettre en place une architecture backend propre avec une base de donnees relationnelle et des endpoints REST.

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

Creer un fichier `.env` a la racine du projet.

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

# Endpoints disponibles

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

## Endpoints réservation (tickets Arthur)

Tous les endpoints ci-dessous nécessitent :

```
Authorization: Bearer <token_jwt>
```

### POST /reservations

Crée une réservation pour l'utilisateur connecté.

Body :

```json
{
  "name": "Jean Dupont",
  "phone": "0611223344",
  "number_of_people": 4,
  "reservation_date": "2026-03-20",
  "reservation_time": "20:00",
  "note": "Table proche fenetre"
}
```

Réponse succès (201) :

```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "id": 12,
    "user_id": 2,
    "name": "Jean Dupont",
    "phone": "0611223344",
    "number_of_people": 4,
    "reservation_date": "2026-03-20",
    "reservation_time": "20:00:00",
    "note": "Table proche fenetre",
    "status": "pending",
    "tables": [
      {
        "id": 3,
        "table_number": "T3",
        "seats": 4
      }
    ]
  }
}
```

Réponse erreur capacité (409) :

```json
{
  "success": false,
  "message": "Not enough capacity for this date and time"
}
```

### GET /my-reservations

Retourne toutes les réservations de l'utilisateur connecté.

Exemple :

```
GET http://localhost:3000/my-reservations
```

Réponse succès (200) :

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 12,
      "user_id": 2,
      "name": "Jean Dupont",
      "phone": "0611223344",
      "number_of_people": 4,
      "reservation_date": "2026-03-20T00:00:00.000Z",
      "reservation_time": "20:00:00",
      "note": "Table proche fenetre",
      "status": "pending",
      "created_at": "2026-03-11T18:40:12.000Z",
      "tables": [
        {
          "id": 3,
          "table_number": "T3",
          "seats": 4
        }
      ]
    }
  ]
}
```

### PUT /reservations/:id

Modifie une réservation existante (propriétaire uniquement, statut obligatoire : `pending`).

Body :

```json
{
  "name": "Jean Dupont",
  "phone": "0611223344",
  "number_of_people": 2,
  "reservation_date": "2026-03-21",
  "reservation_time": "19:30",
  "note": "Mise a jour de la reservation"
}
```

Réponse succès (200) :

```json
{
  "success": true,
  "message": "Reservation updated successfully",
  "data": {
    "id": 12,
    "user_id": 2,
    "name": "Jean Dupont",
    "phone": "0611223344",
    "number_of_people": 2,
    "reservation_date": "2026-03-21",
    "reservation_time": "19:30:00",
    "note": "Mise a jour de la reservation",
    "status": "pending",
    "tables": [
      {
        "id": 1,
        "table_number": "T1",
        "seats": 2
      }
    ]
  }
}
```

### DELETE /reservations/:id

Annule une réservation existante (propriétaire uniquement).

Réponse succès (200) :

```json
{
  "success": true,
  "message": "Reservation cancelled successfully",
  "data": {
    "id": 12,
    "status": "cancelled"
  }
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

Arthur
