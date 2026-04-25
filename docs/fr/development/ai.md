# Développement assisté par IA

L’IA peut accélérer le développement, mais les ingénieurs restent responsables du résultat.

## Rôle de l’IA

L’IA est utile comme :

- assistant de rédaction et de code ;
- accélérateur pour les tâches répétitives ;
- partenaire d’apprentissage ;
- outil d’analyse pour les logs, erreurs et bases de code.

Elle ne remplace pas :

- le jugement métier ;
- la conception d’architecture ;
- la revue sécurité ;
- la responsabilité finale de qualité.

## Principes

### 1. Sécurité d’abord

Ne partagez pas de secrets, tokens, données client, endpoints internes ou code sensible avec un outil non approuvé.

### 2. Comprendre avant d’adopter

Ne fusionnez pas une sortie IA que vous ne pouvez pas expliquer.

### 3. Même niveau de qualité

Le code généré par IA doit suivre les mêmes règles de test, revue, lisibilité et release.

### 4. Traçabilité

Notez les choix importants et indiquez l’usage de l’IA dans les PR quand cela aide la revue.

## Bons cas d’usage

- boilerplate ;
- tests et mocks ;
- documentation ;
- résumés de code ;
- refactorisations simples ;
- analyse de logs.

## À utiliser avec prudence

| Cas | Risque |
| :--- | :--- |
| paiement, auth, sécurité | impact fort en cas d’erreur |
| données sensibles | fuite de confidentialité |
| librairie partagée | rayon d’impact large |
| contenu légal ou politique | risque de conformité |

## Références

- Version chinoise : `/zh/development/ai`
- Version anglaise : `/en/development/ai`

