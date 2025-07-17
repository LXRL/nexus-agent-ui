# Nexus Agent UI

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=3178C6" alt="TypeScript">
  <img src="https://img.shields.io/badge/Vite-5-blue?logo=vite&logoColor=646CFF" alt="Vite">
  <img src="https://img.shields.io/badge/Ant_Design-5-blue?logo=ant-design&logoColor=0170FE" alt="Ant Design">
  <img src="https://img.shields.io/badge/Redux-Toolkit-blue?logo=redux&logoColor=764ABC" alt="Redux Toolkit">
  <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License">
</p>

<p align="center">
  一个为 <strong>Nexus Agent</strong> 对话式分析平台打造的现代化、响应式前端界面。
</p>

---

**Nexus Agent UI** 是一个企业级的Web应用，它为后端的AI分析代理提供了一个功能强大且用户友好的交互界面。用户可以通过自然的对话方式进行数据探索、趋势分析和归因洞察，并将有价值的发现沉淀为BI平台中的资产。本项目从零开始，完整地实现了从核心功能到管理后台，再到最终体验优化的全过程。

## ✨ 功能特性

- **流式对话接口**: 实时展示AI的思考过程，包括文本、SQL、数据表格和推荐图表的逐块渲染。
- **完整的会话管理**: 支持新建、加载、切换和管理多轮对话历史。
- **增强的分析能力**:
  - **一键生成图卡**: 将分析结果快速封装并发布为BI平台资产。
  - **AI趋势归因**: 对分析结果进行深度追问，以结构化报告的形式展示关键驱动因素。
- **完备的知识库管理**:
  - **资源管理**: 支持动态注册、编辑和删除AI可用的数据表等资源。
  - **资源组管理**: 允许将资源进行逻辑分组，便于管理。
  - **权限管理**: 可将资源或资源组的访问权限精细化地分配给不同用户。
- **现代化用户体验**:
  - **精致的主题系统**: 支持亮色/暗色模式自动切换，且高度可定制。
  - **全面的状态反馈**: 对加载、错误、空状态等场景进行了统一且友好的处理。
  - **响应式布局**: 完美适配从大屏桌面到移动设备的各种屏幕尺寸。

## 🏗️ 架构设计

本项目采用前后端分离的现代Web应用架构，前端遵循**分层设计**的思想，以实现**高内聚、低耦合**的目标。

- **API服务层 (`/src/api`)**: 封装所有与后端`Nexus Agent`的HTTP通信。通过集中的`apiClient`实例，自动处理`baseURL`、`Content-Type`以及用户认证所需的`X-User-ID`请求头，业务代码无需关心这些底层细节。
- **状态管理层 (`/src/store`)**: 使用`Redux Toolkit`作为集中的状态管理方案。通过`Slice`对不同业务领域的状态（如用户认证、会话列表）进行划分，逻辑清晰，易于扩展。
- **UI组件层 (`/src/components`)**: 包含原子化、可复用的UI组件。遵循“展示型组件”和“容器型组件”的分离思想，大部分组件只负责根据传入的`props`渲染界面，不包含业务逻辑。
- **业务逻辑/编排层 (`/src/pages` & `/src/hooks`)**:
  - **页面 (`pages`)**: 作为功能的汇集点，负责组合UI组件，并通过调用`hooks`来处理业务逻辑和数据获取。
  - **自定义钩子 (`hooks`)**: 将可复用的逻辑（如流式消息处理、用户认证状态）从组件中抽离，便于在不同地方复用和测试。

## 🛠️ 技术栈

- **核心框架**: React 18, TypeScript, Vite 5
- **UI 组件库**: Ant Design 5.x
- **状态管理**: Redux Toolkit
- **路由**: React Router 6
- **HTTP客户端**: Axios
- **图表**: ECharts for React
- **代码高亮**: React Syntax Highlighter
- **代码规范**: ESLint, Prettier

## 📁 目录结构

```
/nexus-agent-ui
├── public/                # 静态资源，会被直接复制到输出目录 (如 favicon.ico)
├── src/
│   ├── api/               # API 服务层
│   │   ├── index.ts         # 配置并导出全局 Axios 实例
│   │   ├── conversationService.ts # 对话相关API
│   │   └── knowledgeService.ts    # 知识库相关API
│   ├── assets/            # 项目静态资源 (图片, 字体等)
│   ├── components/        # 可复用UI组件
│   │   ├── common/        # 原子/通用组件
│   │   ├── feature/       # 特定功能组件
│   │   └── layout/        # 布局组件
│   ├── constants/         # 应用级别常量
│   ├── hooks/             # 自定义 React Hooks
│   ├── pages/             # 页面级组件
│   │   ├── Chat/          # 聊天页面及其相关文件
│   │   └── Management/    # 管理后台页面及其相关文件
│   ├── router/            # 路由配置
│   ├── store/             # 全局状态管理 (Redux)
│   │   └── slices/        # Redux Toolkit 的 Slice 模块
│   ├── styles/            # 全局样式与主题变量
│   │   └── _variables.css # CSS 主题变量 (亮/暗模式)
│   ├── types/             # TypeScript 类型定义
│   └── utils/             # 通用工具函数
├── .env.development       # 开发环境变量文件
├── .env.production        # 生产环境变量文件
├── index.html             # 应用入口HTML
├── package.json           # 项目依赖与脚本
├── tsconfig.json          # TypeScript 配置文件
└── vite.config.ts         # Vite 配置文件
```

#### 目录详情说明

- **`src`**: 存放所有核心源代码。
- **`api/`**: **API 服务层**。
  - `index.ts`: 创建并配置全局的 `axios` 实例。在这里我们设置了 `baseURL`，并使用请求拦截器为每个请求自动附加 `X-User-ID` 认证头。
  - `*.service.ts`: 按业务领域（如 `conversationService`, `knowledgeService`）划分的API调用文件。每个文件导出一系列与该业务相关的异步函数，供上层调用。
- **`components/`**: **可复用的UI组件**。这是项目中最核心的UI部分，遵循原子设计思想。
  - `common/`: 与业务完全解耦的通用原子组件。例如我们创建的 `DataDisplayWrapper`，用于统一处理加载、错误和空状态。
  - `layout/`: 构成应用整体骨架的布局组件，如 `AppLayout` 和 `Sidebar`。
  - `feature/`: 为特定功能开发的、可能在多处复用的复杂组件。例如 `AnalysisResult` 用于渲染AI分析结果，`CreateCardModal` 用于创建图卡。
- **`hooks/`**: **自定义Hooks**。用于封装和复用带有状态的逻辑。例如，可以将流式消息的处理逻辑封装在 `useConversationStream` 中，让页面组件更简洁。
- **`pages/`**: **页面级组件**。作为各个路由的直接渲染对象，是功能的“编排者”。它们负责从 `store` 获取状态，调用 `hooks` 或 `api` 服务处理业务逻辑，并将数据传递给 `components` 中的展示型组件。
- **`store/`**: **全局状态管理**。
  - `store.ts`: 使用 `configureStore` 创建并配置 Redux 的 `store` 实例。
  - `slices/`: 存放各个业务模块的 `slice` 文件。例如 `authSlice.ts` 管理用户认证信息，`conversationSlice.ts` 管理会话列表和当前会话状态。
- **`styles/`**: **全局样式**。
  - `_variables.css`: 定义全局CSS变量，是实现应用主题（包括亮色/暗色模式）的核心文件。
  - `global.css`: 定义全局基础样式、引入主题变量文件和进行样式重置。
  - 每个组件旁边的 `*.module.css` 文件提供了组件作用域的局部样式，避免全局污染。
- **`types/`**: **TypeScript 类型定义中心**。在这里我们集中定义了整个应用的数据结构，如 `Message`, `Resource`, `PermissionGrant` 等，为项目提供了强大的类型安全保障。
- **根目录文件**:
  - `.env.*`: 存放不同环境（开发、生产）的变量，特别是 `VITE_API_BASE_URL`，实现了配置与代码的分离。
  - `vite.config.ts`: 前端构建工具 Vite 的配置文件。

## 🚀 快速开始

### 1. 先决条件

- [Node.js](https://nodejs.org/) (建议版本 >= 18.0.0)
- [pnpm](https://pnpm.io/) 或 `npm`/`yarn`

### 2. 安装

```bash
# 克隆仓库
git clone [https://github.com/your-username/nexus-agent-ui.git](https://github.com/your-username/nexus-agent-ui.git)

# 进入项目目录
cd nexus-agent-ui

# 安装依赖
npm install
```

### 3. 配置环境变量

在项目根目录下创建一个 `.env.development` 文件，并配置后端API的地址。

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### 4. 运行项目

```bash
# 启动开发服务器
npm run dev
```

打开浏览器并访问 `http://localhost:5173` (或终端提示的其他端口)。

## 📜 可用脚本

- `npm run dev`: 启动开发服务器。
- `npm run build`: 构建用于生产环境的静态文件到 `dist` 目录。
- `npm run lint`: 使用 ESLint 检查代码规范。
- `npm run preview`: 在本地预览生产构建后的应用。

## 🤝 贡献

欢迎提交问题 (issues) 和拉取请求 (pull requests)。

## 📄 开源许可

本项目采用 [MIT](https://opensource.org/licenses/MIT) 许可。