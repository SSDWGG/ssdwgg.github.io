# Workflow Git et versionnement

Cette page suppose que la branche principale est `main`. Si un dépôt utilise encore `master`, suivez la branche par défaut tout en gardant les mêmes règles.

## Pourquoi c’est important

Un bon workflow Git aide à :

- garder un historique lisible ;
- réduire les conflits ;
- accélérer les revues ;
- publier et revenir en arrière avec moins de risque.

## Modèle de branches

| Préfixe | Usage | Exemple |
| :--- | :--- | :--- |
| `feature/` | nouvelle fonctionnalité | `feature/login-page` |
| `fix/` | correction normale | `fix/order-status` |
| `hotfix/` | correction urgente de production | `hotfix/payment-timeout` |
| `release/` | stabilisation de release | `release/v1.4.0` |
| `chore/` | outillage ou configuration | `chore/eslint-upgrade` |

## Commits

Utilisez Conventional Commits quand c’est possible :

```bash
<type>(<scope>): <subject>
```

Types fréquents :

- `feat` : fonctionnalité ;
- `fix` : correction ;
- `docs` : documentation ;
- `refactor` : restructuration interne ;
- `test` : tests ;
- `chore` : maintenance.

## Flux quotidien

```bash
git checkout main
git pull origin main
git checkout -b feature/example
```

Travaillez par petits commits, vérifiez localement, puis ouvrez une Pull Request avec contexte, portée, impact et validation.

## Références

- Version chinoise : `/zh/development/git`
- Version anglaise : `/en/development/git`

