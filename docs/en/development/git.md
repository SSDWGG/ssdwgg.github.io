# Git Workflow and Version Control

This guide assumes the primary branch is `main`. If an older repository still uses `master`, follow the repository default, but keep the workflow rules the same.

## Why this matters

Good version control is not about adding process for its own sake. It helps the team:

- keep history readable,
- reduce collaboration conflicts,
- review code faster,
- release and roll back with less risk.

## Branch model

### Long-lived branches

- `main`: protected branch, always kept in a releasable state, merged through Pull Requests only.
- `develop`: optional integration branch for larger teams or release-based projects.

Smaller repositories can also use a trunk-based model with only `main` plus short-lived task branches.

### Short-lived branches

| Branch type | Purpose | Example |
| :--- | :--- | :--- |
| `feature/` | new feature work | `feature/login-page` |
| `fix/` | normal bug fix | `fix/order-status-bug` |
| `hotfix/` | urgent production fix | `hotfix/payment-timeout` |
| `release/` | release hardening and verification | `release/v1.4.0` |
| `chore/` | tooling, config, or dependency changes | `chore/eslint-upgrade` |

### Naming rules

- Use lowercase English words with hyphens.
- Name the purpose, not the person.
- Keep it short but descriptive.

## Commit conventions

Use Conventional Commits when possible:

```bash
<type>(<scope>): <subject>
```

### Common `type` values

- `feat`: new feature
- `fix`: bug fix
- `docs`: documentation update
- `style`: formatting only
- `refactor`: internal restructuring without behavior change
- `test`: test-related changes
- `chore`: scripts, config, tooling, or dependency maintenance
- `perf`: performance improvement
- `build`: build or packaging changes
- `ci`: CI/CD workflow changes

### Commit message expectations

- Write short, clear, action-oriented subjects.
- Keep one commit focused on one logical change.
- Avoid vague subjects like `update`, `fix bug`, or `test`.

### Examples

```bash
git commit -m "feat(auth): add login rate limit"
git commit -m "fix(profile): handle empty avatar url"
git commit -m "docs(api): clarify token refresh flow"
```

## Daily workflow

### 1. Create a branch

Start from the latest mainline branch:

```bash
git checkout main
git pull origin main
git checkout -b feature/login-page
```

If the team uses `develop`, branch from there instead:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/login-page
```

### 2. Commit in small slices

- Break a task into understandable commits.
- Run self-checks before pushing.
- WIP commits are acceptable locally, but clean up history before opening a PR when needed.

### 3. Keep up with mainline changes

Sync often to avoid large conflicts later:

```bash
git fetch origin
git rebase origin/main
```

If the team explicitly prefers merge-based syncing:

```bash
git fetch origin
git merge origin/main
```

Pick one team-wide strategy per repository and stay consistent.

### 4. Open a Pull Request

A PR should be ready only when:

- self-testing is done,
- the scope is clear,
- the commit history is readable,
- validation notes and screenshots are included where needed.

## Pull Request expectations

A solid PR should include:

- **Context**: why the change is needed
- **Scope**: what changed
- **Impact**: affected pages, APIs, modules, data, or config
- **Validation**: how it was tested
- **Risk notes**: compatibility, performance, permission, or data concerns

### Review focus

Reviewers should pay close attention to:

- correctness of business logic,
- edge cases and failure handling,
- unnecessary complexity or duplicated code,
- impact on shared modules or public interfaces,
- whether tests and docs were updated.

## Merge strategy

Each team should define a default merge policy:

- **Squash merge** keeps the main branch tidy.
- **Rebase and merge** preserves a linear history.
- **Merge commit** preserves full branch context.

If there is no stronger repository rule, a practical default is:

- use `squash merge` for normal feature branches,
- use `merge commit` when release context matters.

## Release and hotfix flow

### Release flow

1. Create a `release/` branch from `main` or `develop`.
2. Freeze scope and allow only release-related fixes.
3. Finish regression checks and change notes.
4. Merge back and create a version tag.

Example:

```bash
git tag -a v1.4.0 -m "release v1.4.0"
git push origin v1.4.0
```

### Hotfix flow

1. Create a `hotfix/` branch from `main`.
2. Fix only the production issue at hand.
3. Merge back to `main` and sync the same fix to `develop` or any integration branch.

## Conflict handling

- Sync early and often.
- Re-test after resolving conflicts.
- Be extra careful with shared configs, routes, and public interfaces.
- If the conflict is unclear, stop and confirm before choosing a side.

Common recovery flow:

```bash
git fetch origin
git rebase origin/main

# after resolving conflicts
git add .
git rebase --continue
```

Abort when necessary:

```bash
git rebase --abort
```

## Command quick reference

| Goal | Command | Notes |
| :--- | :--- | :--- |
| Check status | `git status` | See local changes |
| List branches | `git branch` | Show local branches |
| Create and switch branch | `git checkout -b feature/xxx` | Based on current branch |
| Fetch remote changes | `git fetch origin` | Update remote refs |
| Merge mainline | `git merge origin/main` | Merge-based sync |
| Rebase onto mainline | `git rebase origin/main` | Linear sync |
| Stash work | `git stash` | Save temporary changes |
| Restore stash | `git stash pop` | Re-apply latest stash |
| Copy a commit | `git cherry-pick <commit>` | Apply selected commit here |
| Undo local commit | `git reset --soft HEAD~1` | Keep changes, remove commit |
| Revert pushed commit | `git revert <commit>` | Create an inverse commit |

## Best practices

- Make each commit do one thing well.
- Keep each branch focused on one topic.
- Do not push directly to protected branches.
- Do not mix unrelated formatting or cleanup into a feature PR.
- Review your own diff before requesting review.
- Delete merged branches to keep the repository tidy.

## Summary

Good Git habits make development, review, release, and rollback faster and safer. The goal is not more ceremony. The goal is clearer collaboration.
