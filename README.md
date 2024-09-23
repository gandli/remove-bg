# Remove-BG 图片背景清除项目

参考[remove-bg](https://github.com/ducan-ne/remove-bg),一个基于 [Remove.bg](https://www.remove.bg/) API 的图片背景自动移除项目，用户可以上传图片并通过 API 自动移除背景，生成透明背景的图像。

## 功能

- 用户可以上传图片
- 自动去除图片背景
- 支持多种格式的图片：JPG, PNG 等
- 生成具有透明背景的 PNG 图片
- 在页面上预览处理后的图片

## 项目结构

```
├── public/                     # 静态资源
│   └── images/                 # 图片存放目录
├── src/                        # 源代码目录
│   ├── components/             # 可重用组件
│   ├── pages/                  # 页面文件
│   │   └── index.tsx           # 项目主页
│   └── styles/                 # 样式文件
├── .env                        # 环境变量文件，存储 Remove.bg API 密钥
├── next.config.js              # Next.js 配置文件
├── package.json                # 项目依赖管理
└── README.md                   # 项目说明文档
```

## 环境要求

- Node.js 版本 >= 14.x
- Yarn 或 npm 作为包管理器
- [Remove.bg API 密钥](https://www.remove.bg/api)

## 安装步骤

1. **克隆项目**

   ```bash
   git clone https://github.com/yourusername/remove-bg-project.git
   cd remove-bg-project
   ```

2. **安装依赖**

   使用 `yarn` 或 `npm` 安装依赖：

   ```bash
   yarn install
   # 或者
   npm install
   ```

3. **配置环境变量**

   创建 `.env` 文件，并添加 `Remove.bg` API 密钥：

   ```bash
   touch .env
   ```

   在 `.env` 文件中添加以下内容：

   ```env
   REMOVE_BG_API_KEY=your_api_key_here
   ```

4. **启动开发服务器**

   启动 Next.js 开发服务器：

   ```bash
   yarn dev
   # 或者
   npm run dev
   ```

   服务器将在 `http://localhost:3000` 启动。

## 使用说明

1. 进入项目主页，通过图片上传控件选择一张图片。
2. 点击“移除背景”按钮，系统将通过 `remove.bg` API 自动移除背景。
3. 处理完成后，可以预览生成的透明背景图片，并下载保存。

## 主要依赖

- [Next.js](https://nextjs.org/) - React 框架
- [Remove.bg API](https://www.remove.bg/api) - 图片背景移除 API
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架用于快速设计
- [Axios](https://axios-http.com/) - 用于处理 API 请求

## 部署到 Vercel

1. 将项目代码推送到 GitHub 仓库。
2. 在 [Vercel](https://vercel.com/) 上创建一个新项目并连接到你的 GitHub 仓库。
3. 配置环境变量：在 Vercel 的项目设置中，添加 `REMOVE_BG_API_KEY`，其值为你的 API 密钥。
4. 点击 `Deploy` 按钮，等待 Vercel 自动构建和部署项目。

## 注意事项

- 该项目依赖 `remove.bg` 的 API 进行背景移除，因此每次调用都会消耗你的 API 额度，请确保你的 API 密钥有效且有足够的调用次数。
- 处理后的图片会存储在服务器或客户端中，请确保符合使用条款。

## 常见问题

### 如何获取 Remove.bg API 密钥？

访问 [Remove.bg API 注册页面](https://www.remove.bg/api)，注册账户后，你会获得一个 API 密钥。

### 图片上传后没有效果，为什么？

请检查 `.env` 文件中的 `REMOVE_BG_API_KEY` 是否正确设置，并确保有足够的调用额度。同时，可以在开发者工具中查看网络请求是否成功。

## 贡献指南

如果你有任何建议或改进，欢迎通过提交 PR 或 issue 贡献你的力量。

## 许可证

该项目基于 MIT 许可证开源。