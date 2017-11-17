// 注意： 由于人人影视会把系列电影放在一起，因此以下爬虫拿到的系列电影的数据均有问题，记得手动验证
// 还有一些 undefined 的也需要手动验证或者去别的网站拿数据

let movies = require('./movies.json')
const axios = require('axios')
const cheerio = require('cheerio')
const {persist} = require('./utils')
const _ = require('lodash')

const getUrl = keyword => {
  return `http://www.zimuzu.tv/search/index?keyword=${encodeURIComponent(keyword)}&search_type=`
}

const headers = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  Cookie: 'PHPSESSID=5c57np7i8dpmm371pnq3f09vn4',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.89 Safari/537.36'
}

const get = url => axios(url, {headers})

const step1 = async name => {
  let url = getUrl(name)
  let result
  const {data} = await get(url)
  let $ = cheerio.load(data)
  $('.search-result li').each((index, e) => {
    let $ = cheerio.load(e)
    if (!result && $(e).find('em').text() === '电影') {
      result = $(e).find('a').attr('href')
    }
  })
  if (result) {
    return result.split('/')[2]
  } else {
    return ''
  }
}

const step2 = async href => {
  const {data} = await get(`http://www.zimuzu.tv/resource/index_json/rid/${href}/channel/movie`)
  let url = data.replace(/\\/g, '').match(/http:\/\/xiazai003.com(.{7})/g)
  let res = url[0]
  if (res.endsWith('"')) res = res.substring(0, res.length - 1) // 正则学得不好，写出这么丑陋的代码
  return res
}

const step3 = async url => {
  const {data} = await get(url)
  let $ = cheerio.load(data)
  // 优先拿 HR-HDTV
  let li = $('#tab-g1-HR-HDTV.tab-pane').find('li')[2]
  // 如果没有的话用 720p
  if (!li) {
    li = $('#tab-g1-720P.tab-pane').find('li')[2]
  }
  // 还没有的话用 mp4
  if (!li) {
    li = $('#tab-g1-MP4.tab-pane').find('li')[2]
  }
  let res = $(li).find('a').attr('href')
  return res
}

const start = async (name) => {
  const href = await step1(name)
  if (href) {
    const url = await step2(href)
    if (url) {
      const res = await step3(url)
      console.log(name, res)
      let movie = movies.find(m => m.subject && m.subject.title === name)
      movie.download = res
    }
  }
}

async function go () {
  let count = 0
  let cmovies = movies.filter(m => !m.download)
  cmovies.forEach(m => console.log(m.name))
  // 建议分多次取数据
  cmovies = _.chunk(cmovies, 50)[0]
  console.log(cmovies.length)
  let inter = setInterval(async () => {
    let movie = cmovies[count++]
    if (movie) {
      if (movie.subject) {
        start(movie.subject.title).catch(e => console.log(e))
      }
    } else {
      clearInterval(inter)
      setTimeout(() => {
        persist(movies)
        console.log('end')
      }, 10 * 1000)
    }
  }, 5000)
}

go()

// start('十二只猴子')
