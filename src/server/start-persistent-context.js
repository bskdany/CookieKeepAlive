const {chromium} = require('playwright-extra')
const stealth = require('puppeteer-extra-plugin-stealth')();
chromium.use(stealth);
const {sleep, isRunningInDocker, isPortInUse} = require('../helpers/helpers.js')
const {isPageIdExisting, getPortfromPageId, createEntry, makeNotReloadable} = require('../database/db-controller.js')
var config = require('../config.js');
const fs = require('fs');

async function startContext(pageId){
	let runHeadless = config.runHeadless;
	if(runHeadless || isRunningInDocker()){
		console.log(`Running new headless context for id ${pageId}`)
		runHeadless = true;
	}
	else{
		console.log(`Running new headed context for id ${pageId}`)
	}

	let port = 10000
	while(true){
		if(await isPortInUse(port)){
			port+=1;
		}
		else{
			break;
		}
		if(port>15000){
			console.log("Something went wrong when tryin to get free port for the browser")
		}
	}

	let launch_flags = config.chrome_launch_flags;
	launch_flags.push(`--remote-debugging-port=${port}`)
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

	createEntry(pageId, port, false)

	// idk why I have to do this
	launch_flags.pop();
	launch_flags.pop();

	return {port: port};
}

async function getContext(pageId){
	if(isPageIdExisting(pageId) && await isPortInUse(getPortfromPageId(pageId))){
		const port = getPortfromPageId(pageId)
		console.log(`Found existing context for id ${pageId} running at port ${port}`)
		makeNotReloadable(pageId)
		return {port: port};
	}
	else{
		return await startContext(pageId);
	}
}

module.exports = {
	getContext
}