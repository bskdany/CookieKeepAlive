const {chromium} = require('playwright-extra')
const exec = require('child_process').exec;
const fs = require('fs');
const http = require('http');
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)
const {getPageId, setPageId} = require('./browser-helpers')
const { Worker, isMainThread, parentPort } = require('worker_threads');


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
    context =  await getDefaultContext();
    const page = await context.newPage();
    await page.goto(url);
    await setPageToBeReloaded(page, toBeReloaded);
    await setPageId(page, id);
    console.log(await getPageId(page))
    return page;
}

async function getPage(id){
    context = await getDefaultContext();
    var pages = context.pages()

    for (const page of pages) {
        const target_page_id = await getPageId(page);
        console.log(target_page_id + " " + id)
        if (target_page_id == id) {
            return page;
        }
    }
    
    console.log("New page has to be created")
    return await createPage(id);
}

module.exports = {
    getPage
}

// (async () => {
//     context = await getDefaultContext();
//     var pages = context.pages()
//     await setPageId(pages[1],"BUKUKU");
//     console.log(await getPageId(pages[1]))
// })();