const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {sleep,getPageToBeReloaded, isPortInUse} = require('../helpers/helpers.js')
const fs = require('fs')
var config = require('../config.js');

let isPageReloadRunning = false

async function cleanUnusedPort(port){
	var portMap = JSON.parse(fs.readFileSync('./port-map.json'))
	for(key of Object.keys(portMap)){
		if(portMap[key]==port){
		  delete portMap[key]
		}
	}
	fs.writeFileSync('./port-map.json', JSON.stringify(portMap, null, 2))
}

async function reloadPages(){
	isPageReloadRunning = true

	try{	
		const ports = new Set(Object.values(JSON.parse(fs.readFileSync('./port-map.json'))))
		ports.forEach(async(port) => {
			try{
				const browser = await chromium.connectOverCDP(`http://localhost:${port}`);
				const context = browser.contexts()[0]
				const page = context.pages()[0]
				const toReload = await getPageToBeReloaded(page)
				if(toReload){
					await page.reload();
					console.log(`Reloaded page at port ${port}`)
				}
				else{
					console.log(`Skipped page reload for port ${port}`)
				}
			}
			catch(error){
				if(error.message.includes("ECONNREFUSED")){
					console.log(`Can't find context on port ${port}`)
					await cleanUnusedPort(port)
				}
				else{
					console.log(error)
					await sleep(1000)
					await reloadPages()
				}
			}
		});
    }

    catch(error){
		console.log(error)
		console.log("ERROR Execution context destroyed, not all pages were reloaded")
		await sleep(1000)
		await reloadPages()
    }
    
	isPageReloadRunning = false
  }

(async() => {
	console.log("Page reloader started")
    if(config.to_reload_pages){
		setInterval(async () => {
			if(!isPageReloadRunning){
				await reloadPages()
			}
		}, config.page_reload_timeout)
	}
})()