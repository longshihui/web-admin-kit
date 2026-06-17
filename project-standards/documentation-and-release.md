# 文档与发布规范

本文件记录当前仓库的文档和发布规则。

## 文档结构

- 项目级文档位于根目录 `docs/`。
- 包级文档位于 `packages/<name>/docs/`。
- 每个包使用 `docs/README.md` 作为文档入口。
- 每个包使用 `docs/config.json` 声明文档结构、标题和顺序。
- 根级 `.vitepress` 读取各包配置，构建 `/packages/<name>/` 下的文档站点。

## 文档更新

- 公共 API、行为或使用方式变化时，必须更新对应包的 README 或 docs。
- API 变更优先更新 `docs/api.md`。
- 设计取舍或能力边界变化优先更新 `docs/design.md`。
- 新增文档页面时，同步更新对应的 `docs/config.json`。

## Changeset 判断

需要添加 changeset 的情况：

- 新增功能。
- 修复用户可感知 bug。
- 修改公共 API、默认行为、错误行为或依赖要求。
- 修改会影响发布产物的内容。

通常不需要添加 changeset 的情况：

- 只修改测试。
- 只修改内部实现且不影响发布产物和用户可感知行为。
- 只修改开发文档、注释或规范文档。

## 发版职责

- `changesets` 管理各包独立版本和包级 `CHANGELOG.md`。
- `release-it` 创建仓库级发布提交、git tag 和 GitHub Release。
- 推送 `v*` 标签后，GitHub Actions 执行 npm 发布和文档部署。
