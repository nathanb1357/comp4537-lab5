const http = require('http');
const mysql = require('mysql2');
const url = require('url');


const HOST = '0.0.0.0';
const DOMAINS = '*';
const PORT = 3001;
const USER = 'dbuser';
const PASS = 'SayCheese2!';
const DB_NAME = 'PatientDB';


class Database {
    constructor() {
        this.pool = mysql.createPool({
            connectionLimit: 10, // Maximum number of connections in the pool
            host: HOST,
            user: USER,
            password: PASS,
            database: DB_NAME
        });
    }

    initializeTable() {
        const createTableQuery = (
            `CREATE TABLE IF NOT EXISTS Patient (
                patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                dateOfBirth DATETIME
            ) ENGINE=InnoDB;`
        );
        this.query(createTableQuery, (err, result) => {
            if (err) throw err;
            console.log('Patient table ready.');
        });
    }

    query(sql, callback) {
        this.pool.getConnection((err, connection) => {
            if (err) {
                callback(err, null);
                return;
            }
            connection.query(sql, (queryErr, result) => {
                connection.release();
                if (queryErr) {
                    callback(queryErr, null);
                } else {
                    callback(null, result);
                }
            })
        });
    }
}


class Server {
    constructor(db) {
        this.db = db;
    }

    start() {
        http.createServer((req, res) => {
            const method = req.method;
            res.setHeader('Access-Control-Allow-Origin', DOMAINS);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

            if (method === 'POST') {
                this.handlePost(req, res);
            } else if (req.method === 'GET') {
                this.handleGet(req, res);
            } else if (req.method === 'OPTIONS') {
                this.sendResponse(res, 204, null);
            } else {
                this.sendResponse(res, 405, {message: 'Method not allowed'});
            }
        }).listen(PORT, HOST, () => {
            console.log(`Server listening on https://${HOST}:${PORT}`);
        });
    }

    handlePost(req, res) {
        this.db.initializeTable();
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const data = JSON.parse(body);
            const query = data.query;

            if (/INSERT/i.test(query)) {
                this.db.query(query, (err, result) => {
                    if (err) {
                        this.sendResponse(res, 400, {message: err.message});
                    } else {
                        this.sendResponse(res, 200, JSON.stringify({result}));
                    }
                });
            } else {
                this.sendResponse(res, 405, {message: 'Only INSERT queries allowed in POST requests.'});
            }
        });
    }

    handleGet(req, res) {
        this.db.initializeTable();
        const parsedUrl = url.parse(req.url, true);
        const query = parsedUrl.query.query;

        if (/SELECT/i.test(query)) {
            this.db.query(query, (err, result) => {
                if (err) {
                    this.sendResponse(res, 400, {message: err.message});
                } else {
                    this.sendResponse(res, 200, JSON.stringify({result}));
                }
            });
        } else {
            this.sendResponse(res, 405, {message: 'Only SELECT queries allowed in GET requests.'});
        }
    }

    sendResponse(res, statusCode, data) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
}

const db = new Database();
const server = new Server(db);
server.start();