const { setPageToBeReloaded, sleep } = require('../helpers/helpers.js');
const {getPage} = require('./page-controller.js');

async function fuckWithNavigation(page){
    await page.goto("https://google.com")
    await page.goto('https://bot.sannysoft.com');
    await page.goto("https://google.com")
    await page.goto('https://bot.sannysoft.com');
    await page.goto("https://google.com")
    await page.goto('https://bot.sannysoft.com');
    await page.goto("https://google.com")
    await page.goto('https://bot.sannysoft.com');
    await page.goto("https://google.com")
    await page.goto('https://bot.sannysoft.com');
    await page.goto("https://google.com")
    await page.goto('https://bot.sannysoft.com');
}

(async () => {
    const page = await getPage("test-id");
    const page1 = await getPage("test-id2");
    await setPageToBeReloaded(page, true)
    await setPageToBeReloaded(page1, true)

    await fuckWithNavigation(page);
    await fuckWithNavigation(page1);
    
    // await setPageToBeReloaded(page, true)
    // await page.screenshot({ path: '../media/sannysoft.png' });
    process.exit(0)
})()