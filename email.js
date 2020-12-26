const nodemailer = require('nodemailer');

const { pageverif } = require('./page');

let transporter = nodemailer.createTransport({
	pool: true,
	host: 'superion.hosterserver.com',
	port: 465,
	secure: true, // use TLS
	auth: {
		user: 'arfarells@rimbawandigital.com',
		pass: 'Akuadmin85@'
	}
});

let sendVerification = (data) => {
	// data = {username, email, name, password}

	let mail = {
		from: 'Kesbangpol Kab. Madiun <arfarells@rimbawandigital.com>',
		to: data.email,
		subject: 'Selamat Datang',
		// html: `
		// <h1>${data.email}</h1>
		// <h1>${data.password}</h1>
		// `
		html: pageverif(data)
	};

	transporter.sendMail(mail, (err, result) => {
		if (err) return console.log(err);

		console.log('Email berhasil di kirim');
	});
};
module.exports = { sendVerification };
