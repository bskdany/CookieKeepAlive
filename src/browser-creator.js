const exec = require('child_process').exec;
const net = require('net');
const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
const {sleep, getPageToBeReloaded, isRunningInDocker} = require('./helpers.js')
chromium.use(stealth)
var config = require('./config.js');


async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });

    server.once('listening', () => {
      server.close();
      resolve(false);
    });

    server.listen(port, '127.0.0.1');
  });
}

function execute(command, callback){
  exec(command, function(error, stdout, stderr){ callback(stdout); });
}

async function reloadPages(browser){
  var context = browser.contexts()[0]
  var pages = context.pages()
  var page_reloaded_counter = 0
  await Promise.all(pages.map(async (page) => {
    if (await getPageToBeReloaded(page)) {
      page_reloaded_counter+=1
      await page.reload();
    }
  }));
  console.log("Succesfully reloaded " + page_reloaded_counter + " pages")
}

(async () => {
  runHeadless = config.chrome_use_headless
  var launch_flags = config.chrome_launch_flags

  if(runHeadless){
    console.log("Running headless browser")
    launch_flags = ' -headless=new ' + launch_flags
  }

  else if (isRunningInDocker()) {
    console.log('Running inside a Docker container');
    runHeadless = true
    launch_flags = ' -headless=new ' + launch_flags
  }

  const inUse = await isPortInUse(9222);
  if (inUse) {
    console.error("Browser is already running");
  }

  const command = config.chrome_filepath + ' ' + launch_flags
  execute(command, (stdout) => {
    console.log(stdout);
  });
  // waiting for the browser to open
  await sleep(1000)

  const browser = await chromium.connectOverCDP('http://localhost:9222');
  if(browser.isConnected()){
    console.log("Browser connected at port 9222")
  }
  else{
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
  console.log("Navigation to default page succesful")
  await page.screenshot({ path: 'screenshot.png' })

  if(config.to_reload_pages){
    setInterval(async () => {
      await reloadPages(browser)
    }, config.page_reload_timeout)
  }

})();