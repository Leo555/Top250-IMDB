# IMDB Top250 重构任务清单

## 项目目标
将 Vue 2 + Webpack 项目重构为现代化的 Vue 3 + TypeScript + Vite 应用

## 技术栈选型

### 核心框架
- **Vue 3.5+** - 最新稳定版，Composition API
- **TypeScript 5.x** - 类型安全
- **Vite 6.x** - 快速开发和构建工具

### 状态管理
- **Pinia** - Vue 3 官方推荐的状态管理库（替代 Vuex）
  - 更简洁的 API
  - 完整的 TypeScript 支持
  - 开箱即用的 DevTools 支持

### 路由
- **Vue Router 4** - Vue 3 官方路由

### UI 和样式
- **Tailwind CSS 3.x** - 原子化 CSS 框架
  - 快速开发响应式布局
  - 减少自定义 CSS
  - 更好的性能（按需生成）

### 工具库
- **VueUse** - Vue 3 组合式 API 工具集
  - `useIntersectionObserver` - 图片懒加载
  - `useDebounceFn` - 防抖
  - `useTitle` - 动态标题
- **@vueuse/head** - 管理 head 标签（SEO）
- **nprogress** - 页面加载进度条（保留）

### 开发工具
- **ESLint 9.x + flat config** - 代码检查
- **Prettier** - 代码格式化
- **TypeScript ESLint** - TS 支持
- **Vitest** - 单元测试（可选）

### 构建优化
- **vite-plugin-pwa** - PWA 支持
- **vite-plugin-compression** - Gzip/Brotli 压缩
- **rollup-plugin-visualizer** - 包分析

## 功能模块

### 1. 首页 - 电影列表
- [ ] 电影卡片组件
- [ ] 分页组件
- [ ] 图片懒加载（IntersectionObserver）
- [ ] 搜索功能

### 2. 电影详情页
- [ ] 电影信息展示
- [ ] 演员表/导演信息
- [ ] 相关推荐（可选）

### 3. 全局组件
- [ ] Header（Logo + 搜索框）
- [ ] Footer
- [ ] Loading 骨架屏
- [ ] BackTop 返回顶部

### 4. 路由设计
```
/                 - 首页（第1页）
/page/:page       - 分页
/view/:id         - 电影详情
/search/:keyword  - 搜索结果
```

### 5. 状态管理（Pinia Store）
- **movies** - 电影数据
  - 电影列表
  - 当前页码
  - 加载状态
  - 搜索结果

### 6. 性能优化
- [ ] 路由懒加载
- [ ] 图片懒加载
- [ ] 组件按需加载
- [ ] PWA 离线缓存
- [ ] Gzip/Brotli 压缩

### 7. SEO 优化
- [ ] 动态 title
- [ ] meta description
- [ ] Open Graph 标签
- [ ] 结构化数据（JSON-LD）

### 8. 数据处理
- [ ] 重新获取 movies.json 数据文件
- [ ] 保留 static/ 下的图片资源
- [ ] 添加类型定义文件

## 重构步骤

### Phase 1: 项目初始化
- [x] 清理旧文件
- [x] 初始化 Vite + Vue 3 + TypeScript 项目
- [x] 配置 Tailwind CSS
- [x] 配置 ESLint + Prettier
- [x] 配置路径别名

### Phase 2: 基础架构
- [x] 配置 Vue Router
- [x] 配置 Pinia Store
- [x] 创建类型定义文件
- [x] 设置全局样式

### Phase 3: 核心功能开发
- [x] 开发电影卡片组件
- [x] 开发电影列表页
- [x] 开发电影详情页
- [x] 开发搜索功能
- [x] 开发分页组件

### Phase 4: 优化和完善
- [x] 添加 Loading 状态
- [x] 添加错误处理
- [x] 添加 SEO 优化
- [x] 性能测试和优化

### Phase 5: 部署准备
- [x] 配置生产环境构建
- [ ] 配置 PWA（可选）
- [ ] 添加部署脚本（可选）

## 保留内容
- `src/data/movies.json` - 电影数据
- `static/` - 图片资源目录
- `scripts/` - 爬虫脚本（可选保留）

## 废弃内容
- 所有 `.old` 文件
- Webpack 配置
- Element UI 组件库
- Vuex store
- Vue 2 组件代码
- Less 样式文件

## 验收标准
- [x] TypeScript 编译无错误
- [x] ESLint 检查通过
- [x] 所有页面功能正常
- [x] 响应式布局正常
- [ ] 性能指标良好（Lighthouse > 90）
- [x] 构建产物合理（< 500KB gzip）

## 当前状态

✅ **重构完成！**

项目已成功从 Vue 2 + Webpack 迁移到 Vue 3 + TypeScript + Vite 技术栈。

### 完成的功能
- 电影列表展示（分页）
- 电影详情页
- 搜索功能
- 图片懒加载
- 响应式设计
- 页面加载进度条
- 返回顶部按钮

### 技术栈
- Vue 3.5 + TypeScript 5.7
- Vite 6.x
- Pinia（状态管理）
- Vue Router 4
- Tailwind CSS 3.x
- VueUse（工具库）

### 下一步
- 添加单元测试（Vitest）
- 添加 E2E 测试（Playwright）
- 配置 CI/CD
- 添加 PWA 支持
- 优化性能（Lighthouse 评分）

## 数据维护记录

### 2026-04-07 数据完整性与海报补充
- ✅ 修复所有250部电影的导演和演员信息
- ✅ 成功下载249张电影海报
- ✅ 为《肖申克的救赎》创建占位海报
- ✅ 数据完整性检查全部通过

**修复内容：**
1. 改进 `fetch-imdb-puppeteer.mjs`，自动访问电影详情页补充导演和演员数据
2. 创建 `download-images.mjs` 批量下载海报图片
3. 创建 `check-data.mjs` 数据完整性检查工具

**维护命令：**
```bash
# 检查数据完整性
node scripts/check-data.mjs

# 重新抓取电影数据（每月运行）
npm run fetch

# 下载缺失的海报图片
node scripts/download-images.mjs
```
