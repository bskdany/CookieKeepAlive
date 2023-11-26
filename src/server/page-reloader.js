const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {sleep, isPortInUse} = require('../helpers/helpers.js')
const fs = require('fs')
var config = require('../config.js');
const {getAllReloadablePorts} = require('../database/db-controller.js')

let isPageReloadRunning = false

async function reloadPages(){
	isPageReloadRunning = true

	const ports = getAllReloadablePorts()
	ports.forEach(async(port) => {
		try{
			const browser = await chromium.connectOverCDP(`http://localhost:${port}`);
			const context = browser.contexts()[0]
			const page = context.pages()[0]
			await page.reload();
			console.log(`Reloaded port ${port}`)
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

	isPageReloadRunning = false
}


(async() => {
    if(config.to_reload_pages){
		console.log("Page reloader started")
		setInterval(async () => {
			if(!isPageReloadRunning){
				await reloadPages()
			}
		}, config.page_reload_timeout)
	}
})()