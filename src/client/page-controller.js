const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {getPageId, setPageId, setPageToBeReloaded, getPageToBeReloaded, sleep} = require('../helpers/helpers.js')
const axios = require('axios');

async function getRemoteContext(pageId) {
  const apiUrl = 'http://localhost:3000/get-page';
    console.log(pageId)
  try {
    const response = await axios.get(apiUrl, {params: {pageId: pageId}});
    const responseData = response.data;

    console.log('API Response:', responseData);

    return responseData["urlPort"]
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function getContext(pageId){
    const port = await getRemoteContext(pageId)

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

    const page = await context.newPage();
    if(pages.length>0 && pages[0].url()=="about:blank"){
        await context.pages()[0].close()
    }

    return page;
}

async function initializePage(page, pageId, toBeReloaded=false, url = "https://bot.sannysoft.com"){
    try{
        await page.goto(url);
        await setPageToBeReloaded(page, toBeReloaded);
        await setPageId(page, pageId);
        console.log("New page is created with id: " + pageId)
        return page
    }
    catch(error){
        console.error(error)
        console.error("Execution context was destroyed when creating a page")
        await sleep(1000)
        await initializePage(page, pageId, toBeReloaded, url)
    }
}

async function getPage(pageId){
    const context = await getContext(pageId);
    page = await removePlaceholderPage(context);
    page = await initializePage(page, pageId);
    return page;
}

module.exports = {
    getPage
}