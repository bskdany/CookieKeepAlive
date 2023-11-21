const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {sleep,getPageToBeReloaded, isPortInUse} = require('../helpers/helpers.js')
const fs = require('fs')
var config = require('../config.js');

let isPageReloadRunning = false

async function cleanUnusedPorts(){
	const portMap = JSON.parse(fs.readFileSync('./port-map.json'))
	let newPortMap = {};
	for(context in portMap){
		port = portMap[context]
		if(await isPortInUse(port)){
			newPortMap[context] = port;			
		}
	}
	if(newPortMap!=portMap){ 
		fs.writeFileSync('./port-map.json', JSON.stringify(newPortMap, null, 2))
	}
}

async function reloadPages(){
	isPageReloadRunning = true

    var pageReloadCounter = 0
    try{	
		const ports = new Set(Object.values(JSON.parse(fs.readFileSync('./port-map.json'))))
		for(port of ports){
			try{
				const browser = await chromium.connectOverCDP(`http://localhost:${port}`);
				const context = browser.contexts()[0]
				const page = context.pages()[0]
				if(await getPageToBeReloaded(page)){
					await page.reload();
					pageReloadCounter+=1;
				}
			}
			catch(error){
				if(error.message.includes("ECONNREFUSED")){
					console.log(`Can't find context on port ${port}`)
				}
				else{
					console.log(error)
				}
				await cleanUnusedPorts()
			}
		}
    }
    catch(error){
		console.log(error)
		console.log("ERROR Execution context destroyed, not all pages were reloaded")
		await sleep(1000)
		await reloadPages()
    }
    
	if(pageReloadCounter>0){
		console.log("Reloaded " + pageReloadCounter + " pages")
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