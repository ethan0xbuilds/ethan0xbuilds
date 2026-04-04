# 个人网站需求文档 (PRD)

> **项目名称**: ethan0xbuilds 个人网站  
> **技术栈**: Astro 4.x（纯静态输出）  
> **域名**: https://me.oasaka.xyz（二级域名，GitHub Pages 托管）  
> **仓库**: https://github.com/ethan0xbuilds/ethan0xbuilds  
> **部署**: GitHub Pages + 自定义域名  
> **日期**: 2026-04-04  
> **注意**: 该仓库同时承担 GitHub Profile README 和个人网站双重用途，根目录 `README.md` 是 Profile README，网站代码在 `src/` 目录下

---

## 1. 项目定位与目标

### 1.1 核心定位

面向招聘方（HR、技术 Leader）和潜在合作方（外包客户）的 **技术专家型个人展示站**。

### 1.2 目标用户

- 国内外技术公司招聘负责人
- 外包项目的潜在客户
- 技术社区同行（V2EX、GitHub 等渠道来的访客）

### 1.3 关键目标

1. 30 秒内让访客理解"这个人是做什么的、技术水平如何"
2. 展示 6 年软件开发经验的深度（而非广度堆叠）
3. 提供清晰的联系方式和简历下载入口
4. 作为长期维护的个人品牌主页（Blog、影书记录等）

---

## 2. 整体设计风格

### 2.1 主题：模拟 Linux 桌面

网站整体模拟一个 Linux 桌面环境（非 macOS 风格），页面即是"桌面"，各功能模块以"窗口"形式呈现。

### 2.2 视觉风格

- **色调**: 深色系为主，保持"极客/工程师"调性
- **配色方案（参考当前版本，可微调）**:
  - 背景: 深灰/近黑 (`#1a1a2e` 或类似)
  - 窗口背景: 半透明深色，带轻微毛玻璃效果 (`backdrop-filter: blur`)
  - 强调色: 偏暖的橙/rust 色（与简历一致，`#c75b39` 左右），用于链接、高亮
  - 文字: 浅灰白 (`#e0e0e0`) 主文字，暗灰色次要文字
  - 窗口控制按钮: 经典红黄绿三色圆点
- **字体**:
  - 等宽字体为主: `JetBrains Mono`（已在使用），用于标题、代码、技术关键字
  - 正文可用 `Inter` 或 `system-ui` 提升可读性
  - 中文 fallback: `"Noto Sans SC"` 或 `"PingFang SC"`
- **核心氛围**: 像是一个资深工程师的工作桌面，克制但不冷漠、专业但有人味

### 2.3 与 PostHog 的差异化

| 维度 | PostHog | 本站 |
|------|---------|------|
| OS 风格 | macOS, 浅色暖调 | Linux, 深色冷调 |
| 用途 | SaaS 产品营销 | 个人职业展示 |
| 内容量 | 数百页文档 | 5-7 个窗口 |
| 复杂度 | 全功能窗口管理器 | 轻量拖拽+关闭 |

**原则: 借鉴 PostHog 的完成度和细节打磨，但保持自己的 Linux 终端调性。**

---

## 3. 桌面系统核心交互

### 3.1 桌面（Desktop）

- 深色背景，可选带微妙的纹理或渐变（避免纯黑）
- 顶部状态栏（类 Linux topbar）:
  - 左侧: `ethan@desktop · ● online · ~/home`（当前已有，保留）
  - 右侧: 当前时间（实时更新）
- 桌面上不放图标，所有导航通过底部 Dock 触发

### 3.2 Dock（底部导航栏）

- 固定在页面底部居中
- 包含以下图标（每个对应一个窗口）:
  - 👤 About
  - 📂 Projects
  - 📝 Blog
  - 🎬 Movies
  - 📚 Books
  - ✉️ Contact
  - 📄 Resume（点击直接下载 PDF，不弹窗）
- **交互细节**:
  - Hover 时图标放大（类 macOS Dock 弹跳效果，但幅度克制）
  - 点击后图标下方出现小圆点指示器表示"窗口已打开"
  - 图标使用线条风格图标（推荐 Lucide Icons），不用 emoji
  - Dock 背景: 半透明 + 毛玻璃

### 3.3 窗口系统

#### 窗口通用规范

- **窗口标题栏**:
  - 左侧: 红黄绿三色圆点（关闭/最小化/最大化）
  - 中间: 窗口标题（如 `about.md`、`projects/`）
  - 标题栏可拖拽移动窗口
- **窗口行为**:
  - 支持拖拽移动（drag）
  - 支持关闭（点击红色按钮）
  - 可选支持最大化（双击标题栏或点击绿色按钮）
  - 最小化行为: 窗口缩小回 Dock 图标（可选，优先级低）
  - 点击窗口时提升 z-index（focus 状态）
  - **Focus / Blur 视觉区分**:
    - Focus 窗口: 正常亮度，标题栏三色按钮有颜色
    - Blur（非焦点）窗口: 整体略暗或降低透明度，三色按钮变灰
- **窗口打开动画**: 从 Dock 图标位置缩放弹出（`scale(0.8)` → `scale(1)` + `opacity` 过渡，约 200ms）
- **窗口层次感**:
  - 每个窗口加 `box-shadow`（如 `0 8px 32px rgba(0,0,0,0.4)`）
  - 多窗口打开时有清晰的前后层级关系
- **窗口默认位置**: 每个窗口有预设的初始位置，错开排列避免完全重叠
- **响应式**: 移动端窗口自动全屏，Dock 简化为底部 tab bar

---

## 4. 各窗口详细规格

### 4.1 About 窗口 (`about.md`)

**窗口标题**: `about.md`

**内容结构（自上而下）**:

1. **头像**: 当前使用的卡通/像素风头像，居中或靠左，尺寸约 80x80px
2. **Tagline**: `AN OBSCURE ENGINEER, BUILDING IN PUBLIC.`（保留当前文案）
3. **简介段落**（新增，2-3 句话）:
   > 6 年软件开发经验，近 5 年深耕华为云 OpenStack 控制面。主导云原生化改造、性能调优与消息中间件治理。开源贡献者，prometheus/client_python 核心 PR 合并（73 轮 review，4 个月）。
4. **技能区域**（重新组织，不再是纯罗列）:
   - 用类似 `neofetch` 或终端输出的格式展示：
   ```
   ethan@workstation
   -----------------
   Languages:    Python · Go · Java · Shell
   Frameworks:   Spring Boot · Django · Vue.js
   Cloud:        Docker · K8s · OpenStack · Nginx/OpenResty
   Monitoring:   Prometheus · Jenkins · pprof · JMeter
   Data:         RabbitMQ · Pulsar · RocketMQ · Redis · MySQL
   Tools:        Git · Linux · gRPC
   ```
   - 每行的 label 用强调色，值用默认白色，模拟终端输出
5. **亮点数据**（可选，3 个关键数字卡片）:
   - `5+` 年华为云 OpenStack 生产环境
   - `1000+` 人日节省（30+ 组件云原生化）
   - `73` 轮 review 合并开源 PR

### 4.2 Projects 窗口 (`projects/`)

**窗口标题**: `projects/`（模拟目录浏览）

**展示方式**: 类似终端的 `ls -la` 文件列表视觉，但每个条目可点击展开或跳转。

**项目列表（基于简历提取 + 开源项目）**:

| 项目名 | 类型标签 | 一句话描述 |
|--------|---------|-----------|
| `openstack-cloudnative` | `work` | OpenStack 组件云原生化改造，30+ 组件迁移 K8s |
| `prometheus-client-python` | `oss` | prometheus/client_python 核心 PR，支持 mTLS/HTTPS |
| `cps-performance` | `work` | CPS 服务性能优化，接口延迟降低 80-90% |
| `cloudmatrix-384` | `work` | 超节点管理平台前后端开发，Go + Jenkins |
| `rabbitmq-governance` | `work` | OpenStack 控制面消息中间件治理方案 |
| `ai-context-vault-cn` | `side` | AI 上下文管理工具（面向中文开发者） |
| `personal-website` | `side` | 本站，模拟 Linux 桌面的 Astro 个人网站 |

**每个项目卡片包含**:
- 项目名（等宽字体，强调色）
- 类型标签: `work` / `oss` / `side`（不同颜色小标签）
- 一句话描述
- 技术栈 tags（小灰色标签，如 `Go` `K8s` `Python`）
- 可选: GitHub 链接图标（仅开源项目）

**交互**: 点击项目可展开详情面板（在窗口内展开，不开新窗口），展示：
- 项目背景（2-3 句话）
- 核心贡献（关键成果）
- 技术栈详情

### 4.3 Blog 窗口 (`blog/`)

**窗口标题**: `blog/`

**内容**: 博客文章列表，使用 Astro Content Collections 管理 `.md` 文件。

**列表样式**:
```
2026-04-01  如何用 Claude Code 构建个人网站
2026-03-15  我的 OpenStack 云原生化实践总结
2026-03-01  从华为云到自由职业：一个工程师的选择
```
- 每行: 日期（灰色等宽）+ 标题（白色，hover 变强调色）
- 模拟终端 `ls` 输出的排版
- 点击标题在窗口内加载文章详情（窗口标题变为 `blog/article-slug.md`）

**文章详情页**:
- Markdown 渲染，保持终端/深色主题风格
- 顶部: 标题、日期、阅读时长
- 底部: 返回列表的链接
- 代码块: 深色语法高亮（如 `shiki` 的 `tokyo-night` 主题）

### 4.4 Movies 窗口 (`movies.json`)

**窗口标题**: `movies.json`

**定位**: 展示看过的电影，传达个人品味，增加人格化维度。

**数据管理方案**: 用 Astro Content Collections + JSON/YAML 文件管理。站点仓库内维护一个 `src/content/movies/` 目录，每部电影一个条目。长期目标可对接 Obsidian 作为录入层，通过脚本同步到仓库。

**展示方式**: 类 JSON 格式化视图，每部电影显示为：
```json
{
  "title": "Blade Runner 2049",
  "year": 2017,
  "rating": "★★★★★",
  "watched": "2026-03",
  "comment": "视觉与叙事的极致平衡"
}
```

**布局**: 卡片网格或列表，每个条目包含：
- 电影名（中英文）
- 年份
- 个人评分（5 星制）
- 观看时间
- 一句话短评（可选）
- 海报缩略图（可选，后续迭代加入，注意版权）

**排序**: 按观看时间倒序

### 4.5 Books 窗口 (`books.json`)

**窗口标题**: `books.json`

**结构与 Movies 类似**, 字段调整为：
```json
{
  "title": "Designing Data-Intensive Applications",
  "author": "Martin Kleppmann",
  "status": "reading",
  "rating": "★★★★★",
  "comment": "分布式系统圣经"
}
```

**特殊交互**: 用 `status` 字段分组 — `reading`（在读）/ `finished`（已读）/ `want`（想读），模拟终端的 `grep` 筛选按钮。

### 4.6 Contact 窗口 (`contact.md`)

**窗口标题**: `contact.md`

**内容**:
```
GitHub:    ethan0xbuilds     →  链接
Email:     ethan0xbuilds@proton.me
X:         @ethan0xbuilds    →  链接
Telegram:  ethan0xbuilds     →  链接
Discord:   ethan0xbuilds
```
- 用终端样式排版（label 对齐，等宽字体）
- 链接用强调色，hover 带下划线
- 可选: 底部加一行 `$ echo "Feel free to reach out"` 的打字机效果

### 4.7 Resume（无窗口）

- Dock 中的 Resume 图标点击后 **直接触发 PDF 下载**
- 文件名: `Ethan_Chen_Software_Engineer_Resume.pdf`（英文命名，对海外招聘友好）
- PDF 存放在 `public/` 目录下

---

## 5. 视觉打磨清单（优先级排序）

### P0 — 必须实现

- [ ] 窗口 focus/blur 状态视觉区分（亮度/三色按钮颜色）
- [ ] 窗口 box-shadow 层次感
- [ ] Dock hover 放大动效
- [ ] Dock 已打开窗口的小圆点指示器
- [ ] 窗口打开/关闭动画（scale + opacity 过渡）
- [ ] 顶部状态栏实时时间
- [ ] 移动端响应式（窗口全屏化 + Dock 简化）

### P1 — 应该实现

- [ ] 窗口毛玻璃背景效果（`backdrop-filter: blur`）
- [ ] About 区域 neofetch 风格技能展示
- [ ] Projects 类型标签颜色编码
- [ ] Blog 文章内代码块语法高亮（shiki tokyo-night）
- [ ] 桌面背景微妙纹理/渐变（非纯黑）

### P2 — 可以后续迭代

- [ ] 窗口最大化/最小化完整实现
- [ ] 窗口 resize 拖拽
- [ ] Movies/Books 海报/封面图加载
- [ ] 打字机动画效果（Contact 的 echo 命令）
- [ ] 桌面右键菜单（彩蛋性质）
- [ ] 屏幕保护程序（长时间无操作触发，彩蛋）

---

## 6. 技术实现建议

### 6.1 项目结构（基于现有仓库）

**当前仓库结构** (`ethan0xbuilds/ethan0xbuilds`):
```
.github/workflows/         # GitHub Actions CI（已配置，用于 GitHub Pages 部署）
docs/superpowers/          # 已有文档资源
public/                    # 静态资源目录
src/                       # Astro 源码（现有代码，需要在此基础上改造）
README.md                  # GitHub Profile README（保留不动）
astro.config.mjs           # Astro 配置（output: static, site: https://www.oasaka.xyz）
package.json               # 依赖: astro ^4.16.19（当前无 Tailwind）
avatar.png                 # 头像（建议移入 public/）
```

**改造后的目标结构**:
```
src/
├── components/
│   ├── Desktop.astro          # 桌面容器（全屏布局）
│   ├── TopBar.astro           # 顶部状态栏
│   ├── Dock.astro             # 底部导航栏
│   ├── Window.astro           # 通用窗口组件（可复用 props: title, id）
│   └── windows/
│       ├── AboutWindow.astro
│       ├── ProjectsWindow.astro
│       ├── BlogWindow.astro
│       ├── BlogPostView.astro # 博客文章详情视图
│       ├── MoviesWindow.astro
│       ├── BooksWindow.astro
│       └── ContactWindow.astro
├── content/
│   ├── blog/                  # Markdown 博客文章（Astro Content Collections）
│   ├── movies/                # 电影数据 (.md with YAML frontmatter)
│   └── books/                 # 书籍数据 (.md with YAML frontmatter)
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   └── index.astro            # 单页应用，桌面即首页
├── scripts/
│   └── window-manager.ts      # 窗口管理逻辑（拖拽、z-index、状态）
└── styles/
    └── global.css             # 全局样式、CSS 变量
public/
├── resume.pdf                 # 可下载简历
├── avatar.png                 # 头像（从根目录迁移过来）
└── favicon.ico
```

**需要新增的依赖**:
- `@astrojs/tailwind` — CSS 工具类（可选，也可以纯手写 CSS）
- `nanostores` + `@nanostores/preact` — 轻量状态管理（窗口状态）
- `@astrojs/preact` 或 `@astrojs/react` — 交互岛屿（窗口管理器需要客户端交互）
- `shiki` — 代码语法高亮（Blog 文章内代码块，Astro 内置支持）

**注意**: 当前 `package.json` 只有 `astro` 一个依赖，保持精简是好事。根据实际需要逐步添加，不要一次引入所有依赖。

### 6.2 窗口管理器核心逻辑

由于 Astro 默认是静态的，窗口交互需要客户端 JS。建议：

- 使用 Astro 的 `client:load` 或 `client:visible` 指令加载交互组件
- 窗口状态管理可用 `nanostores`（Astro 生态推荐的轻量状态库）
- 或者用一个 React/Vue island 来管理整个桌面（因为桌面本身就是一个高交互区域）
- 拖拽推荐: 原生 Pointer Events API 手写，避免引入重型库

### 6.3 SEO 与可访问性

- 虽然是模拟桌面，但 `index.astro` 的 HTML 应包含完整的语义化内容（`<main>`、`<section>`、`<h1>` 等）
- `<title>`: `Ethan Chen — Software Engineer`
- `<meta description>`: 包含关键词（6 years, backend, Go, Kubernetes, OpenStack）
- Open Graph 和 Twitter Card meta tags
- 窗口内容即使 JS 未加载也应可见（SSR 渲染默认展开 About）

### 6.4 性能

- 首屏只渲染桌面 + Dock + 默认打开的 About 窗口
- 其他窗口内容懒加载（点击 Dock 时加载）
- 图片资源（头像等）使用 Astro Image 优化
- 字体: `JetBrains Mono` 通过 Google Fonts 或本地 woff2 加载，设 `font-display: swap`

### 6.5 部署架构

#### 背景

当前 `www.oasaka.xyz` 部署在 VPS 上，域名实际指向 VLESS 服务端，非 VLESS 流量通过 fallback 到 Nginx 提供网页。个人网站此前通过 GitHub Actions SSH 推送到 VPS 的 Nginx 目录。

#### 改造方案：域名拆分

| 域名 | 用途 | 托管 |
|------|------|------|
| `www.oasaka.xyz` | VLESS fallback 伪装页 | VPS Nginx（保持不变） |
| `me.oasaka.xyz` | 个人网站（本项目） | GitHub Pages |

**为什么要拆分**:
1. 个人网站包含真实身份信息（GitHub、邮箱、简历），不应与代理服务绑定在同一入口
2. GitHub Pages 零运维，push 即部署，不需要 SSH 推送到 VPS
3. 伪装页面保持稳定，不会因为网站代码更新意外影响代理服务

#### VPS 伪装页处理

`www.oasaka.xyz` 上的 Nginx 伪装页应替换为一个低维护的静态内容（如企业模板页或简单占位页），不再放个人真实信息。

#### GitHub Pages 部署步骤

1. **DNS 配置**: 在域名 DNS 管理面板添加一条 CNAME 记录:
   ```
   me.oasaka.xyz  →  CNAME  →  ethan0xbuilds.github.io
   ```

2. **Astro 配置更新** (`astro.config.mjs`):
   ```javascript
   import { defineConfig } from 'astro/config';

   export default defineConfig({
     output: 'static',
     site: 'https://me.oasaka.xyz',
   });
   ```

3. **GitHub Pages 自定义域名**: 仓库 Settings → Pages → Custom domain 填入 `me.oasaka.xyz`，勾选 Enforce HTTPS

4. **GitHub Actions 工作流** (`.github/workflows/deploy.yml`): 简化为标准 GitHub Pages 部署，不再需要 SSH 推送:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   permissions:
     contents: read
     pages: write
     id-token: write

   jobs:
     build:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 20
         - run: npm install
         - run: npm run build
         - uses: actions/upload-pages-artifact@v3
           with:
             path: dist/

     deploy:
       needs: build
       runs-on: ubuntu-latest
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       steps:
         - id: deployment
           uses: actions/deploy-pages@v4
   ```

5. **CNAME 文件**: 在 `public/` 目录下创建 `CNAME` 文件，内容为:
   ```
   me.oasaka.xyz
   ```
   这样每次构建都会自动包含在 `dist/` 输出中，防止 GitHub Pages 丢失自定义域名配置。

#### 二级域名选择

推荐 `me.oasaka.xyz`，备选 `ethan.oasaka.xyz` 或 `dev.oasaka.xyz`。最终由用户决定。

---

## 7. 内容数据参考（摘自简历）

> 以下内容已脱敏，部署时请替换为完整信息。

### 个人信息

- 姓名: *** (脱敏)
- 职位: 软件开发工程师
- 经验: 6 年
- 邮箱: ethan0xbuilds@proton.me
- GitHub: ethan0xbuilds

### 教育背景

- 福建农林大学 · 软件工程 本科（2016.09 – 2020.06）
  - 团支部书记，两次获校级奖学金
  - 毕业论文发表于核心期刊（基于深度学习的图像分割方向）
- 国立清华大学（台湾） · Computer Science 本科交换（2018.09 – 2019.01）
  - 本科期间表现优秀，经学校选拔推荐赴台交流
  - Unity3D 游戏课程项目入选台湾高校游戏设计联赛

### 工作经历

**华为云计算技术有限公司（OD）— 软件开发工程师**（2021.08 – 2026.03）

项目一：OpenStack 组件云原生化
- 背景：华为云 OpenStack 管理面依赖裸机 CPS 组件，缺乏自动弹性扩缩容能力
- 贡献：使用 Keystone 鉴权完成 Prometheus Exporter 采集指标上报；针对 prometheus/client_python 不支持 HTTPS/mTLS 问题，设计实现 TLS 上下文切换方案，支持 TLS 与 mTLS 双模式（73 轮 review，4 个月合并）；负责 Keystone 与 wrap-trigger 容器化改造，完成 30+ 组件改造，节约 1000+ 人天

项目二：CPS 服务性能优化
- 背景：华为云公有云管理面服务 CPS，主要负载为大规模的增量同步、云服务管理、HA 管理及配置分发
- 贡献：解决 cps-config 组件的性能瓶颈，实际效果 90% 的配置获取请求直接从本地缓存返回，接口延迟降低 80-90%

项目三：CloudMatrix 384 超节点管理平台
- 背景：CloudMatrix 384 超节点通过互联互通将 384 张昇腾卡进行深度整合
- 贡献：使用 Go 语言开发逻辑超节点模块后端；使用 JMeter 完成 30+ 接口压测

项目四：控制面消息中间件治理
- 背景：华为云 OpenStack 控制面采用 RabbitMQ 作为消息中间件之间的编解码与 RPC
- 贡献：设计 RabbitMQ 局点音改方案，开发生产环境音改自动化脚本；完成 RabbitMQ 平滑迁移到 Pulsar 的 POC

**福建福链科技有限公司 — 软件开发工程师**（2020.05 – 2021.07）

- 区块链存证平台的预研、设计、开发与交付
- 首次实现数据生产者模块，通过多条从 MySQL、Oracle 等数据库发送至 RocketMQ
- 负责区块链存证平台的部署，涉及 Tomcat、Nginx、Samba、ElasticSearch 等

### 其他亮点

- 发明专利一项：一种容器编排系统提升效力方法及装置
- 毕业论文发表于核心期刊

---

## 8. Movies / Books 数据管理方案

### 推荐方案：Obsidian 录入 → Git 同步 → Astro 构建

1. **录入层**: 在 Obsidian vault 中维护 `movies/` 和 `books/` 文件夹，每条记录是一个 `.md` 文件，用 YAML frontmatter 存储结构化数据
2. **同步层**: Obsidian vault 通过 Git（obsidian-git 插件）推送到网站仓库的 `src/content/` 目录
3. **展示层**: Astro Content Collections 自动读取并渲染

**示例文件** (`src/content/movies/blade-runner-2049.md`):
```yaml
---
title: "Blade Runner 2049"
titleCN: "银翼杀手2049"
year: 2017
director: "Denis Villeneuve"
rating: 5
watched: "2026-03"
comment: "视觉与叙事的极致平衡"
---
```

**窗口内以 JSON 格式渲染**（呼应桌面主题），但数据源实际是 Markdown + frontmatter。

---

## 9. 交付标准

- [ ] 所有 P0 项完成
- [ ] 5 个核心窗口（About/Projects/Blog/Contact + Resume 下载）可用
- [ ] Movies 和 Books 窗口框架就绪，支持数据加载
- [ ] 移动端可用（窗口全屏、Dock 适配）
- [ ] Lighthouse Performance > 90
- [ ] 代码提交至 `ethan0xbuilds/ethan0xbuilds` 仓库
- [ ] GitHub Actions 工作流改为标准 GitHub Pages 部署（不再 SSH 推送到 VPS）
- [ ] `public/CNAME` 文件包含二级域名（如 `me.oasaka.xyz`）
- [ ] `astro.config.mjs` 的 `site` 字段更新为新域名
- [ ] `README.md`（GitHub Profile README）保持不变，不受网站改造影响
- [ ] VPS 上 `www.oasaka.xyz` 的 Nginx 伪装页独立维护，与本项目解耦
