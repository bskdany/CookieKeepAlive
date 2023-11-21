const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const {sleep, isRunningInDocker, getPageId, isPortInUse} = require('../helpers/helpers.js')
var config = require('../config.js');
const fs = require('fs');

async function startContext(pageId){
	let runHeadless = false
	if(config.chrome_use_headless || isRunningInDocker()){
		console.log(`Running new headless context for id ${pageId}`)
		runHeadless = true;
	}
	else{
		console.log(`Running new headed context for id ${pageId}`)
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

	saveContextToMap(pageId, urlPort)

	// idk why I have to do this
	launch_flags.pop();
	launch_flags.pop();

	return {urlPort: urlPort};
}

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

function removeContextEntries(pageId, port){
	var pageIdPortMap = JSON.parse(fs.readFileSync('./port-map.json'))
	for(id in pageIdPortMap){
		if(pageIdPortMap[id]==port){
			delete pageIdPortMap[id]
		}
	}
	fs.writeFileSync('./port-map.json', JSON.stringify(pageIdPortMap, null, 2))
}

function saveContextToMap(pageId, port){
	removeContextEntries(pageId, port);
	var pageIdPortMap = JSON.parse(fs.readFileSync('./port-map.json'));
	pageIdPortMap[pageId] = port;
	fs.writeFileSync('./port-map.json', JSON.stringify(pageIdPortMap, null, 2));
}

async function getContext(pageId){
	const pageIdPortMap = JSON.parse(fs.readFileSync('./port-map.json'))
	if(pageId in pageIdPortMap && await isPortInUse(pageIdPortMap[pageId])){
		const urlPort = pageIdPortMap[pageId]
		console.log(`Found existing context for id ${pageId} running at port ${urlPort}`)
		return {urlPort: urlPort};
	}

	return await startContext(pageId);
}


module.exports = {
	getContext
}