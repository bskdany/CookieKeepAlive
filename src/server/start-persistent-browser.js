const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const {sleep, isRunningInDocker} = require('../helpers/helpers.js')
var config = require('../config.js');
const net = require('net');
var runHeadless = config.chrome_use_headless
var launch_flags = config.chrome_launch_flags

async function isPortInUse(port) {
	return new Promise((resolve, reject) => {
		const server = net.createServer();

		server.once('error', (err) => {
			if (err.code === 'EADDRINUSE') {
				resolve(true);
			} else {
				reject(err); // Handle unexpected errors
			}
		});

		server.once('listening', () => {
			server.close();
			resolve(false);
		});

		server.listen(port, '0.0.0.0');
		server.unref(); 
	});
}

async function runBrowser(){
	if(runHeadless || isRunningInDocker()){
		console.log("Running headless browser")
		runHeadless = true;
	}
	else{
		console.log("Running headed browser")
	}

	const context = await chromium.launchPersistentContext( userDataDir="../data/chrome-context-data", {
		executablePath: '/usr/bin/google-chrome-stable',
		headless: runHeadless,
		handleSIGINT: false,
		args:launch_flags,
	})

    const page = context.pages()[0];
    await page.goto('https://bot.sannysoft.com')
}

async function runPersistentBrowser(){
	if(!await isPortInUse(9222)){
		await runBrowser();
	}
}

(async () => {
	setInterval(async () => {
		await runPersistentBrowser()
	}, 1000);
})();