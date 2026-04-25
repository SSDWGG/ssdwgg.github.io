# Modes de développement

Cette page aide à choisir entre livraison standard et itération rapide, tout en gardant un niveau de qualité minimal.

## Quand utiliser chaque mode

| Mode | Idéal pour | Objectif principal |
| :--- | :--- | :--- |
| Livraison standard | besoins stables, impact large, publication formelle | réduire les risques et garder la traçabilité |
| Itération rapide | exploration, MVP, outil interne, prototype | apprendre vite et raccourcir la boucle de feedback |

Le choix ne doit pas dépendre uniquement de la vitesse. Il faut aussi regarder la stabilité du besoin, le risque métier et le coût de coordination.

## Principes communs

- clarifier l’objectif avant de coder ;
- livrer par petits lots ;
- garder le projet exécutable ;
- documenter les décisions importantes ;
- remonter les blocages tôt ;
- ne jamais supprimer le minimum de qualité.

## Développement Docker-first

Une approche `Docker-first` consiste à placer le runtime, les dépendances de service et l’environnement d’intégration dans Docker autant que possible, sans forcer tous les outils personnels dans des conteneurs.

### Bons candidats

- frontend, backend, BFF et gateways ;
- bases de données et caches ;
- files de messages, stockage objet et services mockés ;
- dépendances de tests ;
- runtimes Node, Java, Python ou Go.

### À garder sur l’hôte

- IDE ;
- navigateur ;
- outils système ;
- applications de design ;
- outils qui dépendent fortement de l’interface graphique ou du matériel.

## Recommandation

Un projet peut être presque entièrement basé sur Docker, mais l’objectif doit rester `Docker-first` plutôt que `Docker-only`.

## Références

- Version chinoise : `/zh/development/type`
- Version anglaise : `/en/development/type`

