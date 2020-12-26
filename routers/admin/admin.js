// SELECT * FROM `t_partai`
const { conn, query } = require('../../config');
const { sendVerification } = require('../../email');
const router = require('express').Router();
const bcryptjs = require('bcryptjs');

router.post('/admin/HomeAdmin', async (req, res) => {
	// let { id_partai } = req.body;
	// let sqlU = `SELECT * FROM t_tahunpriode WHERE status ='on'`;
	let sql = `SELECT COUNT(*) as laporan FROM t_laporan`;
	let sql2 = `SELECT COUNT(*) as partai FROM t_partai`;
	let sql3 = `SELECT SUM(perolehan_suara_sah) as suara,SUM(jumlah_bantuan) as jumlah_bantuan  FROM t_bantuan`;
	try {
		// const sqlUu = await query(sqlU);
		// console.log(sqlUu[0].id_tahun);
		const laporan = await query(sql);
		const partai = await query(sql2);
		const bantuan = await query(sql3);
		if (!bantuan[0].jumlah_bantuan) bantuan[0].jumlah_bantuan = 0;
		if (!bantuan[0].suara) bantuan[0].suara = 0;
		var data = {
			partai: partai[0].partai,
			suara: bantuan[0].suara,
			jumlah_bantuan: bantuan[0].jumlah_bantuan,

			laporan: laporan[0].laporan
		};
		return res.send({
			success: true,
			message: 'success',
			data: data
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});
router.post('/admin/Users', async (req, res) => {
	// let { id_partai } = req.body;
	// let sqlU = `SELECT * FROM t_tahunpriode WHERE status ='on'`;
	let sql = `SELECT email,last_login,status,ket,created_at,id_partai as nama_partai FROM users a WHERE level = 'user'`;
	// let sql2 = `SELECT COUNT(*) as partai FROM t_partai`;

	let sql3 = `SELECT id_partai,nama_partai FROM t_partai`;
	// let sql3 = `SELECT SUM(perolehan_suara_sah) as suara,SUM(jumlah_bantuan) as jumlah_bantuan  FROM t_bantuan`;
	try {
		// const sqlUu = await query(sqlU);
		// console.log(sqlUu[0].id_tahun);
		const result = await query(sql);
		// console.log(result);
		// const partai = await query(sql2);
		const bantuan = await query(sql3);
		// console.log(bantuan);

		// console.log(dat);
		var rs = result.map((res1) => {
			var dat = bantuan.filter((res) => {
				return res.id_partai == res1.nama_partai;
			});
			// console.log(dat[0]);
			if (dat.length) res1.nama_partai = dat[0].nama_partai;
			return res1;
			// console.log(res1);
			// return res1;
		});
		console.log(rs);

		var data = result;
		return res.send({
			success: true,
			message: 'success',
			data: data
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});

router.post('/admin/DataInfoParpol', async (req, res) => {
	// var sql2 = `SELECT jumlah_kursi,perolehan_suara_sah FROM t_bantuan`;
	var sql = `SELECT id_partai FROM t_partai GROUP BY id_partai`;
	try {
		const result = await query(sql);
		let info = result;
		return res.send({
			success: true,
			message: 'success',
			data: {
				info
			}
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});
router.post('/Admin/regakun', (req, res) => {
	let sql = `INSERT INTO users SET ?`;
	let sql3 = `UPDATE t_pendaftar SET ? WHERE id =  ?`;

	var row = req.body;
	try {
		function generatePassword() {
			var length = 8,
				charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
				retVal = '';
			for (var i = 0, n = charset.length; i < length; ++i) {
				retVal += charset.charAt(Math.floor(Math.random() * n));
			}
			return retVal;
		}
		function Datenow() {
			return parseInt(Date.now());
		}
		console.log('run');
		var dataa = {
			email: row.email,
			username: row.username,
			password: generatePassword(),
			// ket: row.ket,
			id_partai: Datenow()
		};
		// console.log(dataa);

		sendVerification(dataa);
		// console.log(generatePassword());

		// res.send('ok');
		var edit = [ { status: 2 }, row.id ];
		conn.query(sql3, edit, (err, result) => {
			// console.log(edit);
			// console.log(result);
			if (err)
				return res.send({
					success: false,
					message: err.message
				});
		});
		dataa.password = bcryptjs.hashSync(dataa.password, 8);
		// console.log(dataa);

		conn.query(sql, dataa, (err, result) => {
			// if (err) return res.send({ error: 'Email atau username sudah terpakai' });
			// let sql2 = `SELECT * FROM m_admin where id_admin='${result.insertId}'`;
			// conn.query(sql2, (err, result) => {
			// 	if (err) return res.send({ error: err.message });
			// 	res.send(result);
			// });
		});
		return res.send({
			success: true,
			message: 'success'
			// data: 'datae'
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});
router.post('/admin/pendaftar', async (req, res) => {
	let sql = `SELECT * FROM t_pendaftar`;

	try {
		const result = await query(sql);

		var data = result;
		return res.send({
			success: true,
			message: 'success',
			data: data
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});

module.exports = router;
