'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
const { query } = require('../config');
const cors = require('cors');
const router = express.Router();
app.use(cors());
app.enable('trust proxy');
function customHeaders(req, res, next) {
	app.disable('x-powered-by');
	res.setHeader('X-Powered-By', 'ROPEL ID');
	next();
}

router.get('/Provinsi', async (req, res) => {
	var sql = `SELECT id, name as prov FROM m_prov`;
	try {
		const result = await query(sql);

		return res.send({
			success: true,
			message: 'User Tidak terdafatar',
			data: result
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});
router.get('/', (req, res) => {
	res.send(`<h1>Running at 3003</h1>`);
});
router.get('/dok', (req, res) => {
	res.send({ ok: 'ok' });
});
router.get('*', function(req, res) {
	res.status(404).send('<h1>404</h1>');
});

app.use('/.netlify/functions/server', router); // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.use(customHeaders);
app.use(express.json());

module.exports = app;
module.exports.handler = serverless(app);
