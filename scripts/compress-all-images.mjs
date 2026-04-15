import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { rename, unlink } from 'fs/promises'

const IMG_DIR = join(import.meta.dirname, '..', 'public', 'static', 'img')

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + 'B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB'
  return (bytes / 1024 / 1024).toFixed(2) + 'MB'
}

async function compressFile(filePath, maxW) {
  const s = await stat(filePath)
  
  // 跳过小于10KB的文件
  if (s.size < 10240) return null
  
  try {
    const meta = await sharp(filePath).metadata()
    const needResize = meta.width > maxW
    const webpPath = filePath.replace(/\.(png|jpe?g)$/i, '.webp')
    
    // 压缩PNG
    let p = sharp(filePath)
    if (needResize) p = p.resize({ width: maxW, fit: 'inside' })
    await p.png({ compressionLevel: 9 }).toFile(filePath + '.new')
    const newSize = (await stat(filePath + '.new')).size
    
    // 如果压缩后更小则替换
    if (newSize < s.size) {
      await rename(filePath + '.new', filePath)
    } else {
      await unlink(filePath + '.new')
    }
    
    // 生成WebP
    let w = sharp(filePath)
    if (needResize) w = w.resize({ width: maxW, fit: 'inside' })
    await w.webp({ quality: 80, effort: 6 }).toFile(webpPath)
    const ws = (await stat(webpPath)).size
    
    return { orig: s.size, png: Math.min(newSize, s.size), webp: ws }
  } catch (e) {
    console.error('  ERR ' + filePath.split('/').pop() + ': ' + e.message)
    return null
  }
}

async function main() {
  console.log('Compressing all images in repo...\n')
  
  let totalO = 0, totalP = 0, totalW = 0, count = 0
  
  // 1. 海报 tt*.png
  console.log('=== [1/3] Posters ===')
  const posters = (await readdir(IMG_DIR)).filter(f => f.startsWith('tt') && /\.(png|jpe?g)$/i.test(f))
  for (const f of posters) {
    count++
    const r = await compressFile(join(IMG_DIR, f), 600)
    if (!r) continue
    totalO += r.orig; totalP += r.png; totalW += r.webp
    if (r.orig > 200000 || count % 80 === 0) {
      console.log('  OK ' + f + ': ' + formatBytes(r.orig) + ' -> PNG:' + formatBytes(r.png) + ' WebP:' + formatBytes(r.webp))
    }
  }
  console.log('  Posters done: ' + posters.length)

  // 2. 头像 avatars/
  console.log('\n=== [2/3] Avatars ===')
  const avDir = join(IMG_DIR, 'avatars')
  if (existsSync(avDir)) {
    const avatars = (await readdir(avDir)).filter(f => /\.(png|jpe?g)$/i.test(f))
    for (const f of avatars) {
      count++
      const r = await compressFile(join(avDir, f), 200)
      if (!r) continue
      totalO += r.orig; totalP += r.png; totalW += r.webp
      if (r.orig > 30000 || count % 300 === 0) {
        console.log('  OK ' + f + ': ' + formatBytes(r.orig) + ' -> PNG:' + formatBytes(r.png) + ' WebP:' + formatBytes(r.webp))
      }
    }
    console.log('  Avatars done: ' + avatars.length)
  }

  // 3. 其他图片（非tt开头的中文文件名等）
  console.log('\n=== [3/3] Other images ===')
  const others = (await readdir(IMG_DIR))
    .filter(f => /\.(png|jpe?g)$/i.test(f) && !f.startsWith('tt') && !f.startsWith('pwa-') && !f.startsWith('apple-touch') && !f.startsWith('favicon'))
  for (const f of others) {
    count++
    const r = await compressFile(join(IMG_DIR, f), 600)
    if (!r) continue
    totalO += r.orig; totalP += r.png; totalW += r.webp
    if (r.orig > 50000) {
      console.log('  OK ' + f + ': ' + formatBytes(r.orig) + ' -> PNG:' + formatBytes(r.png) + ' WebP:' + formatBytes(r.webp))
    }
  }
  if (others.length) console.log('  Others done: ' + others.length)

  // 总结
  console.log('\n' + '='.repeat(50))
  console.log('RESULT:')
  console.log('='.repeat(50))
  console.log('  Files processed: ' + count)
  if (totalO > 0) {
    console.log('  Orig size:       ' + formatBytes(totalO))
    console.log('  After PNG comp:  ' + formatBytes(totalP) + (' ' + ((1-totalP/totalO)*100).toFixed(1) + '% smaller'))
    console.log('  WebP versions:   ' + formatBytes(totalW) + (' ' + ((1-totalW/totalO)*100).toFixed(1) + '% smaller'))
  }

  const { execSync } = await import('child_process')
  try {
    const finalSize = execSync('du -sh "' + IMG_DIR + '"').toString().trim()
    console.log('\n  Total dir size: ' + finalSize)
  } catch {}
}

main().catch(console.error)
