const express = require('express');
const app = express();
const cors = require('cors');
// const Public = require('./routers/Public');
// const Warga = require('./routers/Warga');
// const setting = require('./routers/setting');
const akun = require('./routers/akun');
const Profile = require('./routers/Profile');
const alamat = require('./routers/alamat');
const Laporan = require('./routers/Laporan');
const Admin = require('./routers/admin/admin');

const port = process.env.PORT || 3003;
app.use(cors());

app.enable('trust proxy');
function customHeaders(req, res, next) {
	app.disable('x-powered-by');
	res.setHeader('X-Powered-By', 'ROPEL ID');
	next();
}

app.use(customHeaders);
app.use(express.json());
app.use((req, res, next) => {
	return next();
	// check header or url parameters or post parameters for token
	var token = req.headers['access-token'];
	// res.send('error');
	// // decode token
	if (token) {
		// console.log(token);
		// verifies secret and checks exp

		var err = true;
		if ('12122gg@111111111' == token) err = false;

		if (err) {
			return res.send({ success: false, message: 'Failed to authenticate token.' });
		} else {
			// if everything is good, save to request for use in other routes
			// req.decoded = decoded;
			next();
		}
	} else {
		return res.status(403).send({
			success: false,
			message: 'No token provided.'
		});
	}
});
app.use(alamat);
app.use(akun);
app.use(Profile);
app.use(Laporan);
app.use(Admin);
app.use('/uploads', express.static('uploads'));
app.get('/', (req, res) => {
	res.send(`<h1>Running at ${port}</h1>`);
});

app.listen(port, () => {
	console.log(`Running at ${port}`);
});
//The 404 Route (ALWAYS Keep this as the last route)
app.get('*', function(req, res) {
	res.status(404).send('<h1>404</h1>');
});
