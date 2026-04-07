#!/usr/bin/env node

/**
 * IMDB Top 250 数据抓取脚本 (2026 重构版 - Puppeteer)
 * 使用浏览器自动化绕过 WAF 防护
 * 
 * 用法: node scripts/fetch-imdb-puppeteer.mjs
 */

import puppeteer from 'puppeteer'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const IMDB_TOP_250_URL = 'https://www.imdb.com/chart/top/'

/**
 * 加载电影中文名翻译
 */
function loadTranslations() {
  const translationPath = join(__dirname, 'movie-translations.json')
  if (!existsSync(translationPath)) {
    return {}
  }
  
  try {
    const content = readFileSync(translationPath, 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.log('⚠️  翻译文件加载失败:', error.message)
    return {}
  }
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
 * 从电影详情页抓取导演和演员信息
 */
async function fetchMovieDetails(page, imdbId) {
  const url = `https://www.imdb.com/title/${imdbId}/`
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    // 等待页面加载
    await page.waitForSelector('script[type="application/ld+json"]', { timeout: 10000 })
      .catch(() => null)

    // 提取导演和演员
    const details = await page.evaluate(() => {
      // 从 JSON-LD 提取
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
      for (const script of jsonLdScripts) {
        try {
          const data = JSON.parse(script.textContent)
          if (data['@type'] === 'Movie') {
            const directors = (data.director || [])
              .filter(d => d['@type'] === 'Person')
              .map(d => d.name)
              .filter(Boolean)
            
            const actors = (data.actor || [])
              .filter(a => a['@type'] === 'Person')
              .map(a => a.name)
              .filter(Boolean)

            const image = data.image || ''

            return { directors, actors, image }
          }
        } catch (e) {
          // 继续
        }
      }
      
      return { directors: [], actors: [], image: '' }
    })

    return details
  } catch (error) {
    console.log(`  ⚠️  ${imdbId} 详情页获取失败: ${error.message}`)
    return { directors: [], actors: [], image: '' }
  }
}

/**
 * 使用 Puppeteer 从 IMDB 抓取 Top 250 数据
 */
async function fetchImdbTop250() {
  console.log('🚀 正在启动浏览器...\n')

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-web-security'
    ]
  })

  try {
    const page = await browser.newPage()
    
    // 设置 User-Agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36')
    
    // 设置视口
    await page.setViewport({ width: 1920, height: 1080 })

    console.log('🚀 正在从 IMDB 抓取 Top 250...\n')
    
    await page.goto(IMDB_TOP_250_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    })

    // 等待页面加载
    await page.waitForSelector('ul.ipc-metadata-list', { timeout: 30000 })
      .catch(() => console.log('⚠️  等待列表超时，尝试继续...'))

    // 提取电影数据
    const movies = await page.evaluate(() => {
      const results = []
      
      // 尝试从 JSON-LD 提取
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
      for (const script of jsonLdScripts) {
        try {
          const data = JSON.parse(script.textContent)
          if (data['@type'] === 'ItemList' && Array.isArray(data.itemListElement)) {
            data.itemListElement.forEach(item => {
              const movie = item.item || {}
              const url = movie.url || ''
              const imdbMatch = url.match(/(tt\d+)/)
              
              if (!imdbMatch) return

              let genres = movie.genre || []
              if (typeof genres === 'string') {
                genres = genres.split(',').map(g => g.trim()).filter(Boolean)
              }

              const directors = (movie.director || [])
                .filter(d => d['@type'] === 'Person')
                .map(d => d.name)
                .filter(Boolean)
              
              const actors = (movie.actor || [])
                .filter(a => a['@type'] === 'Person')
                .map(a => a.name)
                .filter(Boolean)

              results.push({
                position: item.position || results.length + 1,
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
            break
          }
        } catch (e) {
          // 继续尝试下一个
        }
      }

      // 如果 JSON-LD 失败，从 HTML 提取
      if (results.length === 0) {
        const listItems = document.querySelectorAll('ul.ipc-metadata-list li.ipc-metadata-list-summary-item')
        
        listItems.forEach((item, index) => {
          try {
            // 标题
            const titleEl = item.querySelector('h3.ipc-title__text')
            const titleText = titleEl ? titleEl.textContent.trim() : ''
            const title = titleText.replace(/^\d+\.\s*/, '')
            
            // IMDb ID
            const linkEl = item.querySelector('a.ipc-title-link-wrapper')
            const link = linkEl ? linkEl.getAttribute('href') : ''
            const imdbMatch = link.match(/(tt\d+)/)
            
            if (!imdbMatch || !title) return

            // 年份
            const yearEls = item.querySelectorAll('.sc-b0691f29-8, .secondaryInfo')
            let year = ''
            for (const el of yearEls) {
              const text = el.textContent
              const match = text.match(/(\d{4})/)
              if (match) {
                year = match[1]
                break
              }
            }

            // 评分
            const ratingEl = item.querySelector('span.ipc-rating-star')
            const ratingText = ratingEl ? (ratingEl.getAttribute('aria-label') || ratingEl.textContent) : ''
            const ratingMatch = ratingText.match(/([\d.]+)/)
            const rating = ratingMatch ? ratingMatch[1] : ''

            results.push({
              position: index + 1,
              imdbId: imdbMatch[1],
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
          } catch (e) {
            // 跳过错误项
          }
        })
      }

      return results
    })

    if (movies.length === 0) {
      throw new Error('未能解析到任何电影数据')
    }

    console.log(`✅ 成功解析 ${movies.length} 部电影的基础信息\n`)

    // 检查哪些电影缺少导演/演员信息
    const needDetails = movies.filter(m => m.directors.length === 0 || m.actors.length === 0)
    
    if (needDetails.length > 0) {
      console.log(`🔍 发现 ${needDetails.length} 部电影缺少导演/演员信息，正在补充...\n`)
      
      for (let i = 0; i < needDetails.length; i++) {
        const movie = needDetails[i]
        process.stdout.write(`  [${i + 1}/${needDetails.length}] 正在获取 ${movie.title}...`)
        
        const details = await fetchMovieDetails(page, movie.imdbId)
        
        if (details.directors.length > 0) {
          movie.directors = details.directors
        }
        if (details.actors.length > 0) {
          movie.actors = details.actors
        }
        if (!movie.image && details.image) {
          movie.image = details.image
        }
        
        console.log(` ✅ 导演: ${movie.directors.length}, 演员: ${movie.actors.length}`)
        
        // 避免请求过快
        if (i < needDetails.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      console.log('')
    }

    return movies

  } finally {
    await browser.close()
  }
}

/**
 * 合并新旧数据
 */
function mergeData(newMovies, oldMoviesMap, translations = {}) {
  const result = newMovies.map((movie, index) => {
    const old = oldMoviesMap.get(movie.imdbId) || {}
    const translation = translations[movie.imdbId] || {}
    const year = movie.year || translation.year || old.subject?.year || ''
    
    // 中文名：优先级：旧的 > 翻译 > 英文名(年份)
    let chineseName = ''
    
    // 如果旧数据中有中文名（通过判断name和englishName是否不同），使用旧的
    if (old.name && old.name !== old.englishName) {
      chineseName = old.name
    }
    // 如果有翻译，使用翻译
    else if (translation.chineseName) {
      chineseName = year ? `${translation.chineseName}（${year}）` : translation.chineseName
    }
    // 否则使用英文名
    else {
      chineseName = year ? `${movie.title}（${year}）` : movie.title
    }

    // subject (豆瓣数据)：保留旧的，或创建新的
    let subject
    if (old.subject) {
      subject = { ...old.subject }
      if (!subject.year && year) {
        subject.year = year
      }
      // 确保 genres 是数组
      if (typeof subject.genres === 'string') {
        subject.genres = subject.genres.split(',').map(g => g.trim()).filter(Boolean)
      }
      // 如果旧的 directors 为空，用新数据填充
      if (!subject.directors || subject.directors.length === 0) {
        subject.directors = movie.directors.map(name => ({
          alt: '',
          avatars: '',
          name,
          id: ''
        }))
      }
      // 如果旧的 casts 为空，用新数据填充
      if (!subject.casts || subject.casts.length === 0) {
        subject.casts = movie.actors.map(name => ({
          alt: '',
          avatars: '',
          name,
          id: ''
        }))
      }
    } else {
      // 确保 genres 是数组
      let genres = movie.genres || []
      if (typeof genres === 'string') {
        genres = genres.split(',').map(g => g.trim()).filter(Boolean)
      }
      
      subject = {
        genres,
        title: chineseName.split('（')[0],
        casts: movie.actors.map(name => ({
          alt: '',
          avatars: '',
          name,
          id: ''
        })),
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
 * 拆分数据为列表和详情
 */
function splitData(movies) {
  // 列表数据：只包含展示需要的字段
  const listData = movies.map(m => {
    // 确保 genres 是数组
    let genres = m.subject?.genres || []
    if (typeof genres === 'string') {
      genres = genres.split(',').map(g => g.trim()).filter(Boolean)
    }
    
    return {
      imdb: m.imdb,
      order: m.order,
      name: m.name,
      score: m.score,
      src: m.src,
      englishName: m.englishName,
      year: m.subject?.year || '',
      genres
    }
  })

  // 详情数据：按 imdb ID 索引
  const detailData = {}
  movies.forEach(m => {
    // 确保 genres 是数组
    let genres = m.subject?.genres || []
    if (typeof genres === 'string') {
      genres = genres.split(',').map(g => g.trim()).filter(Boolean)
    }
    
    detailData[m.imdb] = {
      imdb: m.imdb,
      nickName: m.nickName,
      director: m.director,
      actors: m.actors,
      subject: {
        ...m.subject,
        genres
      },
      short: m.short,
      download: m.download
    }
  })

  return { listData, detailData }
}

/**
 * 保存数据到文件
 */
function saveData(movies) {
  // 保存完整数据
  const scriptsPath = join(__dirname, 'movies.json')
  writeFileSync(scriptsPath, JSON.stringify(movies, null, 2), 'utf-8')
  console.log(`\n✅ 已保存完整数据到: ${scriptsPath}`)

  // 拆分数据
  const { listData, detailData } = splitData(movies)

  // 保存列表数据
  const listPath = join(__dirname, 'movies-list.json')
  writeFileSync(listPath, JSON.stringify(listData, null, 2), 'utf-8')
  console.log(`✅ 已保存列表数据到: ${listPath} (${(JSON.stringify(listData).length / 1024).toFixed(2)} KB)`)

  // 保存详情数据
  const detailPath = join(__dirname, 'movies-detail.json')
  writeFileSync(detailPath, JSON.stringify(detailData, null, 2), 'utf-8')
  console.log(`✅ 已保存详情数据到: ${detailPath} (${(JSON.stringify(detailData).length / 1024).toFixed(2)} KB)`)

  // 同步到 src/data 目录
  const srcDataDir = join(__dirname, '..', 'src', 'data')
  if (existsSync(srcDataDir)) {
    writeFileSync(join(srcDataDir, 'movies.json'), JSON.stringify(movies, null, 2), 'utf-8')
    writeFileSync(join(srcDataDir, 'movies-list.json'), JSON.stringify(listData, null, 2), 'utf-8')
    writeFileSync(join(srcDataDir, 'movies-detail.json'), JSON.stringify(detailData, null, 2), 'utf-8')
    console.log(`✅ 已同步到: ${srcDataDir}`)
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════╗')
  console.log('║   IMDB Top 250 数据更新工具    ║')
  console.log('║     (2026 Puppeteer 版)        ║')
  console.log('╚════════════════════════════════╝\n')

  try {
    // 1. 加载旧数据
    const oldMovies = loadOldMovies()
    const oldMoviesMap = buildOldMoviesMap(oldMovies)
    
    // 2. 加载翻译
    const translations = loadTranslations()
    console.log(`✅ 已加载 ${Object.keys(translations).length} 条翻译\n`)

    // 3. 抓取新数据
    const newMovies = await fetchImdbTop250()

    // 4. 合并数据
    const result = mergeData(newMovies, oldMoviesMap, translations)

    // 5. 打印统计
    printStatistics(result, oldMoviesMap, oldMovies)

    // 6. 保存数据
    saveData(result)

    console.log('\n🎉 数据更新完成！\n')

  } catch (error) {
    console.error('\n❌ 执行失败:', error.message)
    process.exit(1)
  }
}

main()
