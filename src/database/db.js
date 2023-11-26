const Database = require('better-sqlite3');
const fs = require('fs')
const filepath = "../database/browser.db"

function createTablePages(db){
    db.exec(`CREATE TABLE pages(
        pageId TEXT NOT NULL,
        port INTEGER NOT NULL,
        toReload BOOLEAN NOT NULL
    )`)
    return db
}

function createDbConnection() {
    if (fs.existsSync(filepath)){
        return new Database(filepath);
    }
    else{
        db = new Database(filepath)
        db = createTablePages(db)
        console.log("Connection with SQLite has been established");
        return db;
    }
}

module.exports = createDbConnection()
