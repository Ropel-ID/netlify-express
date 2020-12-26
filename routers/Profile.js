const { query, conn, baseURL } = require('../config');
const router = require('express').Router();
var multer = require('multer');
const path = require('path');
var fs = require('fs');
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
var storage3 = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, 'uploads/tmp');
	},
	filename: function(req, file, cb) {
		// console.log(req.body);
		var type = path.extname(file.originalname);
		cb(null, file.originalname + Date.now() + '' + type);
		// 'Foto_diri' + '-' +file.originalname.replace(type, '').toLowerCase()
	}
});
var upload3 = multer({
	storage: storage3,
	fileFilter: (req, file, cb) => {
		// console.log(file.mimetype);
		if (file.mimetype == 'application/pdf') {
			cb(null, true);
		} else {
			cb(null, false);
			return cb(new Error('hanya format .pdf yang diperbolehkan !'));
		}
	}
});

router.post('/InfoParpol', async (req, res) => {
	let { id_partai } = req.body;
	var sql2 = `SELECT jumlah_kursi,perolehan_suara_sah,rp_suara,jumlah_bantuan FROM t_bantuan  WHERE id_partai = '${id_partai}' ORDER BY created_at DESC limit 1`;
	var sql = `SELECT * FROM t_partai WHERE id_partai = '${id_partai}' ORDER BY created_at DESC limit 1`;

	try {
		const result = await query(sql);
		const result2 = await query(sql2);

		// console.log(result[0].id_tahun);
		if (result.length == 0)
			return res.send({
				success: false,
				message: 'Data Tidak ditemukan'
			});
		var sql3 = `SELECT * FROM t_tahunpriode WHERE id_tahun='${result[0].id_tahun}'`;
		const result3 = await query(sql3);
		// console.log(result3[0].priode);
		var priode = '';
		if (result3.length) priode = result3[0].priode;
		let info = result[0];
		let bantuan = result2[0];
		return res.send({
			success: true,
			message: 'success',
			data: {
				info,
				bantuan,
				priode
			}
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});

router.post('/editInfoParpol', async (req, res) => {
	let { id_partai, id_tahun, id_user } = req.body;
	var {
		nama_partai,
		lambang_partai,
		visi,
		misi,
		prov,
		kab,
		kec,
		des,
		alamat,
		web,
		phone,
		email,
		nama_ketua
	} = req.body.data;
	var sql2 = `SELECT * FROM t_partai where id_partai =${id_partai} and id_tahun=${id_tahun}`;
	let sql = `INSERT INTO t_partai SET ?`;
	let sql3 = `UPDATE t_partai SET ? WHERE id_partai =  ? and id_tahun = ?`;
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
		nama_ketua,
		id_tahun,
		web,
		phone,
		email,
		by: id_user
	};
	// console.log(id_tahun);

	try {
		const result = await query(sql2);

		if (!result.length) {
			// console.log(result);
			// console.log('input');
			conn.query(sql, data, (err, result) => {
				// console.log(err);
				// console.log(result);
				if (err)
					return res.send({
						success: false,
						message: err.message
					});
				// console.log('ok input');
			});
			// console.log(result1);
		} else {
			// console.log('Update');
			var edit = [ data, id_partai, id_tahun ];
			conn.query(sql3, edit, (err, result) => {
				// console.log(err);
				// console.log(result);
				if (err)
					return res.send({
						success: false,
						message: err.message
					});
				// console.log('ok Update');
			});
		}
		// conn.query(sql, data, (err, result) => {
		res.send({
			success: true,
			message: 'success'
			// data: users
		});
		// });
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});

router.post(
	'/file',
	upload2.single('file'),
	async (req, res) => {
		try {
			var tmp = 'uploads/tmp/' + req.file.filename;
			var dir = 'uploads/file/LogoPartai/';
			if (!fs.existsSync(dir)) {
				await fs.mkdirSync(dir);
			}
			await fs.copyFileSync(tmp, dir + req.file.filename);

			if (req.file.filename) fs.unlinkSync(req.file.path);
			var file = dir + '/' + req.file.filename;
			return res.send({
				success: true,
				message: 'success',
				uploadedImageUrl: baseURL + '/' + file
			});
		} catch (error) {
			return res.send({
				success: false,
				message: error.message
			});
		}
	},
	(err, req, res, next) => {
		return res.send({
			success: false
			// message: err
		});
	}
);

router.post(
	'/pdf',
	upload3.single('file'),
	async (req, res) => {
		try {
			// console.log(req.body.name);

			// var folder = months[d.getMonth()] + '-' + d.getFullYear();
			var tmp = 'uploads/tmp/' + req.file.filename;
			var dir = 'uploads/file/' + req.body.name;

			if (!fs.existsSync(dir)) {
				await fs.mkdirSync(dir);
			}
			await fs.copyFileSync(tmp, dir + '/' + req.file.filename);
			fs.renameSync(dir + '/' + req.file.filename, dir + '/' + req.body.name + '-' + req.file.filename);
			if (req.file.filename) fs.unlinkSync(req.file.path);
			var file = baseURL + '/' + dir + '/' + req.body.name + '-' + encodeURIComponent(req.file.filename);
			var sql = `SELECT * FROM t_berkas where id_partai =${req.body.id_partai} and id_tahun =   ${req.body
				.id_tahun}`;
			let sql1 = `INSERT INTO t_berkas SET ?`;
			let sql3 = `UPDATE t_berkas SET ? WHERE id_partai =  ? and id_tahun = ?`;
			// console.log(sql1);
			// console.log(sql3);
			if (req.body.name == 'npwp')
				var data = {
					id_tahun: req.body.id_tahun,
					id_partai: req.body.id_partai,
					by: req.body.id_user,
					npwp: file
				};
			if (req.body.name == 'surat_kpu')
				var data = {
					id_tahun: req.body.id_tahun,
					id_partai: req.body.id_partai,
					by: req.body.id_user,
					surat_kpu: file
				};
			if (req.body.name == 'proposal')
				var data = {
					id_tahun: req.body.id_tahun,
					id_partai: req.body.id_partai,
					by: req.body.id_user,
					proposal: file
				};
			if (req.body.name == 'skdpp')
				var data = {
					id_tahun: req.body.id_tahun,
					id_partai: req.body.id_partai,
					by: req.body.id_user,
					skdpp: file
				};

			var data2 = [ data, req.body.id_partai, req.body.id_tahun ];
			const result = await query(sql);
			// console.log(result);
			if (!result.length) {
				conn.query(sql1, data, (err, result) => {
					if (err) return res.send({ error: 'error' });
					// console.log('ok');
				});
				// console.log(result1);
			} else {
				conn.query(sql3, data2, (err, result) => {
					if (err) return res.send({ error: 'error' });
					// console.log('ok');
				});
			}
			return res.send({
				success: true,
				message: 'User Tidak terdafatar',
				uploadedImageUrl: file
			});

			// res.send({ uploadedImageUrl: baseURL + '/' + file });
		} catch (error) {
			return res.send({
				success: false,
				message: error
			});
		}
	},
	(err, req, res, next) => {
		res.send({
			error: err.message
		});
	}
);

router.post('/InfoParpolPDF', async (req, res) => {
	let { id_partai } = req.body;

	let sql = `SELECT * FROM t_berkas WHERE id_partai = '${id_partai}' ORDER BY created_at DESC LIMIT 1`;
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
});
router.post('/editDataBantuan', async (req, res) => {
	// console.log('run 1');

	let { id_partai, id_tahun, id_user } = req.body;
	var { jumlah_kursi, perolehan_suara_sah, jumlah_bantuan, rp_suara } = req.body.data;
	var sql = `SELECT * FROM t_bantuan where id_partai =${id_partai}`;
	let sql1 = `INSERT INTO t_bantuan SET ?`;
	let sql3 = `UPDATE t_bantuan SET ? WHERE id_partai =  ?`;
	var data = {
		id_partai,
		jumlah_kursi,
		perolehan_suara_sah,
		jumlah_bantuan,
		rp_suara,
		id_tahun,
		by: id_user
	};
	var sql5 = `SELECT * FROM t_tahunpriode where id_tahun = ${id_tahun} `;

	try {
		const result = await query(sql);
		const result5 = await query(sql5);

		data.rp_suara = result5[0].rp_suara;
		data.jumlah_bantuan = parseInt(result5[0].rp_suara) * parseInt(perolehan_suara_sah);

		if (!result.length) {
			conn.query(sql1, data, (err, result) => {
				if (err)
					return res.send({
						success: false,
						message: err.message
					});
			});
		} else {
			console.log('Update');
			var edit = [ data, id_partai ];
			conn.query(sql3, edit, (err, result) => {
				if (err)
					return res.send({
						success: false,
						message: err.message
					});
			});
		}

		res.send({
			success: true,
			message: 'success'
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});
router.post('/InfoDataBantuan', async (req, res) => {
	let { id_partai } = req.body;

	let sql = `SELECT * FROM t_bantuan WHERE id_partai = '${id_partai}' ORDER BY created_at DESC LIMIT 1 `;
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
});

module.exports = router;
