# Web Admin Kit

`web-admin-kit` is a pnpm workspace for framework-agnostic TypeScript packages used by web administration systems.

## Workspace

- Packages live in `packages/*`.
- Package names use the `@lsh/*` scope.
- Each package owns its documentation in `packages/<name>/docs`.
- VitePress scans package documentation and publishes it under `/packages/<name>/`.
- Vitest is the unified test runner.

## Commands

```bash
pnpm install
pnpm commit
pnpm test:run
pnpm build
pnpm docs:dev
```

## Commit Workflow

- Run `pnpm commit` to open the interactive Commitizen prompt powered by `cz-git`.
- The prompt guides you through `type`, `scope`, `subject`, optional body, and issue footer fields.
- The existing Husky `commit-msg` hook still runs `commitlint`, so manual commits remain validated against the conventional commit format.
