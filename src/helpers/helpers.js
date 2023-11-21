const { exec } = require('child_process');
const net = require('net');

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setPageToBeReloaded(page, value){
    await page.evaluate((value) => {
        return localStorage.setItem('toBeReloaded', value);
    }, value);
}

async function getPageToBeReloaded(page){
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
    try {
      const cgroupContent = fs.readFileSync('/proc/1/cgroup', 'utf8');
      return cgroupContent.includes('docker');
    } catch (error) {
      return false; // Error reading the cgroup file
    }
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