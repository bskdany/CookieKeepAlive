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
    const page = await getPage("test-id1");
    const page1 = await getPage("test-id2");
    // const page2 = await getPage("test-id3");
    // await page2.goto('https://bot.sannysoft.com');
    // const page3 = await getPage("test-id4");
    // await page3.goto('https://bot.sannysoft.com');
    // const page4 = await getPage("test-id5");
    // await page4.goto('https://bot.sannysoft.com');
    // await fuckWithNavigation(page);
    // await setPageToBeReloaded(page, true)
    // await page.screenshot({ path: '../data/sannysoft.png' });
    process.exit(0)
})()