// const {chromium} = require('playwright-extra')
// const stealth = require('puppeteer-extra-plugin-stealth')()
const { setPageToBeReloaded } = require('./helpers.js');
const {getPage} = require('./page-controller.js');
// chromium.use(stealth)

(async () => {
    const page = await getPage("test-id");
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
    await page.goto("https://google.com")
    await setPageToBeReloaded(page, true)
    process.exit()
})()