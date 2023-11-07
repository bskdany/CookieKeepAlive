const {sleep} = require('./helpers.js')
const exec = require('child_process').exec;
const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
const {getPageToBeReloaded, isRunningInDocker} = require('./helpers.js')
chromium.use(stealth)
var config = require('./config.js');

function execute(command, callback){
  exec(command, function(error, stdout, stderr){ callback(stdout); });
}

async function reloadPages(browser){
  var context = browser.contexts()[0]
  var pages = context.pages()
  await Promise.all(pages.map(async (page) => {
    if (await getPageToBeReloaded(page)) {
      await page.reload();
    }
  }));
}

(async () => {
  runHeadless = config.chrome_use_headless
  command = config.chrome_filepath + ' ' + config.chrome_launch_flags
  if (isRunningInDocker()) {
    console.log('Running inside a Docker container');
    runHeadless = false
    command += ' --headless=new'
  }

  execute(command, (stdout) => {
    console.log(stdout);
  });
  // waiting for the browser to open
  await sleep(1000)

  const browser = await chromium.connectOverCDP('http://localhost:9222');
  if(!browser.isConnected()){
    console.error("Couldn't not find browser at port 9222, is it running?")
  }

  if(runHeadless){
    var context = await browser.newContext()
    var page = await context.newPage()
   
  }
  else{
    var context = browser.contexts()[0];
    var page =  context.pages()[0];

  }
  await page.goto('https://bot.sannysoft.com');
  await page.screenshot({ path: 'screenshot.png' })

  if(config.to_reload_pages){
    setInterval(async () => {
      await reloadPages(browser)
    }, config.page_reload_timeout)
  }

})();