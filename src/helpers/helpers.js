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
    await page.evaluate((value) => {
        return localStorage.setItem('pageId', value);
    }, value);
}

async function getPageId(page){
    const pageId = await page.evaluate(() => {
        return localStorage.getItem('pageId');
    });
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

module.exports = {
    sleep,
    setPageToBeReloaded,
    getPageToBeReloaded,
    setPageId,
    getPageId,
    isRunningInDocker
}