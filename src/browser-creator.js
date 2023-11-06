const {sleep} = require('./helpers.js')
const exec = require('child_process').exec;
const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
chromium.use(stealth)

const GOOGLE_CHROME_BINARY = '/usr/bin/google-chrome-stable';

function execute(command, callback){
  exec(command, function(error, stdout, stderr){ callback(stdout); });
}

async function reloadPages(context){
  var pages = context.pages()
  await Promise.all(pages.map(async (page) => {
    if (await getPageToBeReloaded(page)) {
      await page.reload();
    }
  }));
}

(async () => {
  // start browser
  const command = GOOGLE_CHROME_BINARY + ' --remote-debugging-port=9222 --no-first-run  --no-default-browser-check 2> browser.log &';
  execute(command, (stdout) => {
    console.log(stdout);
  });
  // waiting for the browser to open
  await sleep(1000)

  const browser = await chromium.connectOverCDP('http://localhost:9222');
  const defaultContext = browser.contexts()[0];
  const defaultPage =  await defaultContext.pages()[0];
  await defaultPage.goto('https://bot.sannysoft.com');

  setInterval(async () => {
    await reloadPages(defaultContext)
  }, 5 * 1000)
})();