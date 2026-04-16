import fs from 'fs'
import path from 'path'
import https from 'https'

const DETAIL_PATH = path.join(import.meta.dirname, '..', 'src', 'data', 'movies-detail.json')
const AVATAR_DIR = path.join(import.meta.dirname, '..', 'public', 'static', 'img', 'avatars')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302)
        return fetchText(res.headers.location).then(resolve).catch(reject)
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(d))
    }).on('error', reject)
  })
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302)
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject)
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode))
      const ws = fs.createWriteStream(dest)
      res.pipe(ws)
      ws.on('finish', () => { ws.close(); resolve(true) })
    }).on('error', reject)
  })
}

async function getIMDBAvatar(name) {
  try {
    const query = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_').slice(0, 30)
    const url = 'https://sg.media-imdb.com/suggests/' + query.charAt(0) + '/' + query + '.json'
    const text = await fetchText(url)
    const json = JSON.parse(text.replace(/^[^(]+\(/, '').replace(/\)$/, ''))
    if (json.d) {
      // 精确匹配
      for (const item of json.d) {
        if (item.id?.startsWith('nm') && item.i?.[0]) {
          const n = (item.l || '').toLowerCase()
          if (n === name.toLowerCase()) return { img: item.i[0].replace(/\._V1_\./, '._V1_UX200_.'), id: item.id }
        }
      }
      // 模糊匹配
      for (const item of json.d) {
        if (item.id?.startsWith('nm') && item.i?.[0]) return { img: item.i[0].replace(/\._V1_\./, '._V1_UX200_.'), id: item.id }
      }
    }
  } catch {}
  return null
}

async function main() {
  const detail = JSON.parse(fs.readFileSync(DETAIL_PATH, 'utf-8'))
  const existingAvatars = new Set(fs.readdirSync(AVATAR_DIR))

  // 收集所有 actors 字段中有但 casts 中没有的人（用更好的解析方式）
  let toProcess = []
  
  Object.entries(detail).forEach(([id, m]) => {
    if (!m.actors || !m.subject) return
    if (!m.subject.casts) m.subject.casts = []
    const castsNames = new Set(m.subject.casts.map(c => c.name))
    
    // 更好的解析：按 "中文名 English Name" 模式
    // actors 格式: "中文名1 English Name1 中文名2 English Name2 ..."
    const parts = m.actors.split(/\s+/)
    let i = 0
    while (i < parts.length) {
      // 找中文名（非 ASCII 开头）
      if (/^[^\x00-\x7F]/.test(parts[i])) {
        const cnName = parts[i]
        i++
        // 收集紧跟的英文名（ASCII 开头的连续 token）
        let enParts = []
        while (i < parts.length && /^[A-Z]/.test(parts[i]) && !/^[^\x00-\x7F]/.test(parts[i])) {
          enParts.push(parts[i])
          i++
        }
        const enName = enParts.join(' ')
        if (enName && !castsNames.has(cnName)) {
          toProcess.push({ movieId: id, cn: cnName, en: enName })
          castsNames.add(cnName)
        }
      } else {
        i++
      }
    }
  })

  // 去重（同一人可能出现在多部电影）
  const personMap = new Map() // en -> { cn, en, movies[] }
  toProcess.forEach(p => {
    const key = p.en
    if (!personMap.has(key)) personMap.set(key, { cn: p.cn, en: p.en, movies: [] })
    personMap.get(key).movies.push(p.movieId)
  })

  const people = [...personMap.values()]
  console.log('需要处理: ' + people.length + ' 人\n')

  let success = 0, skip = 0, fail = 0

  for (let i = 0; i < people.length; i++) {
    const p = people[i]
    const tag = '[' + (i + 1) + '/' + people.length + ']'
    const filename = p.en.replace(/ /g, '_').replace(/[\/\\:*?"<>|]/g, '') + '.png'

    // 已有头像文件
    if (existingAvatars.has(filename)) {
      // 直接加入 casts
      p.movies.forEach(mid => {
        const m = detail[mid]
        if (!m.subject.casts) m.subject.casts = []
        const names = new Set(m.subject.casts.map(c => c.name))
        if (!names.has(p.cn)) {
          m.subject.casts.push({ alt: '', avatars: filename, name: p.cn, id: null, englishName: p.en })
        }
      })
      skip++
      continue
    }

    // 从 IMDB 获取
    const result = await getIMDBAvatar(p.en)
    if (!result) {
      // 没图也加入 casts（显示首字母）
      p.movies.forEach(mid => {
        const m = detail[mid]
        if (!m.subject.casts) m.subject.casts = []
        const names = new Set(m.subject.casts.map(c => c.name))
        if (!names.has(p.cn)) {
          m.subject.casts.push({ alt: '', avatars: null, name: p.cn, id: null, englishName: p.en })
        }
      })
      fail++
      console.log(tag + ' MISS ' + p.cn + ' (' + p.en + ')')
      await sleep(300)
      continue
    }

    const destPath = path.join(AVATAR_DIR, filename)
    try {
      await downloadImage(result.img, destPath)
      if (fs.statSync(destPath).size < 1024) { fs.unlinkSync(destPath); throw new Error('too small') }

      const sharp = (await import('sharp')).default
      await sharp(destPath).resize({ width: 200, fit: 'inside' }).png({ compressionLevel: 9 }).toFile(destPath + '.tmp')
      fs.renameSync(destPath + '.tmp', destPath)
      await sharp(destPath).webp({ quality: 80 }).toFile(destPath.replace('.png', '.webp'))

      p.movies.forEach(mid => {
        const m = detail[mid]
        if (!m.subject.casts) m.subject.casts = []
        const names = new Set(m.subject.casts.map(c => c.name))
        if (!names.has(p.cn)) {
          m.subject.casts.push({ alt: '', avatars: filename, name: p.cn, id: result.id, englishName: p.en })
        }
      })

      success++
      console.log(tag + ' OK ' + p.cn + ' (' + p.en + ')')
    } catch (e) {
      fail++
      console.log(tag + ' ERR ' + p.cn + ': ' + e.message)
      try { fs.unlinkSync(destPath) } catch {}
    }
    await sleep(400)
  }

  fs.writeFileSync(DETAIL_PATH, JSON.stringify(detail, null, 2), 'utf-8')
  console.log('\n=== DONE ===')
  console.log('New downloads: ' + success)
  console.log('Already had avatar: ' + skip)
  console.log('Failed: ' + fail)
}

main().catch(console.error)
