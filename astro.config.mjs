import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://zhallen122.github.io',
  base: '/stanford-cs336-study-notes',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex]
    })
  },
  integrations: [
    starlight({
      title: 'CS336 · 从零学语言模型',
      description: '写给没有 AI 背景的软件工程师的 Stanford CS336 学习笔记',
      locales: {
        root: {
          label: '简体中文',
          lang: 'zh-CN'
        }
      },
      favicon: '/favicon.svg',
      customCss: ['katex/dist/katex.min.css', './src/styles/custom.css'],
      components: {
        Footer: './src/components/AccessibleFooter.astro',
        PageSidebar: './src/components/CollapsiblePageSidebar.astro'
      },
      social: [
        {
          icon: 'github',
          label: 'GitHub 仓库',
          href: 'https://github.com/ZHallen122/stanford-cs336-study-notes'
        }
      ],
      editLink: {
        baseUrl: 'https://github.com/ZHallen122/stanford-cs336-study-notes/edit/main/'
      },
      lastUpdated: true,
      pagination: true,
      sidebar: [
        {
          label: '从这里开始',
          items: [
            { label: '欢迎与使用方式', slug: 'start-here' },
            { label: '学习路线图', slug: 'start-here/roadmap' },
            { label: '环境准备', slug: 'start-here/setup' }
          ]
        },
        {
          label: '基础知识 · 按需补齐',
          collapsed: false,
          items: [
            { label: '给 SDE 的概念地图', slug: 'foundations/concept-map' },
            { label: '数学最小集', slug: 'foundations/math' },
            { label: 'PyTorch 与张量', slug: 'foundations/pytorch' },
            { label: 'Transformer block 与 Attention', slug: 'foundations/transformer-attention' }
          ]
        },
        {
          label: '课程笔记',
          collapsed: false,
          items: [
            { label: '01 · Overview & Tokenization', slug: 'lessons/01-tokenization' },
            { label: '02 · PyTorch 与资源核算', slug: 'lessons/02-pytorch-resources' },
            { label: '03 · Architecture & Hyperparameters', slug: 'lessons/03-architecture-hyperparameters' },
            { label: '04 · Attention Alternatives & MoE', slug: 'lessons/04-attention-alternatives-moe' },
            { label: '后续课程占位与计划', slug: 'lessons/coming-next' }
          ]
        },
        {
          label: '作业路线',
          collapsed: true,
          items: [
            { label: '总览', slug: 'assignments' },
            { label: 'Assignment 1 · Basics', slug: 'assignments/a1' }
          ]
        },
        {
          label: '随手查',
          collapsed: true,
          items: [
            { label: '术语库 A–Z', slug: 'reference/glossary' },
            { label: '符号与形状速查', slug: 'reference/notation' }
          ]
        },
        {
          label: '关于这份笔记',
          collapsed: true,
          items: [
            { label: '写作与无障碍规范', slug: 'meta/writing-guide' },
            { label: '笔记模板', slug: 'meta/note-template' }
          ]
        }
      ]
    })
  ]
});
