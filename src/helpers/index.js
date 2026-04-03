import { BAIDU_KEYS } from 'constants/index'

function fixzero (str) {
  str = str + ''
  return str.length === 1 ? '0' + str : str
}

export function year (date) {
  return date.getFullYear()
}

export function dateformat (str) {
  let d = new Date(str)
  return d.getFullYear() + '-' + fixzero((d.getMonth() + 1)) + '-' + fixzero(d.getDate())
}

export function getName (str) {
  return str.split(/（|）/)[0]
}

export function getYear (str) {
  let year = str.split(/（|）/)[1]
  if (!year) year = str
  return year
}

export function getKeywords (movies) {
  return movies.reduce((a, b) => {
    return a.concat([b.subject.title, b.subject.original_title])
  }, []).join(',')
}

/**
 * 高亮关键词（安全方式，不使用 innerHTML）
 * 返回数组，每项为 { text, highlight } 对象
 */
export function highlightKeyword (text, keyword) {
  if (!keyword) return [{text, highlight: false}]
  let kw = keyword.replace(/[-\\/^$*+?.()|[\]{}]/g, '\\$&')
  let regex = new RegExp(`(${kw})`, 'ig')
  let parts = text.split(regex)
  return parts.filter(p => p !== '').map(p => ({
    text: p,
    highlight: regex.test(p) || p.toLowerCase() === keyword.toLowerCase()
  }))
}

let baiduAnalysisInjected = false
export function buildBaiduAnalysis () {
  if (baiduAnalysisInjected) return
  baiduAnalysisInjected = true
  let hm = document.createElement('script')
  hm.src = `https://hm.baidu.com/hm.js?${BAIDU_KEYS}`
  let s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
}
