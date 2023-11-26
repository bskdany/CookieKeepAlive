const db = require('./db.js')

function createEntry(pageId, port, toReload){
    if(toReload==true){
        toReload=1
    }
    else if(toReload==false){
        toReload=0
    }

    const deleteDuplicates = db.prepare("DELETE FROM pages WHERE pageId = (?) OR port=(?);");
    const insertRow = db.prepare("INSERT INTO pages VALUES (?,?,?);");
    deleteDuplicates.run(pageId, port)
    insertRow.run(pageId, port, toReload)
}

function printAll(){
    const result = db.prepare("SELECT * FROM pages;")
    console.log(result.all())
}

function getAllReloadablePorts(){
    const result = db.prepare("SELECT port FROM pages WHERE toReload = ?").pluck(true)
    return result.all(1)
}

function makeReloadable(pageId){
    const makeReloadable = db.prepare("UPDATE pages SET toReload = 1 WHERE pageId = ?")
    makeReloadable.run(pageId)
}

function makeNotReloadable(pageId){
    const makeNotReloadable = db.prepare("UPDATE pages SET toReload = 0 WHERE pageId = ?")
    makeNotReloadable.run(pageId)
}

function isPageIdExisting(pageId){
    const isPageIdExisting = db.prepare("SELECT pageId FROM pages WHERE pageId = ?")
    const result = isPageIdExisting.all(pageId)
    if(result.length>0){
        return true
    }
    return false
}

function getPortfromPageId(pageId){
    const getPortfromPageId = db.prepare("SELECT port FROM pages WHERE pageId = ?").pluck(true)
    return getPortfromPageId.get(pageId)
}

module.exports = {
    getAllReloadablePorts,
    createEntry,
    makeReloadable,
    makeNotReloadable,
    isPageIdExisting,
    printAll,
    getPortfromPageId,
}