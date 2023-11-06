async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function setPageToBeReloaded(page, value){
    await page.evaluate((value) => {
        return sessionStorage.setItem('toBeReloaded', value);
    }, value);
}

async function getPageToBeReloaded(page){
    const isToBeReloaded = await page.evaluate(() => {
        return sessionStorage.getItem('toBeReloaded');
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
        return sessionStorage.setItem('pageId', value);
    }, value);
}

async function getPageId(page){
    const pageId = await page.evaluate(() => {
        return sessionStorage.getItem('pageId');
    });
    if(typeof pageId == "string"){
        return pageId
    }
    else{
        return "false"
    }
}


module.exports = {
    sleep,
    setPageToBeReloaded,
    getPageToBeReloaded,
    setPageId,
    getPageId
}