const mysql = require('mysql');

const dbName = 'habba19';

const config = {
    "development": {
        "port": 1337,
        "database": {
            host: "localhost",
            user: "root",
            password: "password",
            db: dbName
        }
    },
    "production": {
        "port": 3000,
        "database": {
            host: process.env.DB_HOST,
            user: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            db: dbName
        }
    }
}

config.createConnection = env => {
    config.conn = mysql.createConnection(config[env].database);
    config.conn.query('use habba19');
}

module.exports = config;