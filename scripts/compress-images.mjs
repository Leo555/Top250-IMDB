#!/usr/bin/env node

/**
 * 压缩海报图片：PNG → WebP + 缩小尺寸
 * 海报在卡片中最大显示约 300px 宽，详情页约 400px 宽
 * 统一限制最大宽 600px，转 WebP 质量 80
 */

import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const IMG_DIR = path.join(__dirname, '../public/static/img')
const MAX_WIDTH = 600
const WEBP_QUALITY = 80

function fmt(bytes) {
  return bytes >= 1048576 ? `${(bytes / 1048576).toFixed(1)}MB` : `${(bytes / 1024).toFixed(0)}KB`
}

async function main() {
  const files = fs.readdirSync(IMG_DIR).filter(f => f.startsWith('tt') && f.endsWith('.png'))
  console.log(`压缩 ${files.length} 张海报...\n`)

  let totalBefore = 0, totalAfter = 0, count = 0

  for (const file of files) {
    const fp = path.join(IMG_DIR, file)
    const before = fs.statSync(fp).size
    totalBefore += before

    const name = path.basename(file, '.png')
    const webpPath = path.join(IMG_DIR, `${name}.webp`)

    // 生成 WebP
    await sharp(fp)
      .resize(MAX_WIDTH, null, { withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(webpPath)

    const after = fs.statSync(webpPath).size
    totalAfter += after
    count++

    if (before > 512000) {
      console.log(`  ${file}: ${fmt(before)} → ${fmt(after)} (${((1 - after / before) * 100).toFixed(0)}%↓)`)
    }

    if (count % 50 === 0) console.log(`  ...已处理 ${count}/${files.length}`)
  }

  console.log(`\n✅ 完成！`)
  console.log(`  PNG 总大小: ${fmt(totalBefore)}`)
  console.log(`  WebP 总大小: ${fmt(totalAfter)}`)
  console.log(`  压缩率: ${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%`)
  console.log(`  节省: ${fmt(totalBefore - totalAfter)}`)
}

main().catch(console.error)
