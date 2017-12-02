# Top250-IMDB
IMDB Top250 movies 

## 爬虫

如果对爬虫感兴趣，可以看 `scripts` 下面的代码，movies.json 中的数据分别来自于：
- http://www.imdb.cn 对应 `index.js`
- https://movie.douban.com 对应 `douban.js` 和 `fetchPic.js`
- http://www.zimuzu.tv 对应 `fetchDownload.js`

由于网站有访问次数限制，所以定时 5s 取一次数据，但是有时候依然会失败，没关系，等 job 跑完继续跑一次即可，建议分多次爬取数据。


## 网页

* 网页使用 vue + vuex + vue-router 创建，基于[vuejs-templates/webpack](https://github.com/vuejs-templates/webpack)
* 静态页面，代码托管于 github pages 和 coding.net
* 使用 [vue-meta](https://github.com/declandewet/vue-meta) + [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) 提供 网页 SEO
* [prerender-spa-plugin](https://github.com/chrisvfritz/prerender-spa-plugin) 提高首屏渲染速度

## Build Setup

``` bash
# install dependencies
npm install / yarn install

# serve with hot reload at localhost:8080
npm run dev / npm start

# build for production with minification
npm run build
```


## LICENSE

MIT
