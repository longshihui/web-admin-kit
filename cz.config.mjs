export default {
  subjectLimit: 72,
  allowBreakingChanges: ['feat', 'fix', 'refactor'],
  allowCustomScopes: true,
  messages: {
    type: 'Select the type of change that you are committing:',
    scope: 'Select a scope for this change:',
    customScope: 'Input a custom scope:',
    subject: 'Write a short, imperative summary:\n',
    body: 'Provide a longer description (optional). Use "|" for new lines:\n',
    breaking: 'List breaking changes (optional). Use "|" for new lines:\n',
    footerPrefixesSelect: 'Select the issue prefix (optional):',
    customFooterPrefix: 'Input a custom issue prefix:',
    footer: 'List any issues closed by this change (optional). Example: #123:\n',
    confirmCommit: 'Confirm commit?'
  },
  types: [
    { value: 'feat', name: 'feat:     add a new feature' },
    { value: 'fix', name: 'fix:      fix a bug' },
    { value: 'docs', name: 'docs:     update documentation only' },
    { value: 'style', name: 'style:    format or style changes only' },
    { value: 'refactor', name: 'refactor: refactor code without behavior changes' },
    { value: 'perf', name: 'perf:     improve performance' },
    { value: 'test', name: 'test:     add or update tests' },
    { value: 'build', name: 'build:    change build tooling or dependencies' },
    { value: 'ci', name: 'ci:       change CI configuration' },
    { value: 'chore', name: 'chore:    routine maintenance work' },
    { value: 'revert', name: 'revert:   revert a previous commit' }
  ],
  scopes: [
    { value: 'repo', name: 'repo: workspace-wide changes' },
    { value: 'core', name: 'core: @lsh/core package' },
    { value: 'sdk', name: 'sdk: @lsh/sdk package' },
    { value: 'menu-kit', name: 'menu-kit: @lsh/menu-kit package' },
    { value: 'docs', name: 'docs: documentation site or package docs' },
    { value: 'release', name: 'release: release and changelog workflow' },
    { value: 'deps', name: 'deps: dependency updates' },
    { value: 'ci', name: 'ci: automation and pipeline config' }
  ]
}
