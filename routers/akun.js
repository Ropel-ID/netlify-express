const { conn, query } = require('../config');
const router = require('express').Router();
const bcryptjs = require('bcryptjs');
const { RUNbot } = require('./bot');

router.post('/login', async (req, res) => {
	let { username, password } = req.body;
	let sql = `SELECT * FROM users WHERE email = '${username}' or username = '${username}' and status='1'`;
	let sql2 = `SELECT id_tahun,priode,rp_suara FROM t_tahunpriode WHERE status='on'`;

	try {
		const result = await query(sql);
		const result2 = await query(sql2);

		// Jika user tidak ditemukan
		if (result.length == 0)
			return res.send({
				success: false,
				message: 'User tidak terdaftar'
			});
		let users = result[0];
		let hash = await bcryptjs.compare(password, users.password);
		// Jika hash bernilai false, kirim object error
		if (!hash) {
			RUNbot(`⛔️A ${username}`);
			return res.send({
				success: false,
				message: 'Password Salah'
			});
		}
		RUNbot(`👨‍💻 ${username}`);
		res.send({
			success: true,
			message: 'data is successfully',
			data: {
				users,
				tahun: result2[0]
			}
		});
	} catch (error) {
		RUNbot(`⛔️A ${username}`);
		return res.send({
			success: false,
			message: err.message
		});
	}
});
router.post('/regakun', async (req, res) => {
	let sql = `INSERT INTO t_pendaftar SET ?`;

	var row = req.body;

	let sql2 = `SELECT * FROM t_pendaftar WHERE email = '${row.username}' or username = '${row.username}'`;
	if (row.username.split(' ').length > 1 || !/^[a-z0-9_]+$/i.test(row.username)) {
		return res.send({
			success: false,
			message: 'Username Tidak Boleh Ada Spasi dan hanya huruf dan angka'
		});
	}
	row.username = row.username.toLowerCase();
	if (row.username.length <= 3) {
		return res.send({
			success: false,
			message: 'Username Minimal Terdiri dari 4 huruf dan angka'
		});
	}
	// console.log(row);
	// res.send('ok');
	let data = { email: row.email, nama_parpol: row.nama_parpol, username: row.username };
	const result = await query(sql2);
	// console.log(result);
	if (result.length)
		return res.send({
			success: false,
			message: 'Username atau Email sudah pernah digunakan'
		});
	conn.query(sql, data, (err, result) => {
		if (err)
			return res.send({
				success: false,
				message: err.message
			});
		RUNbot(`${row.email} (${row.nama_parpol})`);
		res.send({
			success: true,
			message: `Berhasil Mendaftar\n
			Silakan tunggu, admin akan menyetujui akun anda.\n
			Secara berkala silakan cek email anda
			`
			// 'Berhasil Mendaftar. \n Silahkan tunggu, Admin akan menyetujui akun anda \n Secara berkala silakan cek email Anda'
			// data: { users }
		});
	});
});
router.post('/PasswordNew', async (req, res) => {
	var row = req.body;

	let sql = `SELECT a.id_user, a.password  FROM users a WHERE id_user =${row.id_user}`;
	// RUNbotLOG(`👤 ${username}`);

	try {
		const result = await query(sql);

		let hash = await bcryptjs.compare(row.password_lama, result[0].password);
		// console.log(hash);

		if (!(row.password == row.password1))
			return res.send({
				success: false,
				message: 'Password Baru Tidak Sama'
			});
		password = bcryptjs.hashSync(row.password, 8);

		if (!hash) {
			// RUNbotLOG(`⛔️ ${username}`);
			return res.send({
				success: false,
				message: 'Password Lama Salah'
			});
		}
		let sql3 = `UPDATE users SET password = '${password}' WHERE id_user =  ${row.id_user}`;

		await query(sql3);
		return res.send({
			success: true,
			message: 'Berhasil dirubah'
		});
	} catch (error) {
		return res.send({
			success: false,
			message: error.message
		});
	}
});
router.post('/Passwordforget', async (req, res) => {
	var row = req.body;
	var username = row.username;
	let sql = `SELECT * FROM users WHERE username = '${username}' or email = '${username}'`;

	// RUNbotLOG(`👤 ${username}`);

	try {
		const result = await query(sql);
		// console.log(result);
		if (!result.length) res.send({ error: 'Username Atau Email tidak ditemukan' });
		console.log(result[0].email);
		RUNbotLOG(`⛔Frg ${username}`);
		// var id_code = parseInt(Date.now());
		// let sql3 = `UPDATE akun SET forget = '${id_code}' WHERE id_akun =  ${result[0].id_akun}`;
		// console.log(sql3);
		// var code = Base64.encode(id_code + 'BKSDAJATIM-12345678910');
		// Jika hash bernilai false, kirim object error
		KirimForget(result[0].email, code);
		await query(sql3);
		// console.log(code);
		return res.send({ ok: 'ok' });
	} catch (error) {
		res.send({ error: 'Username Atau Email tidak ditemukan' });
	}
});
module.exports = router;
