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
    // const page2 = await getPage("test-id3");
    // const page3 = await getPage("test-id4");
    const page4 = await getPage("test-id1")
    await page4.goto("https://google.com")
    await setPageToBeReloaded(page, true)
    await setPageToBeReloaded(page1, true)
    await setPageToBeReloaded(page4, true)


    // await fuckWithNavigation(page);
    // await setPageToBeReloaded(page, true)
    // await page.screenshot({ path: '../media/sannysoft.png' });
    process.exit(0)
})()