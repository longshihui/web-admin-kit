---
"@colorless/menu-kit": major
---

移除 `navigateByMenu` 固定导航 API，新增 `createMenuClickHandler` 策略式菜单点击帮助函数。共享包只负责封装禁用、无目标和目标类型分发逻辑，具体跳转策略由业务项目定义。
