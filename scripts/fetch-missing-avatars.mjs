import fs from 'fs'
import path from 'path'
import https from 'https'

const DETAIL_PATH = path.join(import.meta.dirname, '..', 'src', 'data', 'movies-detail.json')
const AVATAR_DIR = path.join(import.meta.dirname, '..', 'public', 'static', 'img', 'avatars')

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', c => data += c)
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadImage(res.headers.location, dest).then(resolve).catch(reject)
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode))
      const ws = fs.createWriteStream(dest)
      res.pipe(ws)
      ws.on('finish', () => { ws.close(); resolve(true) })
    }).on('error', reject)
  })
}

// IMDB Suggest API - returns JSONP with person images
async function getAvatarFromIMDB(name) {
  try {
    // Normalize name for URL: lowercase, spaces to underscores
    const query = name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .slice(0, 30)
    
    const url = 'https://sg.media-imdb.com/suggests/' + query.charAt(0) + '/' + query + '.json'
    const text = await fetchText(url)
    
    // Parse JSONP: imdb$query({...})
    const jsonStr = text.replace(/^[^(]+\(/, '').replace(/\)$/, '')
    const data = JSON.parse(jsonStr)
    
    if (data.d && data.d.length > 0) {
      // Find person (nm prefix), prefer exact name match
      for (const item of data.d) {
        if (item.id && item.id.startsWith('nm') && item.i && item.i[0]) {
          // Check name similarity
          const itemName = item.l?.toLowerCase() || ''
          const searchName = name.toLowerCase()
          if (itemName === searchName || itemName.includes(searchName) || searchName.includes(itemName)) {
            // Resize image URL to 200px width
            let imgUrl = item.i[0]
            imgUrl = imgUrl.replace(/\._V1_\./, '._V1_UX200_.')
            return imgUrl
          }
        }
      }
      // Fallback: first person result
      for (const item of data.d) {
        if (item.id && item.id.startsWith('nm') && item.i && item.i[0]) {
          let imgUrl = item.i[0]
          imgUrl = imgUrl.replace(/\._V1_\./, '._V1_UX200_.')
          return imgUrl
        }
      }
    }
  } catch (e) {
    // Ignore errors
  }
  return null
}

async function main() {
  const detail = JSON.parse(fs.readFileSync(DETAIL_PATH, 'utf-8'))
  
  const missing = []
  const seen = new Set()
  
  Object.entries(detail).forEach(([id, m]) => {
    if (!m.subject) return
    const people = [...(m.subject.directors || []), ...(m.subject.casts || [])]
    people.forEach(p => {
      if (seen.has(p.name)) return
      seen.add(p.name)
      if (!p.avatars || !fs.existsSync(path.join(AVATAR_DIR, p.avatars))) {
        missing.push({ name: p.name })
      }
    })
  })
  
  console.log('Missing avatars: ' + missing.length + '\n')
  
  let success = 0, fail = 0
  
  for (let i = 0; i < missing.length; i++) {
    const p = missing[i]
    const tag = '[' + (i + 1) + '/' + missing.length + ']'
    
    const imgUrl = await getAvatarFromIMDB(p.name)
    
    if (!imgUrl) {
      fail++
      console.log(tag + ' MISS ' + p.name)
      await sleep(300)
      continue
    }
    
    const filename = p.name.replace(/[\/\\:*?"<>|]/g, '_') + '.png'
    const destPath = path.join(AVATAR_DIR, filename)
    
    try {
      await downloadImage(imgUrl, destPath)
      
      const fsize = fs.statSync(destPath).size
      if (fsize < 1024) {
        fs.unlinkSync(destPath)
        throw new Error('Too small: ' + fsize + 'B')
      }
      
      // Compress with sharp
      const sharp = (await import('sharp')).default
      const tmpPath = destPath + '.tmp'
      await sharp(destPath).resize({ width: 200, fit: 'inside' }).png({ compressionLevel: 9 }).toFile(tmpPath)
      fs.renameSync(tmpPath, destPath)
      
      // WebP
      await sharp(destPath).webp({ quality: 80 }).toFile(destPath.replace('.png', '.webp'))
      
      // Update all references
      Object.values(detail).forEach(m => {
        if (!m.subject) return
        ;[...(m.subject.directors || []), ...(m.subject.casts || [])].forEach(person => {
          if (person.name === p.name) person.avatars = filename
        })
      })
      
      success++
      const kb = (fs.statSync(destPath).size / 1024).toFixed(1)
      console.log(tag + ' OK ' + p.name + ' (' + kb + 'KB)')
    } catch (e) {
      fail++
      console.log(tag + ' ERR ' + p.name + ': ' + e.message)
      try { fs.unlinkSync(destPath) } catch {}
    }
    
    await sleep(400)
  }
  
  fs.writeFileSync(DETAIL_PATH, JSON.stringify(detail, null, 2), 'utf-8')
  
  console.log('\n=== DONE ===')
  console.log('Success: ' + success + '/' + missing.length)
  console.log('Failed:  ' + fail)
}

main().catch(console.error)
