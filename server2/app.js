import http from 'http';
import mysql from 'mysql';


const HOST = 'localhost';
const DOMAINS = '*';
const PORT = 3001;
const USER = 'root';
const PASS = 'hi';
const DB_NAME = 'PatientDB';


class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host: HOST,
            user: USER,
            password: PASS,
            database: DB_NAME
        });
    }

    connect() {
        this.connection.connect(err => {
            if (err) throw err;
            console.log('Connected to MySQL database.');
            this.initializeTable();
        });
    }

    initializeTable() {
        const createTableQuery = (
            `CREATE TABLE IF NOT EXISTS patient (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                age INT,
                gender VARCHAR(10),
                condition VARCHAR(255)
            ) ENGINE=InnoDB;`
        );
        this.connection.query(createTableQuery, (err, result) => {
            if (err) throw err;
            console.log('Patient table ready.');
        });
    }

    query(sql, callback) {
        this.connection.query(sql, callback);
    }
}


class Server {
    constructor(host, port, db) {
        this.host = host;
        this.port = port;
        this.db = db;
    }

    start() {
        http.createServer((req, res) => {
            const method = req.method;
            res.setHeader('Access-Control-Allow-Origin', DOMAINS);
            res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

            if (method === 'POST') {
                this.handlePost(req, res);
            } else if (req.method === 'GET') {
                this.handleGet(req, res);
            } else {
                this.sendResponse(res, 405, {message: 'Method not allowed'});
            }
        }).listen(this.port, this.host, () => {
            console.log(`Server listening on https://${this.host}:${this.port}`);
        });
    }

    handlePost(req, res) {

    }

    handleGet(req, res) {
        
    }

    sendResponse(res, statusCode, data) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }
}