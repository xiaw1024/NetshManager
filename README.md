<!--
 * @Author: xiawang1024
 * @Date: 2025-06-23 14:04:08
 * @LastEditTime: 2025-06-23 14:28:44
 * @LastEditors: xiawang1024
 * @Description: 
 * @FilePath: \NetshManager\README.md
 * 工作，生活，健康
-->
# Netsh Manager - 可视化端口转发管理工具

一个简单、轻量的 Windows `netsh` 端口转发规则可视化管理工具。通过直观的图形界面，轻松添加、查看和删除端口转发规则，无需记忆和手动输入繁琐的命令行。

![App Screenshot](https://user-images.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/assets/placeholder.png)
*(注意: 请将上面的截图 URL 替换为您自己的项目截图)*

---

## ✨ 特性

- **可视化管理**: 在一个清晰的 Web 界面上查看所有端口转发规则。
- **便捷操作**: 轻松添加和删除规则，无需接触命令行。
- **轻量高效**: 基于 Vue 3 和 Tailwind CSS 构建的现代化前端界面。
- **跨平台兼容**: 后端基于 Node.js，理论上可在支持 `netsh` 的所有 Windows 版本上运行。
- **免安装发布**: 使用 `pkg` 打包为单一的 `.exe` 可执行文件，无需在目标机器上安装 Node.js 环境。
- **自动化构建**: 集成 GitHub Actions，实现推送标签时自动打包并创建 Release。

## 🛠️ 技术栈

- **前端**: [Vue 3](https://vuejs.org/) + [Vite](https://vitejs.dev/) + [Tailwind CSS](https://tailwindcss.com/)
- **后端**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **打包**: [@yao-pkg/pkg](https://github.com/yao-pkg/pkg)
- **自动化**: [GitHub Actions](https://github.com/features/actions)

## 🚀 如何使用 (最终用户)

1. 前往本项目的 [GitHub Releases](https://github.com/YOUR_USERNAME/YOUR_REPO/releases) 页面。
2. 下载最新版本的 `netsh-manager.exe` 文件。
3. **直接双击运行 `netsh-manager.exe`**。
4. 程序会自动请求管理员权限（请允许），然后启动服务并打开您的默认浏览器，显示管理界面。

## 🧑‍💻 如何开发 (开发者)

### 先决条件

- [Node.js](https://nodejs.org/en/download/) (建议 v18 或更高版本)
- [pnpm](https://pnpm.io/installation)

### 安装

1. 克隆仓库:

    ```bash
    git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
    cd YOUR_REPO
    ```

2. 安装所有工作区的依赖:

    ```bash
    pnpm install
    ```

### 开发模式

您需要同时启动前端开发服务器和后端服务。

1. **启动后端服务**:

    ```bash
    pnpm run server
    ```

    *(注意: 在开发模式下，后端服务以普通权限运行，可能无法成功添加或删除 `netsh` 规则。)*

2. **启动前端开发服务器**:
    打开**另一个**终端，运行:

    ```bash
    pnpm run dev
    ```

    现在，您可以在浏览器中访问 Vite 提供的地址 (通常是 `http://localhost:5173`) 来查看和调试前端界面。

## 📦 构建

项目提供了两种构建方式：

1. **仅构建前端**:

    ```bash
    pnpm run build
    ```

    这会将 Vue 应用打包到 `frontend/dist` 目录。

2. **打包为 .exe 可执行文件**:

    ```bash
    pnpm run build:exe
    ```

    这个命令会首先执行前端构建，然后使用 `pkg` 将后端服务和前端产物一起打包成一个独立的 `.exe` 文件。最终的可执行文件会存放在 `./netsh-manager-workspace.exe`。

---

*请将所有 `YOUR_USERNAME/YOUR_REPO` 替换为您自己的 GitHub 用户名和仓库名。*
