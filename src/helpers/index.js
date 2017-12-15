import { BAIDU_KEYS } from 'constants/index'

export function isFalse (val) {
  return val === false
}
export function isEmptyStr (str) {
  return str === ''
}
export function isNotEmptyStr (str) {
  return str !== ''
}

function fixzero (str) {
  str = str + ''
  return str.length === 1 ? '0' + str : str
}

export function year (date) {
  return date.getYear() + 1900
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

export function buildBaiduAnalysis () {
  let hm = document.createElement('script')
  hm.src = `https://hm.baidu.com/hm.js?${BAIDU_KEYS}`
  let s = document.getElementsByTagName('script')[0]
  s.parentNode.insertBefore(hm, s)
}
