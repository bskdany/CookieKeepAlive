const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {sleep,getPageToBeReloaded} = require('../helpers/helpers.js')
var config = require('../config.js');

let browser;

async function connectToBrowser(){
	const browser = await chromium.connectOverCDP('http://localhost:9222');
	if(browser.isConnected()){
		console.log("Browser connected at port 9222")
		return browser
	}
	else{
		console.error("Couldn't not find browser at port 9222, is it running?")
		return null
	}
}


async function reloadPages(){
	try{
		var context = browser.contexts()[0]
    	var pages = context.pages()
	}
	catch(e){
		console.log(e)
		console.log("ERROR Couldn't get the contexts or the pages from the browser")
		browser = await connectToBrowser()
		await sleep(5000)
		await reloadPages()
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
		console.log(e)
		console.log("ERROR Execution context destroyed, pages were not reloaded")
		browser = await connectToBrowser()
		await sleep(5000)
		await reloadPages()
    }
    
    console.log("Succesfully reloaded " + page_reloaded_counter + " pages")
  }

(async() => {
	browser = await connectToBrowser()

    if(config.to_reload_pages){
		setInterval(async () => {
			await reloadPages()
		}, config.page_reload_timeout)
	}
})()