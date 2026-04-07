#!/usr/bin/env node

/**
 * IMDB Top 250 数据抓取脚本 (2026 重构版)
 * 从 IMDB 官网抓取最新 Top 250 电影排名和评分
 * 与旧 movies.json 合并，保留已有的中文名、豆瓣信息、简介等
 *
 * 用法: node scripts/fetch-imdb-top250.mjs
 */

import axios from 'axios'
import * as cheerio from 'cheerio'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const IMDB_TOP_250_URL = 'https://www.imdb.com/chart/top/'
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br, zstd',
  'Cache-Control': 'max-age=0',
  'Sec-Ch-Ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  'Sec-Ch-Ua-Mobile': '?0',
  'Sec-Ch-Ua-Platform': '"macOS"',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'none',
  'Sec-Fetch-User': '?1',
  'Upgrade-Insecure-Requests': '1'
}

/**
 * 加载旧的 movies.json 数据
 */
function loadOldMovies() {
  const oldPath = join(__dirname, 'movies.json')
  if (!existsSync(oldPath)) {
    console.log('📌 未找到旧数据文件，将创建全新数据\n')
    return []
  }

  try {
    const content = readFileSync(oldPath, 'utf-8')
    const movies = JSON.parse(content)
    console.log(`✅ 已加载旧数据: ${movies.length} 部电影\n`)
    return movies
  } catch (error) {
    console.error('⚠️  旧数据解析失败:', error.message)
    return []
  }
}

/**
 * 构建旧数据索引映射
 */
function buildOldMoviesMap(oldMovies) {
  const map = new Map()
  oldMovies.forEach(movie => {
    const imdbId = (movie.imdb || '').replace(/^\//, '')
    if (imdbId) {
      map.set(imdbId, movie)
    }
  })
  return map
}

/**
 * 从 IMDB 抓取 Top 250 数据
 */
async function fetchImdbTop250() {
  console.log('🚀 正在从 IMDB 抓取 Top 250...\n')

  try {
    const response = await axios.get(IMDB_TOP_250_URL, {
      headers: HEADERS,
      timeout: 30000,
      maxRedirects: 5
    })

    console.log(`📄 页面大小: ${(response.data.length / 1024).toFixed(0)} KB`)

    const $ = cheerio.load(response.data)
    const movies = []

    // 方法1: 从 JSON-LD 结构化数据提取
    let foundJsonLd = false
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const data = JSON.parse($(el).html() || '{}')
        
        if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
          foundJsonLd = true
          data.itemListElement.forEach(item => {
            const movie = item.item || {}
            const url = movie.url || ''
            const imdbMatch = url.match(/(tt\d+)/)
            
            if (!imdbMatch) return

            // 处理 genre (可能是字符串或数组)
            let genres = movie.genre || []
            if (typeof genres === 'string') {
              genres = genres.split(',').map(g => g.trim()).filter(Boolean)
            }

            // 处理导演和演员
            const directors = (movie.director || [])
              .filter(d => d['@type'] === 'Person')
              .map(d => d.name)
              .filter(Boolean)
            
            const actors = (movie.actor || [])
              .filter(a => a['@type'] === 'Person')
              .map(a => a.name)
              .filter(Boolean)

            movies.push({
              position: item.position || movies.length + 1,
              imdbId: imdbMatch[1],
              title: movie.name || '',
              description: movie.description || '',
              image: movie.image || '',
              rating: (movie.aggregateRating || {}).ratingValue || '',
              ratingCount: (movie.aggregateRating || {}).ratingCount || 0,
              genres,
              year: (movie.datePublished || '').substring(0, 4),
              duration: movie.duration || '',
              directors,
              actors
            })
          })
        }
      } catch (e) {
        // JSON-LD 解析失败，继续尝试下一个
      }
    })

    if (foundJsonLd) {
      console.log('✅ 从 JSON-LD 提取数据成功')
    }

    // 方法2: 从 Next.js __NEXT_DATA__ 提取
    if (movies.length === 0) {
      console.log('⚠️  JSON-LD 未找到数据，尝试从 __NEXT_DATA__ 提取...\n')
      
      $('script[id="__NEXT_DATA__"]').each((i, el) => {
        try {
          const data = JSON.parse($(el).html() || '{}')
          const props = data.props?.pageProps || {}
          
          // IMDB Next.js 结构可能变化，这里尝试多种路径
          const chartData = props.pageData?.chartData?.movies || 
                           props.chartData?.movies ||
                           props.movies ||
                           []
          
          if (Array.isArray(chartData)) {
            chartData.forEach((item, index) => {
              const title = item.primaryTitle || item.title || ''
              const year = item.year || item.startYear || ''
              const rating = item.averageRating || item.rating || ''
              const imdbId = item.id || item.tconst || ''
              
              if (!imdbId || !imdbId.startsWith('tt')) return
              
              movies.push({
                position: index + 1,
                imdbId,
                title,
                description: item.description || '',
                image: item.primaryImage || item.image || '',
                rating: String(rating),
                ratingCount: item.numVotes || 0,
                genres: item.genres || [],
                year: String(year),
                duration: item.runtimeMinutes || '',
                directors: [],
                actors: []
              })
            })
          }
        } catch (e) {
          // 解析失败
        }
      })
    }

    // 方法3: 从 HTML 列表项提取
    if (movies.length === 0) {
      console.log('⚠️  __NEXT_DATA__ 未找到数据，尝试从 HTML 列表提取...\n')
      
      // 尝试多种可能的列表选择器
      const selectors = [
        'ul.ipc-metadata-list li.ipc-metadata-list-summary-item',
        '.lister-list tr',
        '.ipc-page-grid__cell ul li'
      ]
      
      for (const selector of selectors) {
        $(selector).each((i, el) => {
          const $el = $(el)
          
          // 提取标题
          const titleSelectors = [
            'h3.ipc-title__text',
            '.titleColumn a',
            '.ipc-title__text'
          ]
          
          let title = ''
          for (const sel of titleSelectors) {
            const text = $el.find(sel).text().trim()
            if (text) {
              // 移除排名前缀
              title = text.replace(/^\d+\.\s*/, '')
              break
            }
          }
          
          if (!title) return
          
          // 提取 IMDb ID
          const linkSelectors = [
            'a.ipc-title-link-wrapper',
            '.titleColumn a',
            'a[href*="/title/tt"]'
          ]
          
          let imdbId = ''
          for (const sel of linkSelectors) {
            const link = $el.find(sel).attr('href') || ''
            const match = link.match(/(tt\d+)/)
            if (match) {
              imdbId = match[1]
              break
            }
          }
          
          if (!imdbId) return
          
          // 提取年份
          let year = ''
          const yearSelectors = [
            '.secondaryInfo',
            '.sc-b0691f29-8',
            'span[class*="secondaryInfo"]'
          ]
          for (const sel of yearSelectors) {
            const text = $el.find(sel).text()
            const match = text.match(/(\d{4})/)
            if (match) {
              year = match[1]
              break
            }
          }
          
          // 提取评分
          let rating = ''
          const ratingSelectors = [
            'span.ipc-rating-star',
            '.ratingColumn strong',
            'span[aria-label*="rating"]'
          ]
          for (const sel of ratingSelectors) {
            const $rating = $el.find(sel)
            const text = $rating.attr('aria-label') || $rating.text()
            const match = text.match(/([\d.]+)/)
            if (match) {
              rating = match[1]
              break
            }
          }
          
          movies.push({
            position: movies.length + 1,
            imdbId,
            title,
            description: '',
            image: '',
            rating,
            ratingCount: 0,
            genres: [],
            year,
            duration: '',
            directors: [],
            actors: []
          })
        })
        
        if (movies.length > 0) break
      }
    }

    if (movies.length === 0) {
      // 保存 HTML 用于调试
      writeFileSync('debug-imdb.html', response.data, 'utf-8')
      console.log('⚠️  已保存 HTML 到 debug-imdb.html 用于调试\n')
      throw new Error('未能解析到任何电影数据，请检查页面结构是否变化')
    }

    console.log(`✅ 成功解析 ${movies.length} 部电影\n`)
    return movies

  } catch (error) {
    if (error.response) {
      console.error(`❌ HTTP 错误: ${error.response.status} ${error.response.statusText}`)
    } else {
      console.error(`❌ 抓取失败: ${error.message}`)
    }
    throw error
  }
}

/**
 * 合并新旧数据
 */
function mergeData(newMovies, oldMoviesMap) {
  const result = newMovies.map((movie, index) => {
    const old = oldMoviesMap.get(movie.imdbId) || {}
    const year = movie.year || ''
    
    // 中文名：优先保留旧的，否则使用 "英文名（年份）"
    let chineseName = old.name
    if (!chineseName) {
      chineseName = year ? `${movie.title}（${year}）` : movie.title
    }

    // subject (豆瓣数据)：保留旧的，或创建新的
    let subject
    if (old.subject) {
      subject = { ...old.subject }
      if (!subject.year && year) {
        subject.year = year
      }
    } else {
      subject = {
        genres: movie.genres,
        title: chineseName.split('（')[0],
        casts: [],
        original_title: movie.title,
        directors: movie.directors.map(name => ({
          alt: '',
          avatars: '',
          name,
          id: ''
        })),
        year,
        alt: `https://www.imdb.com/title/${movie.imdbId}/`,
        id: ''
      }
    }

    return {
      imdb: `/${movie.imdbId}`,
      order: movie.position || index + 1,
      name: chineseName,
      score: String(movie.rating || old.score || ''),
      src: old.src || `${chineseName}.png`,
      englishName: movie.title || old.englishName || '',
      nickName: old.nickName || '',
      director: old.director || movie.directors.join(' '),
      actors: old.actors || movie.actors.join(' '),
      subject,
      short: old.short || movie.description || '',
      download: old.download || '',
      id: old.id || movie.title.replace(/[^\w\-]/g, '_').toLowerCase()
    }
  })

  return result
}

/**
 * 打印统计信息
 */
function printStatistics(result, oldMoviesMap, oldMovies) {
  const mergedCount = result.filter(m => {
    const imdbId = (m.imdb || '').replace(/^\//, '')
    return oldMoviesMap.has(imdbId)
  }).length
  
  const newCount = result.length - mergedCount
  
  // 检查被踢出榜单的电影
  const newImdbIds = new Set(
    result.map(m => (m.imdb || '').replace(/^\//, ''))
  )
  
  const droppedMovies = oldMovies.filter(m => {
    const imdbId = (m.imdb || '').replace(/^\//, '')
    return imdbId && !newImdbIds.has(imdbId)
  })

  console.log('╔════════════════════════════════╗')
  console.log('║         数据更新统计           ║')
  console.log('╚════════════════════════════════╝')
  console.log(`总计:         ${result.length} 部`)
  console.log(`已合并旧数据: ${mergedCount} 部`)
  console.log(`新上榜:       ${newCount} 部`)
  console.log(`被踢出榜单:   ${droppedMovies.length} 部`)

  if (newCount > 0) {
    console.log('\n🎬 新上榜电影:')
    result
      .filter(m => {
        const imdbId = (m.imdb || '').replace(/^\//, '')
        return !oldMoviesMap.has(imdbId)
      })
      .forEach(m => {
        console.log(`  #${m.order} ${m.englishName} (${m.score})`)
      })
  }

  if (droppedMovies.length > 0) {
    console.log('\n🚫 被踢出榜单的电影:')
    droppedMovies.forEach(m => {
      console.log(`  原#${m.order} ${m.name}`)
    })
  }

  // 显示 Top 10
  console.log('\n🏆 当前 Top 10:')
  result.slice(0, 10).forEach(m => {
    console.log(`  #${m.order} ${m.name} | ${m.englishName} | ⭐ ${m.score}`)
  })
}

/**
 * 保存数据到文件
 */
function saveData(movies) {
  const scriptsPath = join(__dirname, 'movies.json')
  writeFileSync(scriptsPath, JSON.stringify(movies, null, 2), 'utf-8')
  console.log(`\n✅ 已保存到: ${scriptsPath}`)

  const srcDataPath = join(__dirname, '..', 'src', 'data', 'movies.json')
  if (existsSync(dirname(srcDataPath))) {
    writeFileSync(srcDataPath, JSON.stringify(movies, null, 2), 'utf-8')
    console.log(`✅ 已同步到: ${srcDataPath}`)
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════╗')
  console.log('║   IMDB Top 250 数据更新工具    ║')
  console.log('║        (2026 重构版)           ║')
  console.log('╚════════════════════════════════╝\n')

  try {
    // 1. 加载旧数据
    const oldMovies = loadOldMovies()
    const oldMoviesMap = buildOldMoviesMap(oldMovies)

    // 2. 抓取新数据
    const newMovies = await fetchImdbTop250()

    // 3. 合并数据
    const result = mergeData(newMovies, oldMoviesMap)

    // 4. 打印统计
    printStatistics(result, oldMoviesMap, oldMovies)

    // 5. 保存数据
    saveData(result)

    console.log('\n🎉 数据更新完成！\n')

  } catch (error) {
    console.error('\n❌ 执行失败:', error.message)
    process.exit(1)
  }
}

main()
