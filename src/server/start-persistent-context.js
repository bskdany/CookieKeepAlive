const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const {sleep, isRunningInDocker, getPageId} = require('../helpers/helpers.js')
var config = require('../config.js');
const net = require('net');
const fs = require('fs');
const { url } = require('inspector');

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
	if(config.chrome_use_headless || isRunningInDocker()){
		// console.log("Running headless context")
		runHeadless = true;
	}
	else{
		// console.log("Running headed context")
	}


	let urlPort = 10000
	while(true){
		if(await isPortInUse(urlPort)){
			urlPort+=1;
		}
		else{
			break;
		}
	}

	let launch_flags = config.chrome_launch_flags;
	launch_flags.push(`--remote-debugging-port=${urlPort}`)
	// console.log(launch_flags)

	let userDataDir = "../data/chrome-context-data/" + pageId; 

	await chromium.launchPersistentContext( userDataDir=userDataDir, {
		executablePath: '/usr/bin/google-chrome-stable',
		headless: runHeadless,
		handleSIGINT: false,
		handleSIGTERM: false,
		handleSIGHUP: false,
		args:config.chrome_launch_flags,
	})

	saveContextToMap(urlPort, pageId)

	// idk why I have to do this
	launch_flags.pop();
	launch_flags.pop();

	return {urlPort: urlPort};
}

// async function runPersistentContext(pageId){
// 	setInterval(async (pageId) => {
// 		if(!await isPortInUse(9222)){
// 			await runBrowser();
// 		}
// 	}, 1000, pageId);
// }

async function removeUnusedPortsFromContextMap(){
	const portMap = JSON.parse(fs.readFileSync('./port-map.json'))
	let newPortMap = {};
	for(context in portMap){
		if(await isPortInUse(port)){
			portMap.push(port);
		}
	}
	if(newPortMap!=portMap){
		fs.writeFileSync('./port-map.json', JSON.stringify(newPortMap, null, 2))
	}
}


function saveContextToMap(port, pageId){
	var pageIdPortMap = JSON.parse(fs.readFileSync('./port-map.json'))
	pageIdPortMap[pageId] = port;
	fs.writeFileSync('./port-map.json', JSON.stringify(pageIdPortMap, null, 2))
}

async function getContext(pageId){
	const pageIdPortMap = JSON.parse(fs.readFileSync('./port-map.json'))
	if(pageId in pageIdPortMap && await isPortInUse(pageIdPortMap[pageId])){
		return {urlPort: pageIdPortMap[pageId]};
	}

	return await startContext(pageId);
}


module.exports = {
	getContext
}