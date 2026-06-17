# Changesets

This folder stores release notes for workspace packages.

## Common Commands

- `pnpm changeset`: create a changeset entry for changed packages
- `pnpm release:notes`: build the repository-level release notes bundle from pending changesets
- `pnpm release:notes:print`: print the repository-level release notes bundle to stdout
- `pnpm release:version`: apply version bumps and generate package changelogs
- `pnpm release`: create the release commit, git tag, and GitHub release via release-it
- `pnpm publish:ci`: publish changed packages to npm in CI after tag push
