# Pages

Une page VitePress est généralement un fichier Markdown placé sous `docs/`. Le chemin du fichier détermine son URL publique.

## Règle de routage

Avec les liens propres activés, ces fichiers deviennent :

| Fichier | URL |
| :--- | :--- |
| `docs/fr/getting-started.md` | `/fr/getting-started` |
| `docs/fr/nav/index.md` | `/fr/nav/` |
| `docs/fr/tech-tools/docker.md` | `/fr/tech-tools/docker` |

## Contenu d’une page

Une page peut contenir :

- du Markdown standard ;
- du frontmatter YAML ;
- des composants Vue globaux ;
- des blocs de code ;
- des liens internes vers les autres locales.

## Conseils

- gardez une page centrée sur un seul sujet ;
- utilisez des titres hiérarchiques clairs ;
- évitez de dupliquer des informations sensibles dans les pages publiques ;
- ajoutez la page dans la sidebar si elle doit être découvrable.

## Références

- Version chinoise : `/zh/page`
- Version anglaise : `/en/page`

