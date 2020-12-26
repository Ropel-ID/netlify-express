'use strict';
const express = require('express');
const path = require('path');
const serverless = require('serverless-http');
const app = express();
// const bodyParser = require('body-parser');
const cors = require('cors');
const akun = require('../routers/akun');
const Profile = require('../routers/Profile');
const alamat = require('../routers/alamat');
const Laporan = require('../routers/Laporan');
const Admin = require('../routers/admin/admin');
const router = express.Router();
app.use(cors());

app.enable('trust proxy');
function customHeaders(req, res, next) {
	app.disable('x-powered-by');
	res.setHeader('X-Powered-By', 'ROPEL ID');
	next();
}
// app.use(alamat);
// app.use(akun);
// app.use(Profile);
// app.use(Laporan);
// app.use(Admin);
// app.use('/uploads', express.static('uploads'));
router.get('/', (req, res) => {
	res.send(`<h1>Running at ${'999'}</h1>`);
});
router.get('/dok', (req, res) => {
	res.send({ ok: 'ok' });
});
router.get('*', function(req, res) {
	res.status(404).send('<h1>404</h1>');
});

app.use(router); // path must route to lambda
app.use('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.use(customHeaders);
app.use(express.json());

module.exports = app;
module.exports.handler = serverless(app);
