# Release Guide

This repository uses a hybrid release flow:

- `changesets` manages independent package versions and package-level changelogs
- `release-it` creates the repository release commit, git tag, and GitHub Release
- GitHub Actions publishes changed packages to npm after a `v*` tag is pushed

## Responsibilities

### Changesets

- Source of truth for release intent lives in `.changeset/*.md`
- `pnpm changeset` creates a pending release entry
- `pnpm release:version` runs `changeset version`
- Each changed package gets its own `CHANGELOG.md`

### Release-It

- `pnpm release` runs the repository release flow
- `pnpm release:notes` builds the repository-level release notes bundle
- `release-it` creates the release commit
- `release-it` creates the `v*` git tag
- `release-it` creates the GitHub Release

### GitHub Actions

- `.github/workflows/publish-npm.yml` listens to `v*` tags
- CI runs `pnpm publish:ci`
- `changeset publish` only publishes packages with version changes

## Release Scripts

```bash
pnpm changeset
pnpm changeset:status
pnpm release:notes
pnpm release:notes:print
pnpm release:version
pnpm release
pnpm publish:ci
```

## Daily Workflow

### 1. Add a changeset

Run:

```bash
pnpm changeset
```

Pick the affected packages, choose `patch` / `minor` / `major`, and write a short summary.

Example:

```md
---
"@lsh/hooks": minor
"@lsh/shared": patch
---

新增 hooks 能力，并补充 shared 辅助方法。
```

### 2. Review pending release scope

Run:

```bash
pnpm changeset:status
pnpm release:notes:print
```

- `pnpm changeset:status` shows which packages will be bumped
- `pnpm release:notes:print` shows the repository-level GitHub Release bundle

## Release Flow

### 1. Start the release

Run:

```bash
pnpm release
```

The release flow performs these steps:

1. `pnpm release:notes`
2. `pnpm check:push`
3. `pnpm build`
4. `pnpm docs:build`
5. `pnpm release:version`
6. create release commit
7. create `v*` git tag
8. push commit and tag
9. create GitHub Release

### 2. What gets generated

- Repository release notes bundle: `.git/.release-notes.md`
- Package version bumps: `packages/*/package.json`
- Package changelogs: `packages/*/CHANGELOG.md`
- Repository release tag: `v*`

### 3. What happens in CI

After the tag is pushed:

- `publish-npm.yml` publishes changed packages to npm
- `deploy-pages.yml` rebuilds and deploys the documentation site

## Release Notes Model

This repository keeps two levels of change records:

- Package level: each package has its own `CHANGELOG.md`
- Repository level: GitHub Release contains an aggregated summary for all packages in the release

The repository-level release notes are generated from pending `.changeset/*.md` files before `changeset version` runs.

This keeps package changelogs and GitHub Release notes aligned while preserving independent package versions.

## Recommended Commands

### Preview a release

```bash
pnpm changeset:status
pnpm release:notes:print
```

### Apply versions without tagging

```bash
pnpm release:version
```

### Run the full release flow

```bash
pnpm release
```

## Notes

- Do not let `release-it` manage workspace package versions
- Do not publish with `release-it`; npm publish is handled by `changeset publish`
- Git tags represent repository releases, not necessarily a single package version
