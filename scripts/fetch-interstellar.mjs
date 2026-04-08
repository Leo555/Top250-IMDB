#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../src/data')

// 星际穿越的IMDB ID
const IMDB_ID = '/tt0816692'

// 从豆瓣获取详细信息
async function fetchDoubanDetail(doubanId) {
  const url = `https://movie.douban.com/subject/${doubanId}/`
  console.log(`正在获取豆瓣详情: ${url}`)
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
      }
    })
    
    if (!response.ok) {
      console.error(`豆瓣请求失败: ${response.status}`)
      return null
    }
    
    const html = await response.text()
    
    // 提取豆瓣评分
    const ratingMatch = html.match(/<strong class="ll rating_num" property="v:average">([\d.]+)<\/strong>/)
    const doubanRating = ratingMatch ? ratingMatch[1] : null
    
    // 提取评分人数
    const ratingCountMatch = html.match(/<span property="v:votes">(\d+)<\/span>/)
    const doubanVotes = ratingCountMatch ? parseInt(ratingCountMatch[1]) : null
    
    // 提取片长
    const runtimeMatch = html.match(/<span property="v:runtime" content="(\d+)">/)
    const runtime = runtimeMatch ? parseInt(runtimeMatch[1]) : null
    
    // 提取上映日期
    const releaseDateMatch = html.match(/<span property="v:initialReleaseDate" content="([^"]+)">/)
    const releaseDate = releaseDateMatch ? releaseDateMatch[1] : null
    
    // 提取制片国家/地区
    const countryMatch = html.match(/制片国家\/地区:<\/span>([^<]+)<br\/>/)
    const country = countryMatch ? countryMatch[1].trim() : null
    
    // 提取语言
    const languageMatch = html.match(/语言:<\/span>([^<]+)<br\/>/)
    const language = languageMatch ? languageMatch[1].trim() : null
    
    // 提取又名
    const akaMatch = html.match(/又名:<\/span>([^<]+)<br\/>/)
    const aka = akaMatch ? akaMatch[1].trim() : null
    
    // 提取编剧
    const writersMatch = html.match(/编剧<\/span>:([\s\S]*?)<br\/>/)
    const writers = writersMatch ? writersMatch[1].match(/>([^<]+)<\/a>/g)?.map(w => w.replace(/<\/?a[^>]*>/g, '').trim()).filter(w => w) : []
    
    // 提取获奖信息
    const awardsMatch = html.match(/获奖情况[\s\S]*?<ul class="award">([\s\S]*?)<\/ul>/)
    const awards = awardsMatch ? awardsMatch[1].replace(/<[^>]+>/g, '').trim() : null
    
    return {
      doubanRating,
      doubanVotes,
      runtime,
      releaseDate,
      country,
      language,
      aka,
      writers,
      awards
    }
  } catch (error) {
    console.error(`豆瓣获取失败: ${error.message}`)
    return null
  }
}

// 从 OMDB API 获取信息
async function fetchOMDBInfo(imdbId) {
  const cleanId = imdbId.replace('/', '')
  // 使用免费API，无需key
  const apiKey = process.env.OMDB_API_KEY || 'trilogy'
  
  const url = `http://www.omdbapi.com/?i=${cleanId}&apikey=${apiKey}`
  console.log(`正在获取 OMDB 信息: ${cleanId}`)
  
  try {
    const response = await fetch(url)
    const data = await response.json()
    
    if (data.Response === 'True') {
      return {
        imdbRating: data.imdbRating,
        imdbVotes: data.imdbVotes,
        metascore: data.Metascore,
        rated: data.Rated,
        runtime: data.Runtime?.replace(' min', ''),
        awards: data.Awards,
        boxOffice: data.BoxOffice,
        budget: data.BoxOffice ? 'N/A' : null, // OMDB不提供预算信息
        production: data.Production
      }
    }
    console.error(`OMDB 返回错误: ${data.Error}`)
    return null
  } catch (error) {
    console.error(`OMDB 获取失败: ${error.message}`)
    return null
  }
}

// 从维基百科获取更多信息
async function fetchWikipediaInfo(title) {
  const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  console.log(`正在获取维基百科信息: ${title}`)
  
  try {
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MovieBot/1.0)'
      }
    })
    
    if (!response.ok) {
      console.error(`维基百科请求失败: ${response.status}`)
      return null
    }
    
    const data = await response.json()
    
    return {
      plot: data.extract,
      website: data.content_urls?.desktop?.page
    }
  } catch (error) {
    console.error(`维基百科获取失败: ${error.message}`)
    return null
  }
}

// 主函数
async function main() {
  console.log('=== 开始获取星际穿越(Interstellar)详细信息 ===\n')
  
  // 读取现有数据
  const moviesDetailPath = path.join(DATA_DIR, 'movies-detail.json')
  const moviesDetail = JSON.parse(fs.readFileSync(moviesDetailPath, 'utf-8'))
  
  const existingDetail = moviesDetail[IMDB_ID]
  if (!existingDetail) {
    console.error('未找到星际穿越的数据！')
    return
  }
  
  console.log('现有信息:')
  console.log(`  片名: ${existingDetail.title}`)
  console.log(`  原名: ${existingDetail.original_title}`)
  console.log(`  年份: ${existingDetail.year}`)
  console.log(`  导演: ${existingDetail.directors?.[0]?.name}`)
  console.log(`  主演: ${existingDetail.casts?.map(c => c.name).join(', ')}`)
  console.log('')
  
  const enhanced = { ...existingDetail }
  
  // 1. 从豆瓣获取详细信息
  if (existingDetail.subject?.id) {
    console.log('--- 从豆瓣获取 ---')
    const doubanInfo = await fetchDoubanDetail(existingDetail.subject.id)
    
    if (doubanInfo) {
      enhanced.doubanRating = doubanInfo.doubanRating
      enhanced.doubanVotes = doubanInfo.doubanVotes
      enhanced.runtime = doubanInfo.runtime
      enhanced.releaseDate = doubanInfo.releaseDate
      enhanced.country = doubanInfo.country
      enhanced.language = doubanInfo.language
      enhanced.aka = doubanInfo.aka
      enhanced.writers = doubanInfo.writers
      
      console.log(`  ✓ 豆瓣评分: ${doubanInfo.doubanRating}`)
      console.log(`  ✓ 评分人数: ${doubanInfo.doubanVotes}`)
      console.log(`  ✓ 片长: ${doubanInfo.runtime} 分钟`)
      console.log(`  ✓ 上映日期: ${doubanInfo.releaseDate}`)
      console.log(`  ✓ 国家: ${doubanInfo.country}`)
      console.log(`  ✓ 语言: ${doubanInfo.language}`)
      console.log(`  ✓ 又名: ${doubanInfo.aka}`)
      console.log(`  ✓ 编剧: ${doubanInfo.writers?.join(', ')}`)
      if (doubanInfo.awards) console.log(`  ✓ 获奖: ${doubanInfo.awards.substring(0, 100)}...`)
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000))
  }
  
  // 2. 从OMDB获取详细信息
  console.log('\n--- 从 OMDB 获取 ---')
  const omdbInfo = await fetchOMDBInfo(IMDB_ID)
  
  if (omdbInfo) {
    enhanced.imdbRating = omdbInfo.imdbRating
    enhanced.imdbVotes = omdbInfo.imdbVotes
    enhanced.metascore = omdbInfo.metascore
    enhanced.rated = omdbInfo.rated
    enhanced.awards = omdbInfo.awards
    enhanced.boxOffice = omdbInfo.boxOffice
    enhanced.production = omdbInfo.production
    
    if (!enhanced.runtime && omdbInfo.runtime) {
      enhanced.runtime = parseInt(omdbInfo.runtime)
    }
    
    console.log(`  ✓ IMDB评分: ${omdbInfo.imdbRating}`)
    console.log(`  ✓ IMDB票数: ${omdbInfo.imdbVotes}`)
    console.log(`  ✓ Metascore: ${omdbInfo.metascore}`)
    console.log(`  ✓ 分级: ${omdbInfo.rated}`)
    console.log(`  ✓ 获奖: ${omdbInfo.awards}`)
    if (omdbInfo.boxOffice) console.log(`  ✓ 票房: ${omdbInfo.boxOffice}`)
    if (omdbInfo.production) console.log(`  ✓ 制作: ${omdbInfo.production}`)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  // 3. 从维基百科获取更多信息
  console.log('\n--- 从维基百科获取 ---')
  const wikiInfo = await fetchWikipediaInfo('Interstellar_(film)')
  
  if (wikiInfo) {
    if (!enhanced.website && wikiInfo.website) {
      enhanced.website = wikiInfo.website
      console.log(`  ✓ 官网: ${wikiInfo.website}`)
    }
    
    // 如果没有简介，使用维基百科的
    if (!existingDetail.short && wikiInfo.plot) {
      enhanced.short = wikiInfo.plot
      console.log(`  ✓ 简介: ${wikiInfo.plot.substring(0, 100)}...`)
    }
  }
  
  // 保存结果
  moviesDetail[IMDB_ID] = enhanced
  
  fs.writeFileSync(
    moviesDetailPath,
    JSON.stringify(moviesDetail, null, 2)
  )
  
  console.log('\n✅ 完成！详细信息已更新到 src/data/movies-detail.json')
  console.log('\n获取到的完整信息:')
  console.log(JSON.stringify(enhanced, null, 2))
}

main().catch(console.error)
