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

/**
 * contruct movies data to hash to speed up searching
 * @param movies
 */
export function constructMoviesData (movies) {
  let hashTable = {}
  movies.forEach(m => {
    const v = m.englishName
    let keys = [v]
    // 按照中文名字和英文名搜索
    keys.push(m.name)
    if (m.subject) {
      // 中文名可能有所不同
      keys.push(m.subject.title)
      keys.push(m.subject.original_title)
      // 按照导演搜
      m.subject.directors.forEach(d => {
        keys.push(d.name)
      })
      // 按照演员搜
      m.subject.casts.forEach(d => {
        keys.push(d.name)
      })
    }
    keys.map(k => {
      hashTable[k] = v
    })
  })
  return hashTable
}
