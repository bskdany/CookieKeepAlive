const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {sleep,getPageToBeReloaded} = require('../helpers/helpers.js')
var config = require('../config.js');

let browser;
let isPageReloadRunning = false

async function connectToBrowser(){
	try{
		const browser = await chromium.connectOverCDP('http://localhost:9222');
		return browser
	}
	catch(e){
		console.log("ERROR Browser not found")
	}
	await sleep(1000)
	return await connectToBrowser()
}

async function reloadPages(){
	isPageReloadRunning = true
	try{
		var context = browser.contexts()[0]
    	var pages = context.pages()
	}
	catch(e){
		console.log("ERROR Couldn't get the contexts or the pages from the browser")
		do{	
			browser = await connectToBrowser();
			await sleep(1000);
		}
		while(!browser)
		await sleep(1000)
		await reloadPages()
		return
	}
    
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
	browser = await connectToBrowser()
    if(config.to_reload_pages){
		setInterval(async () => {
			if(!isPageReloadRunning){
				await reloadPages()
			}
		}, config.page_reload_timeout)
	}
})()