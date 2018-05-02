# RSS Clawer That Support Mutil Source 


## How to Use

```
npm install rss_clawer --save 
```

Support mutil rss source, like this.

```
let { Rss } = require("rss_clawer");
let rssSrv = new Rss({
  urls: ['https://cnodejs.org/rss',"https://www.zhihu.com/rss",],
  path:'storefiles/rss.txt', // store source
  type:'fs' //save the result into file
});

rssSrv.start()
rssSrv.stop() // stop the  service.
```

run the test
```
npm i

npm run test
```
