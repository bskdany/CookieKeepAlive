const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {sleep,getPageToBeReloaded, isPortInUse} = require('../helpers/helpers.js')
const fs = require('fs')
var config = require('../config.js');

let pages = []
let isPageReloadRunning = false

async function removeUnusedPortsFromContextMap(){
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

	// take the ports, make a set and then transform in array
	return Array.from(new Set(Object.values(newPortMap)))
}

async function getAllPages(){
	ports = await removeUnusedPortsFromContextMap()
	pages = []
	for(port of ports){
		const context = await getRemoteContext(port)
		const page = context.pages()[0]
		pages.push(page)
	}
}

async function getRemoteContext(port){
	try{
		const browser = await chromium.connectOverCDP(`http://localhost:${port}`);
		const context = browser.contexts()[0]
		return context
	}
	catch(e){
		console.log("ERROR Browser not found")
		console.log(e)
	}
	// await sleep(1000)
	// return await connectToBrowser()
}

async function reloadPages(){
	isPageReloadRunning = true
	// try{
	// 	var context = browser.contexts()[0]
    // 	var pages = context.pages()
	// }
	// catch(e){
	// 	console.log("ERROR Couldn't get the contexts or the pages from the browser")
	// 	do{	
	// 		browser = await connectToBrowser();
	// 		await sleep(1000);
	// 	}
	// 	while(!browser)
	// 	await sleep(1000)
	// 	await reloadPages()
	// 	return
	// }
    
    var page_reloaded_counter = 0
    try{
      await Promise.all(pages.map(async (page) => {
        if (await getPageToBeReloaded(page)) {
          page_reloaded_counter+=1
          await page.reload();
        }
      }));
    }
    catch(e){
		// console.log(e)
		console.log("ERROR Execution context destroyed, not all pages were not reloaded")
		// browser = await connectToBrowser()
		await sleep(1000)
		await reloadPages()
    }
    
    console.log("Succesfully reloaded " + page_reloaded_counter + " pages")
	isPageReloadRunning = false
  }

(async() => {
	await getAllPages()
    if(config.to_reload_pages){
		setInterval(async () => {
			if(!isPageReloadRunning){
				await reloadPages()
			}
		}, config.page_reload_timeout)
	}
})()