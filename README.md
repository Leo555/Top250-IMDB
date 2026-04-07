# IMDB Top250

IMDB Top250 电影排行网站，使用 Vue 3 + TypeScript + Vite 构建。

## 技术栈

### 核心框架
- **Vue 3.5+** - 渐进式 JavaScript 框架
- **TypeScript 5.x** - JavaScript 的超集，提供类型安全
- **Vite 6.x** - 下一代前端构建工具

### 状态管理
- **Pinia** - Vue 3 官方推荐的状态管理库

### 路由
- **Vue Router 4** - Vue.js 官方路由

### UI 和样式
- **Tailwind CSS 3.x** - 实用优先的 CSS 框架

### 工具库
- **VueUse** - Vue 组合式 API 工具集
- **nprogress** - 页面加载进度条

## 功能特性

- ✅ 电影列表展示（分页）
- ✅ 电影详情页
- ✅ 搜索功能
- ✅ 图片懒加载
- ✅ 响应式设计
- ✅ 页面加载进度条
- ✅ 返回顶部按钮
- ✅ TypeScript 类型安全
- ✅ 路由懒加载
- ✅ 组件缓存（Keep-Alive）

## 开发

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 类型检查

```bash
npm run type-check
```

### 代码检查

```bash
npm run lint
```

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 数据来源

- [IMDB](https://www.imdb.com) - 电影信息
- [豆瓣电影](https://movie.douban.com) - 电影详情、评分、演员信息

## 爬虫脚本

`scripts/` 目录下包含数据爬取脚本：

- `fetchImdb.js` - 从 IMDB 获取 Top250 列表
- `douban.js` - 从豆瓣获取电影详情
- `fetchPic.js` - 下载电影海报
- `fetchDownload.js` - 获取下载链接

## 项目结构

```
.
├── public/              # 静态资源
├── src/
│   ├── components/      # 组件
│   ├── data/           # 数据文件
│   ├── router/         # 路由配置
│   ├── stores/         # Pinia Store
│   ├── types/          # TypeScript 类型定义
│   ├── views/          # 页面组件
│   ├── App.vue         # 根组件
│   ├── main.ts         # 入口文件
│   └── style.css       # 全局样式
├── static/             # 图片等静态资源
├── index.html          # HTML 模板
├── package.json
├── tailwind.config.js  # Tailwind 配置
├── tsconfig.json       # TypeScript 配置
└── vite.config.ts      # Vite 配置
```

## License

[MIT](LICENSE)
