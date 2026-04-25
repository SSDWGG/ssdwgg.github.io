# Three.js

Three.js est une bibliothèque JavaScript pour créer des scènes 3D dans le navigateur avec WebGL.

## Cas d’usage

- visualisations 3D ;
- pages marketing interactives ;
- configurateurs de produits ;
- expériences éducatives ;
- prototypes créatifs.

## Installation

```bash
pnpm add three
```

## Concepts clés

| Concept | Rôle |
| :--- | :--- |
| Scene | contient les objets |
| Camera | définit le point de vue |
| Renderer | dessine la scène |
| Mesh | objet visible |
| Geometry | forme |
| Material | apparence |
| Light | éclairage |

## Exemple minimal

```js
import * as THREE from 'three'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer()

renderer.setSize(innerWidth, innerHeight)
document.body.appendChild(renderer.domElement)
```

## Bonnes pratiques

- surveillez le coût des modèles et textures ;
- libérez les ressources quand une scène disparaît ;
- adaptez le rendu aux appareils mobiles ;
- mesurez les performances avant d’ajouter des effets lourds.

## Références

- Version chinoise : `/zh/tech-tools/threejs`

