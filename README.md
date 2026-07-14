# CS336 Study Notes

面向没有 AI 背景的软件工程师的 Stanford CS336 学习笔记。站点使用 Astro + Starlight，内容以 Markdown/MDX 编写，可自动部署至 GitHub Pages。

## 本地运行

```bash
npm install
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

## 内容结构

- `src/content/docs/start-here/`：开始学习与前置知识
- `src/content/docs/foundations/`：SDE 需要补齐的基础
- `src/content/docs/lessons/`：按课程顺序的讲义
- `src/content/docs/assignments/`：作业路线与工程提示
- `src/content/docs/reference/`：术语库和速查表
- `src/content/docs/meta/`：写作规范和贡献指南

新增页面时复制 `src/content/docs/meta/note-template.mdx`，并在 `astro.config.mjs` 的 sidebar 中登记。普通内容优先使用 `.md`；需要术语气泡或 Starlight 组件时使用 `.mdx`。

## 部署

推送到 `main` 后，`.github/workflows/deploy.yml` 会构建并发布站点。首次使用需在仓库 **Settings → Pages → Source** 中选择 **GitHub Actions**。

部署地址预设为：`https://zhallen122.github.io/stanford-cs336-study-notes/`。

## 内容原则

1. 先用软件工程类比建立心智模型，再给数学定义。
2. 每个新术语首次出现时解释，并链接到术语库。
3. 一段只表达一个主要观点；长过程拆成步骤。
4. 代码示例注明输入、输出、张量形状和运行成本。
5. 区分课程原文、个人理解和延伸阅读。

课程资料版权归 Stanford 与原作者所有。本仓库是非官方学习笔记。
