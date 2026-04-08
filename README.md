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

### 核心功能
- ✅ 电影列表展示（分页）
- ✅ 电影详情页
- ✅ 搜索功能
- ✅ 图片懒加载
- ✅ 响应式设计

### 详情页增强 🆕
- ✅ 多平台评分对比（IMDB、豆瓣、Metascore）
- ✅ 详细电影信息（片长、国家、语言、分级）
- ✅ 导演和主演照片墙
- ✅ 编剧信息
- ✅ 获奖和票房数据
- ✅ 官方网站链接

### 技术特性
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

### 查看增强详情页 🆕

访问以下链接查看增强后的详情页：
- http://localhost:3000/view/tt0111161 - 肖申克的救赎（完整增强数据）
- http://localhost:3000/view/tt0068646 - 教父（完整增强数据）
- http://localhost:3000/view/tt0468569 - 黑暗骑士（完整增强数据）

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

### 获取增强数据 🆕

为所有电影获取增强信息（评分、获奖、票房等）：

```bash
# 1. 获取 OMDB API Key（免费）
# 访问 http://www.omdbapi.com/apikey.aspx

# 2. 设置环境变量
export OMDB_API_KEY=your_api_key_here

# 3. 运行爬虫
node scripts/fetch-enhanced-details.mjs

# 4. 应用数据
cp scripts/movies-detail-enhanced.json src/data/movies-detail.json

# 5. 重新构建
npm run build
```

详细说明请查看 [`scripts/FETCH_ENHANCED_DATA.md`](scripts/FETCH_ENHANCED_DATA.md)

## 数据来源

- [IMDB](https://www.imdb.com) - 电影信息
- [豆瓣电影](https://movie.douban.com) - 电影详情、评分、演员信息

## 爬虫脚本

`scripts/` 目录下包含数据爬取脚本：

### 基础爬虫
- `fetch-imdb-top250.mjs` - 从 IMDB 获取 Top250 列表
- `fetch-imdb-puppeteer.mjs` - 使用 Puppeteer 获取详细信息

### 增强爬虫 🆕
- `fetch-enhanced-details.mjs` - 获取增强信息（评分、获奖、票房等）
  - 支持 OMDB API
  - 支持豆瓣详细信息
  - 详见 `scripts/FETCH_ENHANCED_DATA.md`

### 数据文件
- `movies-list.json` - 电影列表数据
- `movies-detail.json` - 电影详情数据
- `movie-translations.json` - 电影名称翻译

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
