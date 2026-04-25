# React

React est une bibliothèque JavaScript pour construire des interfaces utilisateur à partir de composants.

## Cas d’usage

- applications web interactives ;
- dashboards ;
- interfaces SaaS ;
- composants réutilisables ;
- projets avec écosystème React existant.

## Création de projet

```bash
pnpm create vite my-react-app --template react
```

## Composant simple

```jsx
import { useState } from 'react'

export function Counter() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  )
}
```

## Concepts clés

- JSX ;
- props ;
- state avec `useState` ;
- effets avec `useEffect` ;
- rendu conditionnel ;
- listes et clés ;
- hooks personnalisés.

## Bonnes pratiques

- gardez le state au niveau le plus bas possible ;
- évitez les effets inutiles ;
- mémoïsez seulement quand c’est justifié ;
- séparez logique métier et rendu.

## Références

- Version chinoise : `/zh/tech-tools/react`

