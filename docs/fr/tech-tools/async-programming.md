# Programmation asynchrone JavaScript

La programmation asynchrone permet à JavaScript de gérer des opérations longues sans bloquer l’interface ou le thread principal.

## Pourquoi l’asynchrone

- requêtes réseau ;
- lecture de fichiers ;
- timers ;
- accès base de données ;
- interactions utilisateur ;
- traitements différés.

## Event loop

JavaScript exécute le code synchrone puis traite les tâches asynchrones via l’event loop. Les callbacks, `Promise` et `async/await` s’appuient sur ce mécanisme.

## Promise

```js
fetch('/api/user')
  .then(res => res.json())
  .then(user => {
    console.log(user)
  })
  .catch(error => {
    console.error(error)
  })
```

## async/await

```js
async function loadUser() {
  try {
    const res = await fetch('/api/user')
    return await res.json()
  }
  catch (error) {
    console.error(error)
    return null
  }
}
```

## Bonnes pratiques

- gérez toujours les erreurs ;
- évitez les chaînes trop profondes ;
- utilisez `Promise.all` pour les tâches parallèles indépendantes ;
- ne bloquez pas le thread principal avec de gros calculs ;
- documentez les effets de bord et les retries.

## Références

- Version chinoise : `/zh/tech-tools/async-programming`

