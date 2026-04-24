# Development Modes

`/en/development/type` explains how to choose the right delivery mode for a project stage, and what quality baseline still applies in every case.

## When to use each mode

Teams usually work in two modes:

| Mode | Best for | Primary goal | Typical cadence |
| :--- | :--- | :--- | :--- |
| Standard delivery | Clear requirements, wider impact, stable release expectations | Reduce risk and keep delivery traceable | Milestone or release based |
| Rapid iteration | Unclear requirements, experiments, MVP validation | Learn fast and shorten feedback loops | Daily or weekly |

Do not choose based on speed alone. Evaluate:

- **Requirement stability**: how likely the scope is to change.
- **Business risk**: whether the work touches payments, permissions, security, or critical paths.
- **Coordination cost**: how many roles and dependencies must stay aligned.

## Shared principles

Both modes should follow the same fundamentals:

- **Align on goals before coding**.
- **Ship in small slices and validate continuously**.
- **Keep documentation in sync with code and decisions**.
- **Raise blockers early instead of hiding schedule risk**.
- **Never drop the minimum quality bar**.

## Docker-first development

For modern team delivery, a **docker-first** approach is recommended: put as much of the project runtime, service dependencies, and integration chain into Docker as practical, without forcing every personal tool into containers.

### Recommended mindset

- **Aim for almost all-in Docker, but not docker-only**.
- **Prioritize team-wide consistency over personal machine differences**.
- **Use Docker to reduce friction**, not to create ceremony.

### Good candidates for Docker

- frontend, backend, BFF, and gateway services,
- databases and caches such as MySQL, PostgreSQL, Redis, or MongoDB,
- queues, object storage, and local mock services,
- test dependencies and integration environments,
- language runtimes and build environments such as Node, Java, Python, or Go.

### Things that do not need to be containerized

- the IDE itself,
- browsers,
- system-level proxy, input, or clipboard tools,
- design tools and collaboration apps,
- tools that depend heavily on local GUI or hardware access.

### Why it helps

- **Consistent environments** across the team.
- **Faster onboarding** for new contributors.
- **More stable integration** across service dependencies.
- **Closer parity with deployment environments**.
- **Better automation** across local development, testing, and CI.

### Tradeoffs

- file mounts and hot reload can be slower on some machines,
- debugging can become more complex,
- too many containers can create maintenance overhead.

A practical target is:

- keep `IDE + browser + Docker + Git` on the host,
- containerize project runtime dependencies,
- use `docker compose` to bring up the local stack,
- use scripts or `devcontainer` support to reduce setup cost.

### Best-fit scenarios

Docker-first works especially well when:

- team members often hit environment drift,
- local setup is heavy or fragile,
- multiple services must be integrated together,
- development, testing, and CI should stay as close as possible.

### Summary recommendation

If the question is “can we go all in Docker?”, the better answer is: **the project environment can be almost entirely Docker-based, but the team should stay docker-first rather than docker-only.**

## Standard delivery

Use the standard flow for formal projects, cross-team collaboration, and anything that requires predictable quality.

### 1. Clarify requirements

- Define business goals, user scenarios, edge cases, and priorities.
- Confirm PRD, prototypes, acceptance criteria, and external dependencies.
- Identify release windows, approvals, and data or infrastructure constraints.

**Expected outputs**

- Requirement notes or PRD
- Acceptance criteria
- Risk and dependency list

### 2. Design the solution

- Confirm architecture, module boundaries, data structures, API contracts, and failure handling.
- Review performance, security, observability, and rollback strategy.
- Break work into tasks and estimate effort.

**Expected outputs**

- Technical design
- API definition
- Timeline and owners

### 3. Prepare execution

- Align UI/UX details with design, product, and engineering.
- Set up branches, environments, test data, and configuration.
- Include logging, monitoring, permissions, and analytics requirements.

### 4. Implement

- Split work by module to reduce conflicts.
- Build core flows first, then cover secondary states and edge cases.
- Add tests or at least repeatable verification for critical logic.

### 5. Integrate and test

- Validate API fields, empty states, error paths, and permission checks.
- Run functional, regression, and key-path verification.
- Add staged rollout or rehearsal steps for higher-risk modules.

### 6. Review and release

- Use Pull Requests for code review.
- Confirm change notes, rollback plan, and release checklist.
- After release, watch logs, alerts, and business metrics.

### 7. Retrospective

- Capture requirement drift, testing gaps, release issues, and follow-up actions.
- Turn good patterns into reusable templates or standards.

## Rapid iteration

Rapid iteration does not mean “skip process”. It means “shorten the feedback loop”. It works well for prototypes, MVPs, internal tools, campaign pages, and product discovery.

### Suggested loop

1. **Pick the smallest validation target** for this round.
2. **Shrink the scope** and state what is intentionally out.
3. **Use lightweight design artifacts** such as sketches, short notes, or API agreements.
4. **Work in parallel** while aligning contracts early.
5. **Sync daily** on progress, blockers, and requirement changes.
6. **Keep something runnable every day**.
7. **Collect feedback early** from stakeholders or real users.
8. **Iterate from evidence**, not assumptions.

### Good fit when

- The business can tolerate trial and error.
- The module is not directly part of a critical transaction or security flow.
- Decision makers are available to unblock and reprioritize quickly.

### Common risks

- No clear “out of scope” boundary.
- Weak API alignment that creates rework later.
- Demo code quietly becoming production code without hardening.

## Switching modes

Most projects should move between the two modes:

- Start with rapid iteration during discovery.
- Move to standard delivery once the solution is stable.
- Use mixed pacing when core flows need stronger control than surrounding pages.

Switch back to standard delivery when:

- requirements stop changing frequently,
- the feature enters long-term maintenance,
- or the scope starts touching security, permissions, payments, or compliance.

## Minimum quality baseline

No matter the mode:

- Run self-checks before submitting code.
- Keep naming, structure, and readability consistent.
- Verify key pages, APIs, and failure paths.
- Merge through Pull Requests instead of pushing to protected branches.
- Define rollback steps, owners, and release watch metrics.

## Recommended artifacts

Keep at least these records:

- requirement summary or meeting outcome,
- technical note or lightweight design,
- task breakdown and owners,
- test or acceptance record,
- release notes and rollback plan.

## Summary

Standard delivery answers “how do we ship reliably”. Rapid iteration answers “how do we learn faster”. Mature teams know when to use each one and when to switch.
