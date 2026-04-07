# 电影信息增强指南

## 当前实现

已为详情页添加了以下增强信息展示：

### 📊 评分信息
- **IMDB评分** - IMDB用户评分和投票数
- **豆瓣评分** - 豆瓣用户评分和投票数
- **Metascore** - 专业影评评分

### 📋 基本信息
- **片长** - 电影时长
- **分级** - 电影等级（如PG-13, R等）
- **国家/地区** - 制片国家
- **语言** - 电影语言
- **上映日期** - 具体上映日期

### 👥 人员信息
- **导演** - 导演信息和照片
- **编剧** - 编剧名单
- **主演** - 主演照片和信息

### 🏆 其他信息
- **获奖信息** - 奥斯卡和其他奖项
- **票房** - 全球票房数据
- **官方网站** - 官方网站链接
- **又名** - 其他名称

## 数据获取方式

### 方式一：手动添加（适合少量电影）

直接编辑 `src/data/movies-detail.json`，为每部电影添加字段：

```json
{
  "/tt0111161": {
    "imdb": "/tt0111161",
    "nickName": "肖申克的救赎/刺激1995(台)/月黑高飞(港)",
    "director": "弗兰克·达拉邦特 Frank Darabont",
    "actors": "蒂姆·罗宾斯 Tim Robbins 摩根·弗里曼 Morgan Freeman",
    "runtime": 142,
    "country": "美国",
    "language": "英语",
    "doubanRating": "9.7",
    "doubanVotes": 2985634,
    "imdbRating": "9.3",
    "imdbVotes": "2,847,845",
    "metascore": "82",
    "rated": "R",
    "awards": "Nominated for 7 Oscars. 14 wins & 24 nominations total",
    "releaseDate": "1994-09-23",
    "writers": ["Stephen King", "Frank Darabont"],
    "boxOffice": "$58,300,000"
  }
}
```

### 方式二：使用爬虫脚本（适合批量获取）

#### 1. 使用 OMDB API（推荐）

**优点：**
- 官方API，数据准确
- 包含完整的IMDB信息
- 包含票房、获奖等信息

**步骤：**

1. 获取免费的 OMDB API Key
   - 访问：http://www.omdbapi.com/apikey.aspx
   - 填写邮箱，免费获取 API Key
   - 免费版限制：每天1000次请求

2. 设置环境变量
```bash
export OMDB_API_KEY=your_api_key_here
```

3. 运行爬虫脚本
```bash
node scripts/fetch-enhanced-details.mjs
```

4. 生成的文件：`scripts/movies-detail-enhanced.json`

5. 替换现有数据
```bash
cp scripts/movies-detail-enhanced.json src/data/movies-detail.json
```

#### 2. 使用豆瓣API（需要处理反爬）

**注意：** 豆瓣有严格的反爬机制，建议：
- 设置合理的请求间隔（至少2秒）
- 使用代理IP
- 模拟浏览器行为

示例代码已在 `scripts/fetch-enhanced-details.mjs` 中提供。

#### 3. 使用 TMDB API（推荐）

The Movie Database API 提供丰富的电影信息：

1. 获取API Key: https://www.themoviedb.org/settings/api
2. 免费版：无限制请求
3. 包含：海报、预告片、演员照片等

示例脚本：

```javascript
// fetch-tmdb.mjs
import fetch from 'node-fetch';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

async function fetchTMDBInfo(imdbId) {
  const url = `https://api.themoviedb.org/3/find/${imdbId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.movie_results && data.movie_results.length > 0) {
    const movie = data.movie_results[0];
    return {
      runtime: movie.runtime,
      budget: movie.budget,
      revenue: movie.revenue,
      originalLanguage: movie.original_language,
      productionCountries: movie.production_countries,
      spokenLanguages: movie.spoken_languages
    };
  }
  return null;
}
```

### 方式三：从第三方数据源导入

#### 1. Dataset from Kaggle
- IMDB 5000 Movie Dataset: https://www.kaggle.com/carolzhangdc/imdb-5000-movie-dataset
- The Movies Dataset: https://www.kaggle.com/rounakbanik/the-movies-dataset

#### 2. GitHub开源数据
- MovieLens Dataset: https://grouplens.org/datasets/movielens/
- IMDB Datasets: https://www.imdb.com/interfaces/

## 推荐的完整方案

### 阶段一：快速展示（已完成✅）
- 为前10-20部电影手动添加增强数据
- 展示详情页的新UI效果
- 验证类型定义和组件逻辑

### 阶段二：批量获取（建议）
1. 注册 OMDB API Key
2. 运行爬虫脚本获取所有电影的增强信息
3. 合并到现有数据文件

### 阶段三：持续更新
- 定期运行爬虫更新数据
- 添加新上映的Top250电影
- 更新评分和投票数

## 数据字段说明

| 字段名 | 类型 | 说明 | 来源 |
|--------|------|------|------|
| `runtime` | number | 片长（分钟） | OMDB/TMDB |
| `country` | string | 制片国家 | 豆瓣/OMDB |
| `language` | string | 语言 | 豆瓣/OMDB |
| `doubanRating` | string | 豆瓣评分 | 豆瓣 |
| `doubanVotes` | number | 豆瓣评分人数 | 豆瓣 |
| `imdbRating` | string | IMDB评分 | OMDB |
| `imdbVotes` | string | IMDB评分人数 | OMDB |
| `metascore` | string | Metascore评分 | OMDB |
| `rated` | string | 电影分级 | OMDB |
| `awards` | string | 获奖信息 | OMDB |
| `boxOffice` | string | 票房 | OMDB |
| `releaseDate` | string | 上映日期 | 豆瓣 |
| `writers` | string[] | 编剧 | 豆瓣/OMDB |
| `website` | string | 官方网站 | 豆瓣 |

## 注意事项

1. **API限制**
   - OMDB免费版：1000次/天
   - TMDB免费版：无限制
   - 豆瓣：需要处理反爬

2. **数据质量**
   - 优先使用官方API（OMDB/TMDB）
   - 豆瓣数据可能更新不及时
   - 注意数据一致性检查

3. **性能优化**
   - 使用缓存避免重复请求
   - 批量处理时分批次执行
   - 设置合理的延迟避免被封

4. **法律合规**
   - 遵守各平台的使用条款
   - 不要过度频繁请求
   - 数据仅供个人学习使用

## 示例：完整的数据获取流程

```bash
# 1. 设置API密钥
export OMDB_API_KEY=your_key_here

# 2. 运行爬虫
node scripts/fetch-enhanced-details.mjs

# 3. 检查数据
node -e "console.log(Object.keys(require('./scripts/movies-detail-enhanced.json')).length)"

# 4. 备份现有数据
cp src/data/movies-detail.json src/data/movies-detail.json.backup

# 5. 应用新数据
cp scripts/movies-detail-enhanced.json src/data/movies-detail.json

# 6. 重新构建
npm run build

# 7. 预览效果
npm run preview
```

## 后续优化方向

1. **动态数据加载**
   - 使用后台API动态获取数据
   - 实时更新评分信息
   - 减少前端包体积

2. **图片优化**
   - 使用CDN加载电影海报
   - 演员头像使用在线图片
   - 懒加载优化性能

3. **数据分析**
   - 添加评分趋势图
   - 票房排行榜
   - 获奖统计图表

4. **用户互动**
   - 用户评分功能
   - 收藏和分享
   - 评论系统
