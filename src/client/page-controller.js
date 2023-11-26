const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {sleep} = require('../helpers/helpers.js')
const axios = require('axios');

async function connectToRemoteBrowser(intention, pageId) {
  const apiUrl = `http://localhost:3000/${intention}`;

  try {
    const response = await axios.get(apiUrl, {params: {pageId: pageId}});
    const responseData = response.data;

    console.log('API Response:', responseData);

	if(intention=="get-page"){
		return responseData["port"]
	}

  } catch (error) {
        console.error('Error:', error.message); 
        throw Error("Remote Browser not found")
  }
}

async function getContext(pageId){
    const port = await connectToRemoteBrowser("get-page", pageId)

    const browser = await chromium.connectOverCDP(`http://localhost:${port}`);
    if(!browser){
        console.log("Can't find browser")
        return null
    }
    const context = browser.contexts()[0];
    return context;
}

async function removePlaceholderPage(context){
    const pages = await context.pages();

    if(pages.length>0 && pages[0].url()=="about:blank"){
        const page = await context.newPage();
        await page.goto("https://bot.sannysoft.com")
        await context.pages()[0].close()
        return page;
    }
    return pages[0]
    
}

async function getPage(pageId){
    const context = await getContext(pageId);
    page = await removePlaceholderPage(context);
    return page;
}

async function returnPage(pageId){
	await connectToRemoteBrowser("return-page", pageId)
}

module.exports = {
    getPage,
	returnPage
}