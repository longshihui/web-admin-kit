# @colorless/menu-kit

## 1.0.1

### Patch Changes

- af29665: 将包说明调整为中文，并补充 npm 包的许可证、关键词、文档地址、问题反馈地址和 Git 仓库信息。
- 5be53c9: 显式声明所有包以 public 访问级别发布。

## 1.0.0

### Major Changes

- d37523d: 初始化基于 Changesets 的首个多包发布版本，并为各包建立独立版本与变更记录。
- 9f9eb12: 移除 `navigateByMenu` 固定导航 API，新增 `createMenuClickHandler` 策略式菜单点击帮助函数。共享包只负责封装禁用、无目标和目标类型分发逻辑，具体跳转策略由业务项目定义。

### Patch Changes

- 19b6c77: GitHub 自动化发布构建不再生成 sourcemap 产物。
