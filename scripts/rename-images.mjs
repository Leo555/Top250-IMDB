#!/usr/bin/env node

/**
 * 将所有中文文件名的电影海报重命名为 IMDB ID 格式
 * 例如：星际穿越（2014）.png → tt0816692.png
 * 同时更新 movies-list.json 中的 src 字段
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../src/data')
const IMG_DIR = path.join(__dirname, '../static/img')

// 读取电影列表
const moviesListPath = path.join(DATA_DIR, 'movies-list.json')
const moviesList = JSON.parse(fs.readFileSync(moviesListPath, 'utf-8'))

let renamed = 0
let skipped = 0
let missing = 0

for (const movie of moviesList) {
  const imdbId = movie.imdb.replace('/', '') // tt0111161
  const oldSrc = movie.src
  const newSrc = `${imdbId}.png`

  // 跳过已经是英文名的
  if (oldSrc === newSrc) {
    skipped++
    continue
  }

  const oldPath = path.join(IMG_DIR, oldSrc)
  const newPath = path.join(IMG_DIR, newSrc)

  if (fs.existsSync(oldPath)) {
    // 重命名文件
    fs.renameSync(oldPath, newPath)
    // 更新 src 字段
    movie.src = newSrc
    renamed++
    console.log(`✓ ${oldSrc} → ${newSrc}`)
  } else if (fs.existsSync(newPath)) {
    // 新文件已存在，只需更新数据
    movie.src = newSrc
    skipped++
  } else {
    console.error(`✗ 文件不存在: ${oldSrc}`)
    movie.src = newSrc // 仍然更新数据
    missing++
  }
}

// 保存更新后的列表数据
fs.writeFileSync(moviesListPath, JSON.stringify(moviesList, null, 2) + '\n')

console.log(`\n完成！重命名: ${renamed}, 跳过: ${skipped}, 缺失: ${missing}`)
console.log('movies-list.json 已更新')
