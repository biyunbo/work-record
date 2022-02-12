# vscode插件

## vscode架构

VSCode 是基于 Electron 构建的，可以使用nodejs随意读写本地文件、跨域请求、甚至创建一个本地server，这都是没有任何限制的，所以只要你想做，基本上没有不能实现的。主要由三部分构成。

- **Electron UI:**
Electron 是一个使用 JavaScript, HTML 和 CSS 等 Web 技术创建原生程序的框架，从实现上来看，Electron = Node.js + Chromium + Native API
- **Monaco Editor:**
Monaco Editor是微软开源项目, 为 VS Code 提供支持的代码编辑器，运行在浏览器环境中。编辑器提供代码提示，智能建议等功能。供开发人员远程更方便的编写代码，可独立运行
- **Extension Host:**
VSCode 的主进程和插件进程是分开管理的，Extension Host 就是用来管理插件进程的

### VSCode的进程结构
Electron App一般都有1个Main Process和多个Renderer Process
- 主进程（Main），一个 Electron 应用只有一个主进程。创建 GUI 相关的接口只由主进程来调用。
- 渲染进程（Renderer），每一个工作区（workbench）对应一个进程，同时是BrowserWindow实例。一个Electron项目可以有多个渲染进程。
- 插件进程（Extension），fork了渲染进程，每个插件都运行在一个NodeJS宿主环境中，即插件间共享进程。VSCode规定，插件不允许直接访问UI。
- Debug进程，一个特殊的插件进程。
- Search进程，搜索是密集型任务，单独占用一个进程。

## 插件环境
- node
- npm install -g yo generator-code 脚手架

```
npm install -g yo generator-code
yo code
```
**重点：**
- 入口文件=》`extension.js`（插件逻辑）
- 配置文件=》`package.json`（插件配置）

package内容：engines，activationEvents，contributes，main

extension内容：TreeDataProvider，createWebviewPanel等vscodeApi
