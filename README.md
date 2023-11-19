## CookieKeepAlive
A playwright browser instance that autorefreshes pages and keeps cookies alive

### How to
The easiest way to deploy the browser is docker
```
version: '3'
services:
  persistent-browser:
    container_name: persistent-browser
    image: cookie-keep-alive:latest
    restart: always
```

### How does is work
Two scripts run independently with [pm2]('https://www.npmjs.com/package/pm2):
1. start-persistent-browser: checks periodically if a browser instance exists, if it doesn't it spawns a playwright-extra persistent context with CDP port 9222 exposed and custom chrome binary
2. page-reloader: connects to the running brower instance and uses the custom set session storage values in each page to determine if it needs to be reloaded or not

The page-controller script in src/client acts as an intermediate, calling it will get either a new page or an old page depending on the page custom id. 

### Why this project
There are multiple cases in web automation scenarios when you need a persistent browser that runs 24/7, especially when 2fa is in play and there is a session expiery

### Antibot test
![bot-test](https://raw.githubusercontent.com/bskdany/PersistentBrowser/main/src/data/sannysoft.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
