# Vue3

Vue3 est la version moderne de Vue, avec Composition API, meilleures performances et meilleure prise en charge TypeScript.

## Création de projet

```bash
pnpm create vue@latest
```

## Exemple avec Composition API

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>
```

## Concepts clés

- `ref` et `reactive` ;
- `computed` et `watch` ;
- `script setup` ;
- composants composables ;
- meilleure inférence TypeScript ;
- Suspense, Teleport et fragments.

## Bonnes pratiques

- extrayez la logique réutilisable dans des composables ;
- gardez les composants focalisés ;
- typez les props et events ;
- évitez les watchers inutiles.

## Références

- Version chinoise : `/zh/tech-tools/vue3`

