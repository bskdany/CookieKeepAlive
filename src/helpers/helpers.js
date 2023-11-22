const { exec } = require('child_process');
const net = require('net');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setPageToBeReloaded(page, value){
    if(page==undefined){
        throw Error("Page is undefined")
    }
    if(await page.url()!="about:blank"){
        await page.evaluate((value) => {
            return localStorage.setItem('toBeReloaded', value);
        }, value);
    }
    else{
        throw Error("Trying to access localStorage of default Page")
    }
}

async function getPageToBeReloaded(page){
    if(page==undefined){
        throw Error("Page is undefined")
    }
    if(await page.url()=="about:blank"){
        return false
    }
    const isToBeReloaded = await page.evaluate(() => {
        return localStorage.getItem('toBeReloaded');
    });
    if(isToBeReloaded==="true"){
        return true
    }
    else{
        return false
    }
}

async function setPageId(page, value){
    try{
        await page.evaluate((value) => {
            return localStorage.setItem('pageId', value);
        }, value);
    }
    catch(e){
        console.log(e)
    }
}

async function getPageId(page){
    try{
        const pageId = await page.evaluate(() => {
            return localStorage.getItem('pageId');
        });
    }
    catch(e){
        console.log(e)
    }
    
    if(typeof pageId == "string"){
        return pageId
    }
    else{
        return "false"
    }
}

function isRunningInDocker() {
    return process.env.DOCKER_CONTAINER === 'true';
}

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

module.exports = {
    sleep,
    setPageToBeReloaded,
    getPageToBeReloaded,
    setPageId,
    getPageId,
    isRunningInDocker,
    isPortInUse,
}