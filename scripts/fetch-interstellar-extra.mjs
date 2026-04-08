#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../src/data')
const IMDB_ID = '/tt0816692'

// TMDB API (免费，但需要注册获取key)
// 注册地址: https://www.themoviedb.org/settings/api
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY'

async function fetchTMDBInfo(imdbId) {
  const cleanId = imdbId.replace('/', '')
  
  // 先通过IMDB ID查找TMDB ID
  const findUrl = `https://api.themoviedb.org/3/find/${cleanId}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
  
  console.log(`正在从 TMDB 获取信息: ${cleanId}`)
  
  try {
    const response = await fetch(findUrl)
    const data = await response.json()
    
    if (data.movie_results && data.movie_results.length > 0) {
      const movie = data.movie_results[0]
      
      return {
        budget: movie.budget ? `$${movie.budget.toLocaleString()}` : null,
        revenue: movie.revenue ? `$${movie.revenue.toLocaleString()}` : null,
        runtime: movie.runtime,
        originalLanguage: movie.original_language,
        overview: movie.overview,
        tagline: movie.tagline,
        voteAverage: movie.vote_average,
        voteCount: movie.vote_count,
        homepage: movie.homepage
      }
    }
    
    console.log('TMDB 未找到该电影')
    return null
  } catch (error) {
    console.error(`TMDB 获取失败: ${error.message}`)
    return null
  }
}

// 从 Douban 获取信息（需要豆瓣ID）
async function fetchDoubanBySearch(movieName) {
  const searchUrl = `https://search.douban.com/movie/subject_search?search_text=${encodeURIComponent(movieName)}`
  
  console.log(`尝试从豆瓣搜索: ${movieName}`)
  
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    })
    
    if (!response.ok) {
      console.error(`豆瓣搜索失败: ${response.status}`)
      return null
    }
    
    const html = await response.text()
    
    // 尝试提取第一个搜索结果的豆瓣ID
    const doubanIdMatch = html.match(/subject\/(\d+)/)
    
    if (doubanIdMatch) {
      return { doubanId: doubanIdMatch[1] }
    }
    
    return null
  } catch (error) {
    console.error(`豆瓣搜索失败: ${error.message}`)
    return null
  }
}

// 手动添加已知信息
function getManualInfo() {
  return {
    country: '美国, 英国, 加拿大',
    language: '英语',
    writers: ['乔纳森·诺兰', '克里斯托弗·诺兰'],
    releaseDate: '2014-11-07(美国)',
    aka: '星际启示录(港) / 星际效应(台) / 星际之间 / 星际空间 / 星际',
    website: 'https://www.interstellarmovie.com/',
    budget: '$165,000,000',
    budgetInt: 165000000
  }
}

async function main() {
  console.log('=== 补充获取星际穿越信息 ===\n')
  
  // 读取现有数据
  const moviesDetailPath = path.join(DATA_DIR, 'movies-detail.json')
  const moviesDetail = JSON.parse(fs.readFileSync(moviesDetailPath, 'utf-8'))
  
  const existingDetail = moviesDetail[IMDB_ID]
  
  const enhanced = { ...existingDetail }
  
  // 1. 添加手动收集的信息
  console.log('--- 添加手动收集的信息 ---')
  const manualInfo = getManualInfo()
  
  enhanced.country = manualInfo.country
  enhanced.language = manualInfo.language
  enhanced.writers = manualInfo.writers
  enhanced.releaseDate = manualInfo.releaseDate
  enhanced.aka = manualInfo.aka
  enhanced.website = manualInfo.website
  enhanced.budget = manualInfo.budget
  
  console.log(`  ✓ 国家: ${manualInfo.country}`)
  console.log(`  ✓ 语言: ${manualInfo.language}`)
  console.log(`  ✓ 编剧: ${manualInfo.writers.join(', ')}`)
  console.log(`  ✓ 上映日期: ${manualInfo.releaseDate}`)
  console.log(`  ✓ 又名: ${manualInfo.aka}`)
  console.log(`  ✓ 官网: ${manualInfo.website}`)
  console.log(`  ✓ 预算: ${manualInfo.budget}`)
  
  // 2. 尝试从TMDB获取
  if (TMDB_API_KEY !== 'YOUR_TMDB_API_KEY') {
    console.log('\n--- 从 TMDB 获取 ---')
    const tmdbInfo = await fetchTMDBInfo(IMDB_ID)
    
    if (tmdbInfo) {
      if (!enhanced.budget && tmdbInfo.budget) enhanced.budget = tmdbInfo.budget
      if (!enhanced.website && tmdbInfo.homepage) enhanced.website = tmdbInfo.homepage
      
      console.log(`  ✓ TMDB评分: ${tmdbInfo.voteAverage}/10 (${tmdbInfo.voteCount}票)`)
      if (tmdbInfo.tagline) console.log(`  ✓ 标语: ${tmdbInfo.tagline}`)
      if (tmdbInfo.budget) console.log(`  ✓ 预算: ${tmdbInfo.budget}`)
      if (tmdbInfo.revenue) console.log(`  ✓ 票房: ${tmdbInfo.revenue}`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  } else {
    console.log('\n⚠️  未设置 TMDB_API_KEY，跳过 TMDB 数据获取')
  }
  
  // 3. 尝试豆瓣搜索
  console.log('\n--- 尝试豆瓣搜索 ---')
  const doubanSearch = await fetchDoubanBySearch('星际穿越')
  
  if (doubanSearch) {
    console.log(`  ✓ 找到豆瓣ID: ${doubanSearch.doubanId}`)
    enhanced.subject = {
      ...enhanced.subject,
      id: doubanSearch.doubanId
    }
    
    // 如果找到了豆瓣ID，尝试获取详细信息
    const doubanUrl = `https://movie.douban.com/subject/${doubanSearch.doubanId}/`
    const doubanResponse = await fetch(doubanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    })
    
    if (doubanResponse.ok) {
      const html = await doubanResponse.text()
      
      const ratingMatch = html.match(/<strong class="ll rating_num" property="v:average">([\d.]+)<\/strong>/)
      if (ratingMatch) {
        enhanced.doubanRating = ratingMatch[1]
        console.log(`  ✓ 豆瓣评分: ${ratingMatch[1]}`)
      }
      
      const votesMatch = html.match(/<span property="v:votes">(\d+)<\/span>/)
      if (votesMatch) {
        enhanced.doubanVotes = parseInt(votesMatch[1])
        console.log(`  ✓ 豆瓣评分人数: ${votesMatch[1]}`)
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  // 保存结果
  moviesDetail[IMDB_ID] = enhanced
  
  fs.writeFileSync(
    moviesDetailPath,
    JSON.stringify(moviesDetail, null, 2)
  )
  
  console.log('\n✅ 完成！数据已更新到 src/data/movies-detail.json')
  console.log('\n完整信息:')
  console.log(JSON.stringify(enhanced, null, 2))
}

main().catch(console.error)
