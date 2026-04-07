#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 读取现有数据
const moviesList = JSON.parse(fs.readFileSync(path.join(__dirname, 'movies-list.json'), 'utf-8'))
const moviesDetail = JSON.parse(fs.readFileSync(path.join(__dirname, 'movies-detail.json'), 'utf-8'))

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

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
    const ratingCount = ratingCountMatch ? parseInt(ratingCountMatch[1]) : null
    
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
    
    // 提取官方网站
    const websiteMatch = html.match(/官方网站:<\/span><a href="([^"]+)"/)
    const website = websiteMatch ? websiteMatch[1] : null
    
    // 提取 IMDb 链接
    const imdbLinkMatch = html.match(/IMDb链接:<\/span> <a href="([^"]+)" target="_blank"/)
    const imdbLink = imdbLinkMatch ? imdbLinkMatch[1] : null
    
    // 提取编剧
    const writersMatch = html.match(/编剧<\/span>:([\s\S]*?)<br\/>/)
    const writers = writersMatch ? writersMatch[1].match(/>([^<]+)<\/a>/g)?.map(w => w.replace(/<\/?a[^>]*>/g, '').trim()).filter(w => w) : []
    
    // 提取主演
    const castsMatch = html.match(/主演<\/span>:([\s\S]*?)<br\/>/)
    const casts = castsMatch ? castsMatch[1].match(/>([^<]+)<\/a>/g)?.map(c => c.replace(/<\/?a[^>]*>/g, '').trim()).filter(c => c) : []
    
    return {
      doubanRating,
      ratingCount,
      runtime,
      releaseDate,
      country,
      language,
      aka,
      website,
      imdbLink,
      writers,
      casts
    }
  } catch (error) {
    console.error(`豆瓣获取失败: ${error.message}`)
    return null
  }
}

// 从 OMDB API 获取信息（免费API，但有限制）
async function fetchOMDBInfo(imdbId) {
  const cleanId = imdbId.replace('/', '')
  // 注意：这里需要你自己的 OMDB API Key
  // 注册地址：http://www.omdbapi.com/apikey.aspx
  const apiKey = process.env.OMDB_API_KEY || 'demo' // 使用 demo key 会有限制
  
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
        genre: data.Genre,
        director: data.Director,
        writer: data.Writer,
        actors: data.Actors,
        language: data.Language,
        country: data.Country,
        awards: data.Awards,
        boxOffice: data.BoxOffice,
        production: data.Production,
        website: data.Website
      }
    }
    return null
  } catch (error) {
    console.error(`OMDB 获取失败: ${error.message}`)
    return null
  }
}

// 主函数
async function main() {
  console.log('开始获取增强的电影信息...\n')
  
  const enhancedDetails = {}
  let count = 0
  
  for (const movie of moviesList) {
    const imdbId = movie.imdb
    const existingDetail = moviesDetail[imdbId]
    
    console.log(`\n[${++count}/${moviesList.length}] 处理: ${movie.name}`)
    
    const enhanced = {
      ...existingDetail,
      imdb: imdbId
    }
    
    // 如果有豆瓣ID，获取豆瓣详细信息
    if (existingDetail?.subject?.id) {
      const doubanInfo = await fetchDoubanDetail(existingDetail.subject.id)
      
      if (doubanInfo) {
        enhanced.doubanRating = doubanInfo.doubanRating
        enhanced.ratingCount = doubanInfo.ratingCount
        enhanced.runtime = doubanInfo.runtime
        enhanced.releaseDate = doubanInfo.releaseDate
        enhanced.country = doubanInfo.country
        enhanced.language = doubanInfo.language
        enhanced.aka = doubanInfo.aka
        enhanced.website = doubanInfo.website
        enhanced.writers = doubanInfo.writers
        
        console.log(`  ✓ 豆瓣评分: ${doubanInfo.doubanRating}`)
        console.log(`  ✓ 评分人数: ${doubanInfo.ratingCount}`)
        console.log(`  ✓ 片长: ${doubanInfo.runtime} 分钟`)
        console.log(`  ✓ 国家: ${doubanInfo.country}`)
        console.log(`  ✓ 语言: ${doubanInfo.language}`)
      }
      
      await delay(2000) // 延迟2秒，避免被封
    }
    
    // 获取 OMDB 信息
    const omdbInfo = await fetchOMDBInfo(imdbId)
    if (omdbInfo) {
      enhanced.imdbRating = omdbInfo.imdbRating
      enhanced.imdbVotes = omdbInfo.imdbVotes
      enhanced.metascore = omdbInfo.metascore
      enhanced.rated = omdbInfo.rated
      enhanced.awards = omdbInfo.awards
      enhanced.boxOffice = omdbInfo.boxOffice
      
      if (!enhanced.runtime && omdbInfo.runtime) {
        enhanced.runtime = parseInt(omdbInfo.runtime)
      }
      
      console.log(`  ✓ IMDB评分: ${omdbInfo.imdbRating}`)
      console.log(`  ✓ IMDB票数: ${omdbInfo.imdbVotes}`)
      console.log(`  ✓ 等级: ${omdbInfo.rated}`)
      if (omdbInfo.awards) console.log(`  ✓ 获奖: ${omdbInfo.awards}`)
      
      await delay(1000) // 延迟1秒
    }
    
    enhancedDetails[imdbId] = enhanced
    
    // 每10部电影保存一次
    if (count % 10 === 0) {
      fs.writeFileSync(
        path.join(__dirname, 'movies-detail-enhanced.json'),
        JSON.stringify(enhancedDetails, null, 2)
      )
      console.log('\n  💾 已保存中间结果...\n')
    }
  }
  
  // 保存最终结果
  fs.writeFileSync(
    path.join(__dirname, 'movies-detail-enhanced.json'),
    JSON.stringify(enhancedDetails, null, 2)
  )
  
  console.log('\n✅ 完成！增强信息已保存到 movies-detail-enhanced.json')
}

main().catch(console.error)
