## Persistent Browser
A playwright browser instance that autorefreshes pages and keeps a session alive

### How to
The easiest way to deploy the browser is docker
```
version: '3'
services:
  persistent-browser:
    container_name: persistent-browser
    image: persistent-browser:latest
    restart: always
    network_mode: host
```

Then run test script in src/client/
```
const { setPageToBeReloaded, sleep } = require('../helpers/helpers.js');
const {getPage} = require('./page-controller.js');

(async () => {
    const page = await getPage("test-id");
    await setPageToBeReloaded(page, true)
 
    await page.screenshot({ path: '../media/sannysoft.png' });
    process.exit(0)
})()
```

### How does is work
Two scripts run independently with [pm2]('https://www.npmjs.com/package/pm2):
1. start-server: starts a express server and wait for incoming GET requests that contain a pageId, it then calls a script that opens a new persistent content and applies the id
2. page-reloader: connects to the running brower instance and uses the custom set local storage values in each page to determine if it needs to be reloaded or not

The page-controller script in src/client acts as an intermediate, calling it will get either a new page or an old page depending on the page custom id. 

### Why this project
There are multiple cases in web automation scenarios when you need a persistent browser that runs 24/7, especially when 2fa is in play and there is a session expiery

### Antibot test
![bot-test](https://raw.githubusercontent.com/bskdany/PersistentBrowser/main/src/media/sannysoft.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
