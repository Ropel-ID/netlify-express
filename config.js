const mysql = require('mysql');

// const conn = mysql.createConnection({
// 	user: 'root',
// 	password: '',
// 	host: 'localhost',
// 	database: 'psht',
// 	port: 3306
// });
const conn = mysql.createPool({
	connectionLimit: 100,
	waitForConnections: true,
	queueLimit: 0,
	// user: 'root',
	user: 'k3sb4ngp_parpol',
	// password: '',
	password: '8LXeRw2Rp2WpypW',
	// host: 'localhost',
	host: '103.132.230.21',

	// database: 'parpol',
	database: 'k3sb4ngp_parpol',

	port: 3306,
	// debug: true,
	wait_timeout: 28800,
	connect_timeout: 10
});

conn.getConnection((err, connection) => {
	if (err) {
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			console.error('Database connection was closed.');
		}
		if (err.code === 'ER_CON_COUNT_ERROR') {
			console.error('Database has too many connections.');
		}
		if (err.code === 'ECONNREFUSED') {
			console.error('Database connection was refused.');
		}
	}

	if (connection) connection.release();

	return;
});
// const conn = require('../connection/index');
const util = require('util');

const query = util.promisify(conn.query).bind(conn);
var token = '1495414090:AAFE4DYbKQausWTUZiiJD_nOIazqbf6cv3I';
// const baseURL = 'http://192.168.1.8:3003';
var baseURL = 'http://localhost:3003'; /////
var home = 'http://localhost:3000';
module.exports = { query, conn, token, baseURL, home };
