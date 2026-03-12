# Gestion des créneaux d'ouverture (Opening Slots) - Kevin

Cette fonctionnalité permet de : - définir les **créneaux d'ouverture du
restaurant** - fermer le restaurant pour une **date exceptionnelle** -
ajouter un **créneau exceptionnel** - consulter les **créneaux
disponibles** via une API

------------------------------------------------------------------------

# Vérifier les disponibilités

## Endpoint

GET /api/availability

### Exemple de requête

GET http://localhost:3000/availability?date=2026-06-20

### Réponse exemple

``` json
{
  "success": true,
  "date": "2026-06-20",
  "is_closed": false,
  "slots": [
    {
      "time": "12:00:00",
      "available": true,
      "available_tables": 5
    },
    {
      "time": "19:00:00",
      "available": false,
      "available_tables": 0
    }
  ]
}
```

------------------------------------------------------------------------

# Cas de test : fermeture exceptionnelle

## Endpoint

POST admin/opening-exceptions/close

### Body JSON

``` json
{
  "date": "2026-06-20",
  "reason": "Maintenance cuisine"
}
```

### Réponse

``` json
{
  "success": true,
  "message": "Closure exception saved successfully"
}
```

### Vérification

GET /api/availability?date=2026-06-20

Réponse :

``` json
{
  "success": true,
  "date": "2026-06-20",
  "is_closed": true,
  "reason": "Maintenance cuisine",
  "slots": []
}
```

------------------------------------------------------------------------

# Cas de test : créneau exceptionnel

## Endpoint

POST admin/opening-exceptions/slot

### Body JSON

``` json
{
  "date": "2026-06-20",
  "slot_time": "22:00"
}
```

### Réponse

``` json
{
  "success": true,
  "message": "Exceptional slot saved successfully"
}
```

### Vérification

GET availability?date=2026-06-20

Réponse exemple :

``` json
{
  "time": "22:00:00",
  "available": true,
  "available_tables": 5
}
```

------------------------------------------------------------------------

# Résumé

Cette fonctionnalité permet :

-   de gérer les **horaires d'ouverture**
-   de définir des **fermetures exceptionnelles**
-   d'ajouter des **créneaux supplémentaires**
-   de consulter les **disponibilités via l'API**
