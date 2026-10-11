# AGENTS.md — CryptoPanim

## Project Overview

CryptoPanim is an independent digital environment focused on pixel-art avatar creation and customization, with plans to expand into interactive virtual spaces and social experiences.

The project may use Next.js, React, JavaScript, TypeScript, CSS, SQL, Supabase, Vercel, and other technologies as development evolves. Always follow the actual repository architecture and existing conventions.

## Git and Branch Management

- All development work must take place on the `agents` branch.
- Never modify, commit to, merge into, or push changes to `main` unless the project owner explicitly requests it.
- Verify the current branch before making changes.
- Keep development changes on `agents` so they can be reviewed and tested independently.
- Do not merge `agents` into `main` without explicit authorization.
- Preserve unrelated user changes and avoid accidentally overwriting existing work.

## Development Guidelines

- Work directly on the requested features, fixes, and improvements.
- Inspect relevant code before modifying it.
- Prefer solutions that fit the existing architecture and avoid unnecessary refactoring.
- Preserve working functionality unless a change is required by the task.
- Use appropriate JavaScript, TypeScript, React, Next.js, and CSS conventions for the project.
- Maintain the visual identity and pixel-art characteristics of CryptoPanim.
- Add or update dependencies when reasonably necessary for the requested implementation.
- Update documentation when relevant.

## Testing and Verification

- Run relevant linting, type checks, tests, or builds when available and appropriate.
- Review the final changes and report any relevant issues.
- Never claim that checks have passed unless they have actually been executed.
- If a check fails, explain the failure and whether it affects the requested changes.

## Environment and Security

- Keep API keys, passwords, tokens, and other secrets out of source control.
- Use environment variables for sensitive configuration.
- Do not expose privileged credentials in client-side code.
- Take reasonable care when modifying authentication, database access, wallet integrations, or deployment configuration.
- Avoid destructive operations against production data or infrastructure without appropriate authorization.

## Working Style

- Make changes that directly serve the requested task.
- Avoid unrelated changes and unnecessary restructuring.
- Explain important technical decisions and report which files were modified.
- Keep the implementation aligned with the project's current goals and architecture.