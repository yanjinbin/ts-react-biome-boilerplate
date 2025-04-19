# React v18  + Vite v6 + + tailwind v4 +  zustand v5 + tanstack/query v5 + 


tailwind is css

tanstack/query is async query/mutation 
 
zustand is state management

biome v1.9.4 is linter for js/ts

pre-commit hook is to hook linters

// zustand 用法
// tanstack query用法
// react route 用法

// cd ssh 部署 构建
[text](.github/workflows/cd-development.yaml)
// yaml 和 biome.js 格式化
[text](.github/workflows/lint.yaml) 
// 调度上面 2 个文件
[text](.github/workflows/orchestrator.yaml)
关于 github  action 如何调度 workflow_call workflow_on result conclusion
https://chatgpt.com/share/6800e4bd-2498-8002-83ab-dba6dd87b8d2

https://{env}.api.dentistease.com/{serviceName}/{version}/api
env: dev,uat,staging,没有 prod 省略