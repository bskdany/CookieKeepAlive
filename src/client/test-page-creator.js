const { setPageToBeReloaded } = require('../helpers/helpers.js');
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
    await page.goto('https://bot.sannysoft.com');
    // await fuckWithNavigation(page);
    await setPageToBeReloaded(page, true)
    process.exit(0)
})()