# CLAUDE

You are my primary coding assistant for this repository. You are running inside Claude Code with the `superpowers@claude-plugins-official` plugin installed. Use Superpowers’ skills and workflows automatically whenever they apply.

## Project

This is a **Next.js (App Router) TypeScript** application.

Assumptions:

- Uses App Router (`app/` directory) and React Server Components where appropriate
- Uses TypeScript with strict settings
- Uses the project’s existing state management, styling, and data-fetching patterns
- Uses the project’s existing testing stack (e.g. Jest / Vitest / Playwright / Testing Library)

## How to work

You have access to this repository and the Superpowers skills. Use tools to:

- Read and edit files in this repo
- Run shell commands (tests, lint, build, dev)
- Inspect git status and diffs

When my request involves changing code, reading files, running tests, or working with git in this repo, you should normally call the Superpowers tools and skills automatically.

Prefer **Superpowers’ built-in workflow** rather than ad‑hoc edits:

- Use **`brainstorming`** to clarify vague feature ideas and produce a concrete design before coding
- Use **`writing-plans`** to break work into small, testable tasks with exact files and checks
- Use **`subagent-driven-development`** or **`executing-plans`** to implement the plan
- Use **`test-driven-development`** to follow RED‑GREEN‑REFACTOR wherever it fits
- Use **`requesting-code-review`** and **`finishing-a-development-branch`** when reviewing or wrapping up a branch
- Use **`systematic-debugging`** and **`verification-before-completion`** when debugging or validating fixes
- Use **`diagnosing-superpowers`** if Superpowers behavior in this session seems wrong

You do not need me to call these skills by name; choose and trigger them yourself when appropriate.

## Next.js conventions

Follow these conventions unless the existing code clearly does something else:

- Use **App Router** patterns (`app/` layout, route groups, server components where possible)
- Keep **server components** for data fetching and heavy logic; keep **client components** for interactive UI
- Use **TypeScript** everywhere (no `any` except where it’s already used and unavoidable)
- Reuse existing:
  - data-fetching utilities (hooks, server actions, API wrappers)
  - UI components and design system primitives
  - helpers for authentication, routing, and error handling

When adding pages, layouts, or components:

- Mirror the existing route structure and file naming
- Co-locate components and tests the same way the repo already does
- Prefer small, focused components over giant ones

## Coding principles

1. **Small, focused diffs**

   - Prefer incremental changes to massive rewrites
   - Keep edits localized to the feature or bug being worked on

2. **Consistency over novelty**

   - Match existing patterns in this repo: folder structure, hooks, components, testing style
   - If there are multiple patterns, follow the most recent and most idiomatic one

3. **Strict TypeScript**

   - Avoid `any` and implicit `any`
   - Update types and interfaces when changing behavior or data shape
   - Keep props and return types aligned between server and client components

4. **Testing**

   - When changing behavior, update or add tests
   - Use Superpowers’ **`test-driven-development`** skill where it makes sense:
     - write a failing test
     - see it fail
     - write minimal code to pass
     - refactor
   - Follow the existing testing libraries and patterns in the repo

5. **Dependencies**
   - Do **not** add new dependencies without a clear reason
   - Prefer using what is already in `package.json`
   - If a new dependency is really needed, explain why and update only what’s necessary

## Using Superpowers automatically

When I ask for work like:

- “Build a new dashboard page with filters and pagination”
- “Fix this bug in the profile page where saving sometimes fails”
- “Optimize this route that’s slow in production”
- “Set up a basic test suite for the `app/(marketing)` section”

you should:

1. **Clarify and design**

   - Use **`brainstorming`** to refine requirements and propose a design in readable sections
   - Ask brief, targeted questions only when needed

2. **Plan**

   - Use **`writing-plans`** to produce a step‑by‑step, testable implementation plan
   - Include exact file paths and verification steps

3. **Implement**

   - Use **`subagent-driven-development`** or **`executing-plans`** to implement the plan task by task
   - Edit real files via tools instead of only replying with code snippets
   - Keep each task 2–5 minutes of work and verifiable

4. **Test and verify**

   - Use **`test-driven-development`** where appropriate
   - Run relevant tests and linters via tools
   - Use **`verification-before-completion`** to double‑check that the feature or fix really works

5. **Review and finish**
   - Use **`requesting-code-review`** to review your own work against the plan
   - Use **`finishing-a-development-branch`** to summarize changes and suggest how to merge, PR, or clean up

If something about Superpowers’ behavior seems wrong (skills not firing, plans ignored, lots of wasted tokens), use **`diagnosing-superpowers`** to analyze this session and adjust.

## Communication

When responding:

- Keep explanations concrete and tied to the actual files you inspected
- Reference paths (like `app/dashboard/page.tsx`) when describing changes
- When introducing a new pattern or refactor, explain briefly _why_ it fits this codebase
- Summarize what you changed and how to validate it (URL to open, tests to run, behaviors to check)

If I only ask conceptual questions (“Explain how Next.js server actions work”, “What’s the best way to handle caching here?”), you may answer without editing code, but you can still inspect the repo to ground the explanation in real examples.
