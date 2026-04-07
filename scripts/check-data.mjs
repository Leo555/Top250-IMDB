#!/usr/bin/env node

/**
 * 检查电影数据完整性
 * 找出所有异常数据
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const moviesPath = join(__dirname, 'movies.json')
const movies = JSON.parse(readFileSync(moviesPath, 'utf-8'))

console.log(`\n📊 开始检查 ${movies.length} 部电影数据...\n`)

const issues = {
  noChineseName: [],      // 无中文名
  noYear: [],             // 无年份
  noDirector: [],         // 无导演
  noActors: [],           // 无演员
  noShort: [],            // 无简介
  genresString: [],       // genres 是字符串
  noGenres: []            // 无类型
}

movies.forEach(movie => {
  const imdbId = movie.imdb?.replace(/^\//, '')
  
  // 检查中文名
  if (!movie.name || movie.name === movie.englishName) {
    issues.noChineseName.push({
      imdb: imdbId,
      englishName: movie.englishName,
      order: movie.order
    })
  }
  
  // 检查年份
  if (!movie.subject?.year) {
    issues.noYear.push({
      imdb: imdbId,
      englishName: movie.englishName,
      name: movie.name,
      order: movie.order
    })
  }
  
  // 检查导演
  if (!movie.director) {
    issues.noDirector.push({
      imdb: imdbId,
      englishName: movie.englishName,
      order: movie.order
    })
  }
  
  // 检查演员
  if (!movie.actors) {
    issues.noActors.push({
      imdb: imdbId,
      englishName: movie.englishName,
      order: movie.order
    })
  }
  
  // 检查简介
  if (!movie.short) {
    issues.noShort.push({
      imdb: imdbId,
      englishName: movie.englishName,
      order: movie.order
    })
  }
  
  // 检查 genres 格式
  if (movie.subject?.genres) {
    if (typeof movie.subject.genres === 'string') {
      issues.genresString.push({
        imdb: imdbId,
        englishName: movie.englishName,
        order: movie.order
      })
    }
  } else {
    issues.noGenres.push({
      imdb: imdbId,
      englishName: movie.englishName,
      order: movie.order
    })
  }
})

// 打印结果
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log('数据完整性检查报告')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

const categories = [
  { key: 'noChineseName', label: '无中文名', critical: true },
  { key: 'noYear', label: '无年份', critical: true },
  { key: 'noGenres', label: '无类型', critical: false },
  { key: 'noDirector', label: '无导演', critical: false },
  { key: 'noActors', label: '无演员', critical: false },
  { key: 'noShort', label: '无简介', critical: false },
  { key: 'genresString', label: 'genres格式错误', critical: false }
]

let totalIssues = 0
categories.forEach(({ key, label, critical }) => {
  const count = issues[key].length
  totalIssues += count
  if (count > 0) {
    const icon = critical ? '❌' : '⚠️'
    console.log(`${icon} ${label}: ${count} 部`)
    
    if (count <= 10 || critical) {
      issues[key].forEach(item => {
        console.log(`   #${item.order} ${item.englishName} (${item.imdb})`)
      })
    }
    console.log('')
  }
})

// 总结
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`总计问题: ${totalIssues} 个\n`)

if (totalIssues === 0) {
  console.log('✅ 所有数据完整！\n')
}

// 保存问题报告
const reportPath = join(__dirname, 'data-issues.json')
writeFileSync(reportPath, JSON.stringify(issues, null, 2), 'utf-8')
console.log(`✅ 问题报告已保存到: ${reportPath}\n`)
