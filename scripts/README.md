# 数据爬取脚本

本目录包含用于爬取 IMDB Top250 电影数据的脚本。

## 脚本说明

### fetch-imdb-top250.mjs
从 IMDB 官网爬取 Top250 电影列表，包含：
- 电影排名
- 电影名称
- IMDB 评分
- 上映年份
- 海报图片

### fetch-imdb-puppeteer.mjs
使用 Puppeteer 爬取更详细的电影信息，包含：
- 导演信息
- 主演信息
- 电影简介
- 豆瓣评分和链接

## 生成的数据文件

### movies-list.json
电影列表数据，包含基本信息：
- imdb: IMDB ID
- order: 排名
- name: 中文名称
- score: IMDB 评分
- englishName: 英文名称
- year: 上映年份
- genres: 类型标签

### movies-detail.json
电影详情数据，包含详细信息：
- nickName: 电影别名
- director: 导演
- actors: 主演
- subject: 豆瓣详细信息（评分、演员、链接等）

### movie-translations.json
电影名称翻译映射表

## 使用方法

```bash
# 安装依赖
npm install

# 爬取基础列表
node scripts/fetch-imdb-top250.mjs

# 爬取详细信息（需要安装 Puppeteer）
node scripts/fetch-imdb-puppeteer.mjs
```

## 注意事项

- 爬虫脚本仅供学习交流使用
- 请遵守网站的 robots.txt 和使用条款
- 建议设置合理的请求间隔，避免对服务器造成压力
- 数据文件会在应用构建时自动复制到 `src/data` 目录
