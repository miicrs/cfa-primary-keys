require('dotenv').config({ path: './.env' });

const sqlitePath = process.env.DB_PATH;

//requiring the sqlite3 module
const sqlite3 = require('sqlite3');

const getConnection = () => {
    return new sqlite3.Database(sqlitePath);
}

export function connectSqlite () {
    try {
        return await getConnection();
        console.log("Connected to the database.");
    } catch (e) {
        console.error(e);
    }
}