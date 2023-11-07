const {sleep} = require('./helpers.js')
const exec = require('child_process').exec;
const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
const {getPageToBeReloaded} = require('./helpers.js')
chromium.use(stealth)
var config = require('./config.js')

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
  const command = config.chrome_filepath + ' ' + config.chrome_launch_flags
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
  }, config.page_reload_timeout)
})();