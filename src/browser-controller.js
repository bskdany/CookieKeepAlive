const spawn = require('child_process').exec;
const net = require('net');
const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')()
const {sleep, getPageToBeReloaded, isRunningInDocker, setPageToBeReloaded} = require('./helpers.js')
chromium.use(stealth)
var config = require('./config.js');
var runHeadless = config.chrome_use_headless
var launch_flags = config.chrome_launch_flags


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
	const chromeProcess = spawn(command, { detached: true, stdio: ['ignore','ignore','ignore']});
	chromeProcess.unref();
}

async function reloadPages(browser){
  var context = browser.contexts()[0]
  var pages = context.pages()
  var page_reloaded_counter = 0
  try{
    await Promise.all(pages.map(async (page) => {
      if (await getPageToBeReloaded(page)) {
        page_reloaded_counter+=1
        await page.reload();
      }
    }));
  }
  catch{
    console.log("Execution context destroyed, pages were not reloaded")
    // await reloadPages(browser)
  }
  
  console.log("Succesfully reloaded " + page_reloaded_counter + " pages")
}

async function connectToBrowser(){
	const browser = await chromium.connectOverCDP('http://localhost:9222');
	if(browser.isConnected()){
		console.log("Browser connected at port 9222")
		return browser
	}
	else{
		console.error("Couldn't not find browser at port 9222, is it running?")
		return null
	}
}

async function getBrowser(){
	
	if(runHeadless || isRunningInDocker()){
		console.log("Running headless browser")
		runHeadless = true;
		launch_flags = ' -headless=new ' + launch_flags
	}
	else{
		console.log("Running headed browser")
	}

	const command = config.chrome_filepath + ' ' + launch_flags;
	console.log("Opening browser")
	execute(command, (stdout) => {
		console.log(stdout);
	});
	// waiting for the browser to open
	await sleep(1000)

	const browser = connectToBrowser()
	return browser
}

async function getDefaultPage(browser){
	const context = await browser.contexts()[0]
	if(context){
		const page = await context.pages()[0]
		if(page){
			return page
		}
	}
	var page = await browser.newPage()
	await setPageToBeReloaded(page, true)
	return page
}

async function persistentBrowser(){
	if(!await isPortInUse(9222)){
		const browser = await getBrowser()
		const page = await getDefaultPage(browser)
		await page.goto('https://bot.sannysoft.com');
		console.log("Navigation to default page succesful")
	}
}

(async () => {
	// if(config.to_reload_pages){
	// 	setInterval(async () => {
	// 	await reloadPages(browser)
	// 	}, config.page_reload_timeout)
	// }
	
	setInterval(async () => {
		await persistentBrowser()
	}, 1000);
	// process.exit(0);
})();


