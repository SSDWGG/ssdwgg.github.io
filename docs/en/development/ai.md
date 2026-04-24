# AI-assisted Development

This page defines how to use AI tools in daily engineering work safely, effectively, and with clear human ownership.

## What AI should be in development

AI works best as:

- **an assistant** for drafts, code suggestions, summaries, and analysis,
- **an accelerator** for repetitive work and documentation,
- **a learning partner** for exploring unfamiliar concepts or codebases.

AI should not replace:

- business judgment,
- architecture ownership,
- security and compliance review,
- final accountability for code quality.

In short: **AI can speed up delivery, but engineers remain responsible for the result.**

## Core principles

### 1. Security first

- Never paste secrets, tokens, customer data, internal endpoints, or sensitive source code into unapproved tools.
- Share only the minimum context needed for the task.
- Use approved tools or isolated environments for incident work, sensitive systems, or private data.

### 2. Understand before adopting

- Do not submit AI output without review.
- Understand the logic, inputs, outputs, edge cases, and failure paths first.
- If you cannot explain it, do not merge it.

### 3. Same quality bar as human-written code

- AI-generated code must go through the same testing, review, and release standards.
- Pay extra attention to error handling, performance, concurrency, permissions, cleanup, logging, and observability.

### 4. Keep the process traceable

- Record important prompts, design choices, and verification results when they affect delivery decisions.
- Mention AI involvement in the PR so reviewers know where to focus.

## Good use cases

AI is most useful for work that is frequent, structured, and easy to verify:

- boilerplate code, types, forms, and API wrappers,
- tests, mocks, helper scripts, and fixtures,
- log analysis and common debugging paths,
- technical notes, change logs, and retrospectives,
- codebase explanations for faster onboarding,
- naming, refactor suggestions, and wording cleanup.

## Use carefully or avoid

| Scenario | Risk | Guidance |
| :--- | :--- | :--- |
| Core transaction, auth, security, or risk-control logic | High impact if wrong | Senior engineers should design and verify directly |
| Troubleshooting with sensitive data | Privacy and internal leakage | Use sanitized data or isolated tools |
| Shared libraries and foundations | Broad blast radius | Require stricter review and stronger tests |
| Legal, licensing, or policy content | Compliance exposure | Verify with humans and source documents |
| Unknown technical decisions | Confident but wrong answers | Trust official docs and experiments first |

## Recommended workflow

### Before asking AI

Define the problem clearly:

- What is the goal?
- What context matters?
- What does success look like?
- What constraints must be respected?
- What output format do you want?

A strong prompt often includes:

```md
Goal:
Background:
Tech stack:
Inputs and outputs:
Constraints:
Desired output:
```

### While using AI

Prefer step-by-step collaboration over “build the whole system” requests:

1. Ask it to break down the problem.
2. Solve one sub-problem at a time.
3. Ask for tradeoffs, edge cases, and assumptions.
4. Request verifiable output such as tests, checklists, or command steps.

This makes it easier to spot misunderstandings and validate results.

### Before accepting the output

Check at least:

- whether it solves the real requirement,
- whether it introduces hidden dependencies,
- whether edge cases and failures are covered,
- whether it matches the existing code style and structure,
- whether tests or docs must be added.

## Prompt templates

### Implementation prompt

```md
Act as a senior engineer and help with this task.

- Goal:
- Module or file responsibility:
- Tech stack:
- Constraints:
- Existing behavior that must stay unchanged:
- Expected output:

First explain the approach, then provide the implementation, risks, and test suggestions.
```

### Debugging prompt

```md
Please analyze this issue:

- Symptom:
- Reproduction steps:
- Logs or error messages:
- Recent changes:
- My current hypothesis:

Answer in this format:
possible causes -> how to verify -> fix suggestions
```

### Documentation prompt

```md
Please turn the following notes into team documentation.

- Audience:
- Usage scenario:
- Tone:
- Keep examples or not:
- Target structure:
```

## Review checklist

When AI contributed to an implementation, reviewers should look closely at:

- real alignment with business constraints,
- unnecessary abstraction or overengineering,
- missing error handling, state cleanup, or permission checks,
- fake APIs, fake configs, or fake type definitions,
- accidental dependency sprawl,
- missing tests or verification steps.

## Choosing the right tool

Instead of chasing the newest tool, match tools to the task:

| Tool type | Best for | Watch out for |
| :--- | :--- | :--- |
| IDE assistant | inline completion, small refactors, boilerplate | limited context, better for small edits |
| Chat assistant | analysis, docs, debugging discussion | hallucinations and outdated assumptions |
| Agent or CLI tool | multi-file edits, scripts, controlled automation | must manage permissions and execution scope |
| Local or private model | sensitive environments | extra maintenance and infra cost |

## Team conventions

- Mention AI usage scope in PR descriptions.
- Maintain internal prompt templates for repeatable tasks.
- Review where AI truly saved time and where it caused rework.
- Add stronger gates for high-risk modules when needed.

## Common mistakes

### Mistake 1: faster output means faster delivery

Not always. Poorly framed prompts often create more rework later.

### Mistake 2: long answers must be correct

No. Verify against official documentation, logs, and experiments.

### Mistake 3: AI reduces the need for fundamentals

The opposite is true. Strong engineering basics make AI more useful.

## Summary

Treat AI as a strong co-pilot, not autopilot. Good AI usage should make the team faster and more reliable, not more dependent on luck.
