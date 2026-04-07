#!/usr/bin/env node

/**
 * 下载电影海报图片
 * 
 * 用法: node scripts/download-images.mjs
 */

import puppeteer from 'puppeteer'
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { createWriteStream } from 'fs'
import { pipeline } from 'stream/promises'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const STATIC_DIR = join(__dirname, '..', 'static')

/**
 * 下载图片
 */
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const buffer = await response.arrayBuffer()
    writeFileSync(filepath, Buffer.from(buffer))
    return true
  } catch (error) {
    console.log(`    ❌ 下载失败: ${error.message}`)
    return false
  }
}

/**
 * 从 IMDB 获取海报图片 URL
 */
async function fetchPosterUrl(page, imdbId) {
  const url = `https://www.imdb.com/title/${imdbId}/`
  
  try {
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    })

    // 提取海报 URL
    const posterUrl = await page.evaluate(() => {
      // 从 JSON-LD 提取
      const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]')
      for (const script of jsonLdScripts) {
        try {
          const data = JSON.parse(script.textContent)
          if (data['@type'] === 'Movie' && data.image) {
            return data.image
          }
        } catch (e) {
          // 继续
        }
      }
      
      // 从页面元素提取
      const posterImg = document.querySelector('.ipc-poster__poster-image img, .poster img')
      return posterImg ? posterImg.src : null
    })

    return posterUrl
  } catch (error) {
    console.log(`  ⚠️  ${imdbId} 页面访问失败: ${error.message}`)
    return null
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('╔════════════════════════════════╗')
  console.log('║    电影海报下载工具            ║')
  console.log('╚════════════════════════════════╝\n')

  // 加载缺失图片列表
  const missingPath = join(__dirname, 'missing-images.json')
  if (!existsSync(missingPath)) {
    console.log('❌ 未找到缺失图片列表，请先运行主脚本')
    process.exit(1)
  }

  const missingImages = JSON.parse(readFileSync(missingPath, 'utf-8'))
  console.log(`📋 需要下载 ${missingImages.length} 张海报\n`)

  if (missingImages.length === 0) {
    console.log('✅ 所有图片都已存在，无需下载')
    return
  }

  // 确保目录存在
  if (!existsSync(STATIC_DIR)) {
    mkdirSync(STATIC_DIR, { recursive: true })
  }

  // 启动浏览器
  console.log('🚀 正在启动浏览器...\n')
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage'
    ]
  })

  try {
    const page = await browser.newPage()
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36')
    await page.setViewport({ width: 1920, height: 1080 })

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < missingImages.length; i++) {
      const movie = missingImages[i]
      const imdbId = movie.imdb.replace(/^\//, '')
      const imagePath = join(STATIC_DIR, movie.src)

      process.stdout.write(`[${i + 1}/${missingImages.length}] ${movie.name}...`)

      // 获取海报 URL
      const posterUrl = await fetchPosterUrl(page, imdbId)

      if (!posterUrl) {
        console.log(' ❌ 未找到海报')
        failCount++
        continue
      }

      // 下载图片
      const success = await downloadImage(posterUrl, imagePath)
      
      if (success) {
        console.log(' ✅')
        successCount++
      } else {
        failCount++
      }

      // 避免请求过快
      if (i < missingImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    console.log('\n╔════════════════════════════════╗')
    console.log('║         下载完成统计           ║')
    console.log('╚════════════════════════════════╝')
    console.log(`总计:   ${missingImages.length} 张`)
    console.log(`成功:   ${successCount} 张`)
    console.log(`失败:   ${failCount} 张`)

  } finally {
    await browser.close()
  }
}

main()
