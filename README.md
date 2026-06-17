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
pnpm changeset
pnpm release:notes:print
pnpm release
```

## Commit Workflow

- Run `pnpm commit` to open the interactive Commitizen prompt powered by `cz-git`.
- The prompt guides you through `type`, `scope`, `subject`, optional body, and issue footer fields.
- The existing Husky `commit-msg` hook still runs `commitlint`, so manual commits remain validated against the conventional commit format.

## Release Workflow

- Use `pnpm changeset` after changing one or more packages.
- Use `pnpm changeset:status` to review the pending package version bumps.
- Use `pnpm release:notes:print` to preview the repository-level GitHub Release notes bundle.
- Use `pnpm release` to run the full release flow: generate repository release notes, validate the workspace, apply package versions and changelogs, create the git tag, and publish the GitHub Release.
- After the `v*` tag is pushed, GitHub Actions runs `pnpm publish:ci` to publish changed packages to npm.
- Full release documentation lives in [release.md](./release.md).
