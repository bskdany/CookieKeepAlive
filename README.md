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