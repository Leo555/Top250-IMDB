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
