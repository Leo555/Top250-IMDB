#!/usr/bin/env node

/**
 * 重试下载缺失的海报图片
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const moviesPath = join(__dirname, 'movies.json')
const movies = JSON.parse(readFileSync(moviesPath, 'utf-8'))

const stillMissingPath = join(__dirname, 'still-missing-images.json')
const stillMissing = JSON.parse(readFileSync(stillMissingPath, 'utf-8'))

console.log(`\n🔄 准备重试下载 ${stillMissing.length} 张缺失的海报...\n`)

// 创建映射
const movieMap = new Map()
movies.forEach(m => movieMap.set(m.imdb, m))

let successCount = 0
let failCount = 0

for (const item of stillMissing) {
  const movie = movieMap.get(item.imdb)
  if (!movie) {
    console.log(`❌ ${item.name} - 未找到电影数据`)
    failCount++
    continue
  }

  // 从 movies-detail.json 获取图片URL
  const detailPath = join(__dirname, '../src/data/movies-detail.json')
  const details = JSON.parse(readFileSync(detailPath, 'utf-8'))
  const detail = details[movie.imdb]  // 直接通过 key 访问
  
  if (!detail || !detail.image) {
    console.log(`❌ ${item.name} - 未找到图片URL`)
    failCount++
    continue
  }

  const imageUrl = detail.image
  const targetPath = join(__dirname, '../static', item.src)
  
  process.stdout.write(`📥 正在下载 ${item.name}...`)
  
  try {
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
      }
    })
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    
    const buffer = await response.arrayBuffer()
    const uint8Array = new Uint8Array(buffer)
    
    // 转换为 PNG
    const sharp = (await import('sharp')).default
    await sharp(uint8Array)
      .resize(600, 900, {
        fit: 'cover',
        position: 'top'
      })
      .png({ quality: 95 })
      .toFile(targetPath)
    
    console.log(' ✅')
    successCount++
  } catch (error) {
    console.log(` ❌ ${error.message}`)
    failCount++
  }
  
  // 延迟
  await new Promise(resolve => setTimeout(resolve, 1000))
}

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
console.log(`✅ 成功: ${successCount} 张`)
console.log(`❌ 失败: ${failCount} 张`)
console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

// 更新缺失列表
const remaining = stillMissing.filter((_, i) => {
  const item = stillMissing[i]
  const targetPath = join(__dirname, '../static', item.src)
  return !existsSync(targetPath)
})

if (remaining.length > 0) {
  writeFileSync(join(__dirname, 'still-missing-images.json'), JSON.stringify(remaining, null, 2))
  console.log(`📝 剩余 ${remaining.length} 部电影仍缺失海报\n`)
} else {
  console.log('🎉 所有海报下载完成！\n')
}
