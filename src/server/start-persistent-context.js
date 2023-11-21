const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const {sleep, isRunningInDocker} = require('../helpers/helpers.js')
var config = require('../config.js');
const net = require('net');
const fs = require('fs')

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

async function startContext(pageId){
	let runHeadless = false
	let launch_flags = config.chrome_launch_flags
	if(config.chrome_use_headless || isRunningInDocker()){
		console.log("Running headless context")
		runHeadless = true;
	}
	else{
		console.log("Running headed context")
	}

	urlPort = 50000
	while(await isPortInUse(urlPort)==false){
		urlPort+=1;
	}

	launch_flags.push(`--remote-debugging-port=${urlPort}`)
	console.log(launch_flags)

	let userDataDir = "../data/chrome-context-data/" + pageId; 
	const context = await chromium.launchPersistentContext( userDataDir=userDataDir, {
		executablePath: '/usr/bin/google-chrome-stable',
		headless: runHeadless,
		handleSIGINT: false,
		handleSIGTERM: false,
		handleSIGHUP: false,
		args:launch_flags,
	})

	const page = await context.pages()[0];
    await page.goto('https://bot.sannysoft.com');

	portMap = JSON.parse(fs.readFileSync('./port-map.json'))
	portMap[urlPort] = pageId;
	fs.writeFileSync('./port-map.json', JSON.stringify(portMap))

	return {urlPort: urlPort};
}

// async function runPersistentContext(pageId){
// 	setInterval(async (pageId) => {
// 		if(!await isPortInUse(9222)){
// 			await runBrowser();
// 		}
// 	}, 1000, pageId);
// }

async function getContext(pageId){
	const portMap = JSON.parse(fs.readFileSync('./port-map.json'))
	for( port in portMap){
		if(portMap[port] == pageId & await isPortInUse(port)){
			return port
		}
	}
	return await startContext(pageId);
}


module.exports = {
	getContext
}