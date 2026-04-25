# Vue2

Vue2 est une version historique et très utilisée de Vue. Elle s’appuie principalement sur l’Options API.

## Quand le rencontrer

- projets existants ;
- anciens systèmes internes ;
- applications qui n’ont pas encore migré ;
- bibliothèques ou composants hérités.

## Exemple

```js
new Vue({
  el: '#app',
  data() {
    return {
      count: 0,
    }
  },
  methods: {
    increment() {
      this.count += 1
    },
  },
})
```

## Points importants

- `data`, `computed`, `watch`, `methods` ;
- cycle de vie comme `created` et `mounted` ;
- composants mono-fichier ;
- limitations de réactivité sur certains ajouts de propriétés ;
- migration progressive possible vers Vue3 selon le contexte.

## Références

- Version chinoise : `/zh/tech-tools/vue2`

