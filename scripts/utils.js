const axios = require('axios')
const jsonfile = require('jsonfile')
const fs = require('fs')
// 下载方法
const download = (url, dir, filename) => {
  axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0'
    },
    responseType: 'arraybuffer'
  }).then(response => {
    let stream = fs.createWriteStream(dir + '/' + filename)
    stream.once('open', () => {
      /* eslint-disable no-new */
      stream.write(new Buffer(response.data, 'binary'))
      stream.end()
    })
  })
}

const persist = movies => {
  jsonfile.writeFile('./movies.json', movies, {spaces: 2}, err => {
    if (err) console.error(err)
    console.log('movies persisted')
  })
}

module.exports = {
  download: download,
  persist: persist
}
