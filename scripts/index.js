const cheerio = require('cheerio')
const fs = require('fs')
const axios = require('axios')
const jsonfile = require('jsonfile')

const baseUrl = 'http://www.imdb.cn'
const keyMap = {
  '片名：': 'englishName',
  '别名：': 'nickName',
  '导演：': 'director',
  '主演：': 'actors'
}

let movies = []
let count = 0

async function go () {
  let tasks = []
  for (let i = 1; i <= 9; i++) {
    const {data} = await axios(`http://www.imdb.cn/imdb250/${i}`)
    let $ = cheerio.load(data)
    $('.ss-3 a').each((index, e) => {
      let $ = cheerio.load(e)
      const href = $(e).attr('href')
      tasks.push(buildMovie(href, ++count))
    })
  }
  await Promise.all(tasks)
  movies.sort((a, b) => a.order - b.order)
  jsonfile.writeFile('./movies.json', movies, {spaces: 2}, err => {
    if (err) console.error(err)
    console.log('movies persisted')
  })
}
async function buildMovie (href, order) {
  const {data} = await axios(`${baseUrl}${href}`)
  let $ = cheerio.load(data)
  let movie = {href, order}
  let fk = $('.fk')
  let img = $(fk).find('.fk-2 img')
  movie.url = $(img).attr('src')
  let hdd = $(fk).find('.fk-3 .hdd')
  movie.name = $(hdd).find('h3').text()
  console.log(movie.name, order)
  movie.score = $(hdd).find('span i').text()
  movie.src = `${movie.name}.png`
  download(movie.url, './img', movie.src)
  const bdd = $(fk).find('.fk-3 .bdd ul')
  bdd.children().each((i, ele) => {
    if (i < 4) {
      let key = $(ele).find('i').text()
      let value = ''
      $(ele).find('a').each((n, t) => {
        value += $(t).text() + ' '
      })
      movie[keyMap[key]] = value.substr(0, value.length - 1)
    }
  })
  let synopsis = $(fk).find('.fk-4 .bdd').text()
  movie['synopsis'] = synopsis.substr(0, 500).trim()
  movies.push(movie)
  Promise.resolve()
}

// 下载方法
const download = (url, dir, filename) => {
  axios.get(url, {
    responseType: 'arraybuffer'
  }).then(response => {
    let stream = fs.createWriteStream(dir + '/' + filename)
    stream.once('open', () => {
      stream.write(new Buffer(response.data, 'binary'))
      stream.end()
    })
  })
}

go()
