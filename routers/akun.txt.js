const { query, conn } = require('../config');
const router = require('express').Router();
var multer = require('multer');
const path = require('path');
var fs = require('fs');
// const Base64 = require('js-base64').Base64;
const bcryptjs = require('bcryptjs');
// const { RUNbot } = require('./bot');
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/foto');
	},
	filename: function(req, file, cb) {
		// console.log(req.body);
		var type = path.extname(file.originalname);
		cb(null, Date.now() + '' + type);
		// 'Foto_diri' + '-' +file.originalname.replace(type, '').toLowerCase()
	}
});
var upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == 'image/*' ||
			file.mimetype == 'image/png' ||
			file.mimetype == 'image/jpg' ||
			file.mimetype == 'image/jpeg' ||
			file.mimetype == 'application/pdf'
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg .jpeg and .pdf format allowed!'));
		}
	}
});

router.post('/login', (req, res) => {
	let { username, password } = req.body;

	let sql = `SELECT * FROM users WHERE email = '${username}' or username = '${username}'`;

	conn.query(sql, async (err, result) => {
		if (err)
			return res.send({
				success: false,
				message: err.message
			});

		// Jika user tidak ditemukan
		if (result.length == 0)
			return res.send({
				success: false,
				message: 'User Tidak terdafatar'
			});

		// res.send({ error: '' });

		// User dipindahkan ke variabel, agar mudah dalam penggunaan
		let users = result[0];
		// Bandingkan password inputan dg yang ada di database, return true or false
		let hash = await bcryptjs.compare(password, users.password);
		// Jika hash bernilai false, kirim object error
		if (!hash) {
			return res.send({
				success: false,
				message: 'Password Salah'
			});
		}

		res.send({
			success: true,
			message: 'data is successfully',
			data: { users }
		});
	});
});

router.post('/Admin/regakun', (req, res) => {
	let sql = `INSERT INTO m_admin SET ?`;
	var row = req.body;
	let data = row;
	console.log(row);
	// res.send('ok');

	data.password = bcryptjs.hashSync(data.password, 8);
	conn.query(sql, data, (err, result) => {
		// if (err) return res.send({ error: 'Email atau username sudah terpakai' });
		let sql2 = `SELECT * FROM m_admin where id_admin='${result.insertId}'`;
		conn.query(sql2, (err, result) => {
			if (err) return res.send({ error: err.message });
			res.send(result);
		});
	});
});

router.post('/InfoParpol', async (req, res) => {
	let { id_partai } = req.body;

	let sql = `SELECT 
id,
a.id_partai,
id_tahun,
nama_partai, 
prov, 
kab, 
kec, 
des, 
alamat,

lambang_partai, 
misi, 
visi, 
a.created_at,
last_login, 
phone,
web,
a.email, 
a.update_at, 
username, 
id_user
	
	FROM t_partai a JOIN users b on a.id_partai=b.id_partai WHERE b.id_partai = '${id_partai}' ORDER BY a.created_at DESC LIMIT 1`;
	try {
		const result = await query(sql);

		if (result.length == 0)
			return res.send({
				success: false,
				message: 'Data Tidak ditemukan'
			});

		let users = result;
		return res.send({
			success: true,
			message: 'success',
			data: users
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
	// res.send(users);
});

router.post('/editInfoParpol', (req, res) => {
	let { id_partai, id_tahun, id_user } = req.body;
	var { nama_partai, lambang_partai, visi, misi, prov, kab, kec, des, alamat, web, phone, email } = req.body.data;
	// var dataInput = {
	// 	nama_partai,
	// 	lambang_partai,
	// 	visi,
	// 	misi,
	// 	prov,
	// 	kab,
	// 	kec,
	// 	desa,
	// 	alamat,
	// 	ket,
	// 	id_partai: req.body.id_partai,
	// 	id_tahun: req.body.id_tahun,
	// 	web,
	// 	by: req.body.id_user,
	// 	phone,
	// 	email
	// };
	console.log(des);

	// return res.send('ok');
	let sql = `INSERT INTO t_partai SET ?`;
	var data = {
		nama_partai,
		lambang_partai,
		visi,
		misi,
		prov,
		kab,
		kec,
		des,

		alamat,
		id_partai,
		id_tahun,
		web,
		phone,
		email,
		by: id_user
	};
	console.log(data);
	conn.query(sql, data, (err, result) => {
		res.send('ok');
	});
});

// SELECT * FROM `t_partai`

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

router.get('/kabupaten/:idkab', async (req, res) => {
	// SELECT * FROM `m_kab` WHERE prov_id
	var sql = `SELECT id, name as kab FROM m_kab where prov_id = '${req.params.idkab}'`;
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
router.get('/kecamatan/:idkab', async (req, res) => {
	var sql = `SELECT id, name as  kec FROM m_kec where kab_id =${req.params.idkab}`;
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
router.get('/Desa/:idkab', async (req, res) => {
	var sql = `SELECT id, name as des FROM m_des where kec_id =${req.params.idkab}`;
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

var storage2 = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/tmp');
	},
	filename: function(req, file, cb) {
		// console.log(req.body);
		var type = path.extname(file.originalname);
		cb(null, Date.now() + '' + type);
		// 'Foto_diri' + '-' +file.originalname.replace(type, '').toLowerCase()
	}
});
var upload2 = multer({
	storage: storage2,
	fileFilter: (req, file, cb) => {
		if (
			file.mimetype == 'image/*' ||
			file.mimetype == 'image/png' ||
			file.mimetype == 'image/jpg' ||
			file.mimetype == 'image/jpeg' ||
			file.mimetype == 'application/pdf'
		) {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('Only .png, .jpg .jpeg and .pdf format allowed!'));
		}
	}
});
router.post(
	'/file',
	upload2.single('file'),
	upload.single('file'),
	async (req, res) => {
		try {
			// console.log(req.body);
			var alert = ' Belum disi';
			var d = new Date();
			var months = [
				'Januari',
				'Februari',
				'Maret',
				'April',
				'Mei',
				'Juni',
				'Juli',
				'Agustus',
				'September',
				'Oktober',
				'November',
				'Desember'
			];
			var folder = months[d.getMonth()] + '-' + d.getFullYear();
			var tmp = 'uploads/tmp/' + req.file.filename;
			var dir = 'uploads/file/' + folder;

			if (!fs.existsSync(dir)) {
				await fs.mkdirSync(dir);
			}
			var ok = await fs.copyFileSync(tmp, 'uploads/file/' + folder + '/' + req.file.filename);
			// console.log(ok);
			if (req.file.filename) fs.unlinkSync(req.file.path);
			var file = dir + '/' + req.file.filename;
			// let sql = `INSERT INTO t_foto SET ?`;
			// var data = {
			// 	judul: req.file.filename,
			// 	file: file,
			// 	date: folder
			// };
			// conn.query(sql, data, (err, result) => {
			res.send({ uploadedImageUrl: file });
			// });
		} catch (error) {
			// console.log(error);
			// fs.unlinkSync(req.file.path);
			// console.log(error);
			res.send({ error: 'error' });
		}
	},
	(err, req, res, next) => {
		res.send({
			error: err.message
		});
	}
);
module.exports = router;
