const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {getPageId, setPageId, setPageToBeReloaded, getPageToBeReloaded, sleep} = require('./helpers.js')

async function getDefaultContext(){
    const browser = await chromium.connectOverCDP('http://localhost:9222');
    if(!browser){
        console.log("Can't find browser")
        return null
    }
    const context = browser.contexts()[0];
    return context;
}

async function createPage(id, toBeReloaded=false, url = "https://bot.sannysoft.com"){
    try{
        context =  await getDefaultContext();
        const page = await context.newPage();
        await page.goto(url);
        await setPageToBeReloaded(page, toBeReloaded);
        await setPageId(page, id);
        console.log("New page is created with id: " + id)
        return page;
    }
    catch{
        console.error("Execution context was destroyed when creating a page")
        sleep(1000)
        await createPage(id, toBeReloaded, url)
    }
}

async function getPage(id){
    context = await getDefaultContext();
    var pages = context.pages()
    for (const page of pages) {
        const target_page_id = await getPageId(page);
        if (target_page_id == id) {
            console.log("Found existing page with id: " + target_page_id)
            return page;
        }
    }
    return await createPage(id);
}

module.exports = {
    getPage
}