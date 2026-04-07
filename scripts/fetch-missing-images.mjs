#!/usr/bin/env node

/**
 * 补充缺失电影海报的图片URL
 */

import puppeteer from 'puppeteer'
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const stillMissingPath = join(__dirname, 'still-missing-images.json')
const stillMissing = JSON.parse(readFileSync(stillMissingPath, 'utf-8'))

const detailPath = join(__dirname, '../src/data/movies-detail.json')
const details = JSON.parse(readFileSync(detailPath, 'utf-8'))

console.log(`\n🔍 准备补充 ${stillMissing.length} 部电影的图片URL...\n`)

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox']
})

try {
  const page = await browser.newPage()
  await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
  await page.setViewport({ width: 1920, height: 1080 })

  let updated = 0

  for (let i = 0; i < stillMissing.length; i++) {
    const item = stillMissing[i]
    const imdbId = item.imdb.replace(/^\//, '')
    
    process.stdout.write(`[${i + 1}/${stillMissing.length}] ${item.name}...`)
    
    try {
      await page.goto(`https://www.imdb.com/title/${imdbId}/`, {
        waitUntil: 'networkidle2',
        timeout: 30000
      })

      // 提取图片URL
      const imageUrl = await page.evaluate(() => {
        // 从 JSON-LD 提取
        const scripts = document.querySelectorAll('script[type="application/ld+json"]')
        for (const script of scripts) {
          try {
            const data = JSON.parse(script.textContent)
            if (data.image) {
              return data.image
            }
          } catch (e) {}
        }
        
        // 从 meta 标签提取
        const meta = document.querySelector('meta[property="og:image"]')
        if (meta) {
          return meta.getAttribute('content')
        }
        
        // 从 poster div 提取
        const poster = document.querySelector('.ipc-media img')
        if (poster) {
          return poster.getAttribute('src')
        }
        
        return null
      })

      if (imageUrl) {
        if (!details[item.imdb]) {
          details[item.imdb] = {}
        }
        details[item.imdb].image = imageUrl
        updated++
        console.log(' ✅')
      } else {
        console.log(' ❌ 未找到图片')
      }
      
      // 延迟避免请求过快
      await new Promise(resolve => setTimeout(resolve, 1000))
      
    } catch (error) {
      console.log(` ❌ ${error.message}`)
    }
  }

  // 保存更新后的数据
  writeFileSync(detailPath, JSON.stringify(details, null, 2), 'utf-8')
  
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
  console.log(`✅ 成功补充 ${updated} 个图片URL`)
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

} finally {
  await browser.close()
}
