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

router.post(
	'/InputLaporan',
	upload2.single('file'),
	async (req, res) => {
		try {
			var body = JSON.parse(req.body.Data);
			console.log(body);
			let { id_partai, id_tahun, id_user } = body;
			// let { id_partai, id_tahun, id_user } = data.data;
			// console.log(body.data);
			// var { nama_partai, lambang_partai, visi, misi, prov, kab, kec, des, alamat, web, phone, email } = req.body.data;
			// console.log(req.body);
			// var alert = ' Belum disi';
			var sql = `INSERT INTO t_laporan SET ? `;
			var d = new Date();
			var folder = 'Laporan-' + d.getFullYear();
			// months[d.getMonth()] + '-' + d.getFullYear();
			var tmp = 'uploads/tmp/' + req.file.filename;
			var dir = 'uploads/file/' + folder;

			if (!fs.existsSync(dir)) {
				await fs.mkdirSync(dir);
			}
			await fs.copyFileSync(tmp, 'uploads/file/' + folder + '/' + req.file.filename);
			var { nama_laporan, deskripsi, tanggal_laporan, smptanggal_laporan } = body.data;
			await fs.renameSync(
				dir + '/' + req.file.filename,
				dir + '/' + nama_laporan + '-' + tanggal_laporan + '-' + req.file.filename
			);
			if (req.file.filename) fs.unlinkSync(req.file.path);
			var file =
				baseURL +
				'/' +
				dir +
				'/' +
				encodeURIComponent(nama_laporan) +
				'-' +
				encodeURIComponent(tanggal_laporan) +
				'-' +
				encodeURIComponent(req.file.filename);
			var data = {
				nama_laporan,
				deskripsi,
				tanggal_laporan,
				smptanggal_laporan,
				file_dokumen: file,
				id_partai,
				id_tahun,
				by: id_user
			};

			conn.query(sql, data, (err, result) => {
				if (err) {
					fs.unlinkSync(req.file.path);
				}
				return res.send({
					success: true,
					message: 'success',
					data: { uploadedImageUrl: file }
				});
			});
			//
		} catch (error) {
			fs.unlinkSync(req.file.path);
			res.send({
				success: false,
				message: error.message
			});
			// res.send({ error: 'error' });
		}
	},
	(err, req, res, next) => {
		res.send({
			error: err.message
		});
	}
);

router.post('/Laporan', async (req, res) => {
	let { id_partai } = req.body;

	let sql = `SELECT * FROM t_laporan a WHERE id_partai = '${id_partai}' AND a.delete='1' ORDER BY created_at DESC`;
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

router.post('/LaporanBy', async (req, res) => {
	let { id_user, id_partai, id_laporan } = req.body;
	console.log(req.body);
	var sql = `SELECT * FROM t_laporan a WHERE a.id_laporan = '${id_laporan}' AND a.id_partai = '${id_partai}' AND a.by='${id_user}' `;
	try {
		console.log(sql);
		const result = await query(sql);
		return res.send({
			success: true,
			message: 'success',
			data: result[0]
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});

router.put('/Laporan', async (req, res) => {
	let { id_user, id_partai, id_laporan } = req.body;
	// console.log(object)
	var sql = `SELECT * FROM t_laporan a WHERE a.id_laporan = '${id_laporan}' AND a.id_partai = '${id_partai}' AND a.by='${id_user}' `;
	let sql3 = `UPDATE t_laporan SET ? WHERE id_laporan =  ?`;
	console.log('run');
	try {
		var data = { delete: '0' };
		const result = await query(sql);
		console.log(sql);
		if (!result.length)
			return res.send({
				success: false,
				message: 'error'
			});
		var edit = [ data, id_laporan ];
		conn.query(sql3, edit, (err, result) => {
			// console.log(edit);
			// console.log(result);
			if (err)
				return res.send({
					success: false,
					message: err.message
				});
		});
		return res.send({
			success: true,
			message: 'success',
			data: result[0]
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});

router.patch('/InputLaporan', async (req, res) => {
	let { id_user, id_partai, id_laporan, nama_laporan, deskripsi, tanggal_laporan } = req.body;
	// console.log(object)
	// console.log(req.body);

	var sql = `SELECT * FROM t_laporan a WHERE a.id_laporan = '${id_laporan}' AND a.id_partai = '${id_partai}' AND a.by='${id_user}' `;
	let sql3 = `UPDATE t_laporan SET ? WHERE id_laporan =  ?`;
	// console.log('run');
	// console.log(req.body);

	// return res.send({
	// 	success: false
	// 	// message: err.message
	// });
	try {
		var data = { nama_laporan, deskripsi, tanggal_laporan };
		const result = await query(sql);
		// console.log(sql);
		if (!result.length)
			return res.send({
				success: false,
				message: 'error'
			});
		var edit = [ data, id_laporan ];
		conn.query(sql3, edit, (err, result) => {
			// console.log(edit);
			// console.log(result);
			if (err)
				return res.send({
					success: false,
					message: err.message
				});
		});
		return res.send({
			success: true,
			message: 'success',
			data: result[0]
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});

router.post(
	'/InputLaporanU',
	upload2.single('file'),
	async (req, res) => {
		try {
			var body = JSON.parse(req.body.Data);
			console.log(body);
			var { id_user, id_partai, id_laporan, nama_laporan, deskripsi, tanggal_laporan } = body;
			var c = new Date(tanggal_laporan),
				month = '' + (c.getMonth() + 1),
				day = '' + c.getDate(),
				year = c.getFullYear();

			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;

			tanggal_laporan = [ year, month, day ].join('-');
			console.log(tanggal_laporan);

			var d = new Date();
			var folder = 'Laporan-' + d.getFullYear();
			// months[d.getMonth()] + '-' + d.getFullYear();
			var tmp = 'uploads/tmp/' + req.file.filename;
			var dir = 'uploads/file/' + folder;
			console.log('run 1');
			if (!fs.existsSync(dir)) {
				await fs.mkdirSync(dir);
			}
			await fs.copyFileSync(tmp, 'uploads/file/' + folder + '/' + req.file.filename);
			// var { nama_laporan, deskripsi, tanggal_laporan, smptanggal_laporan } = body.data;
			console.log(req.file.filename);
			console.log('run 2');

			await fs.renameSync(
				dir + '/' + req.file.filename,
				dir + '/' + nama_laporan + '-' + tanggal_laporan + '-' + req.file.filename
			);
			console.log('run 3');

			if (req.file.filename) fs.unlinkSync(req.file.path);
			console.log('run 4');

			var file =
				baseURL +
				'/' +
				dir +
				'/' +
				encodeURIComponent(nama_laporan) +
				'-' +
				encodeURIComponent(tanggal_laporan) +
				'-' +
				encodeURIComponent(req.file.filename);

			var sql = `SELECT * FROM t_laporan a WHERE a.id_laporan = '${id_laporan}' AND a.id_partai = '${id_partai}' AND a.by='${id_user}' `;
			let sql3 = `UPDATE t_laporan SET ? WHERE id_laporan =  ?`;
			var data = { nama_laporan, deskripsi, tanggal_laporan, file_dokumen: file };
			const result = await query(sql);
			console.log('run 5');

			// console.log(sql);
			if (!result.length)
				return res.send({
					success: false,
					message: 'error'
				});
			var edit = [ data, id_laporan ];
			conn.query(sql3, edit, (err, result) => {
				if (err) {
					fs.unlinkSync(req.file.path);
				}
				// console.log(edit);
				// console.log(result);
				if (err)
					return res.send({
						success: false,
						message: err.message
					});
			});
			// return res.send({
			// 	success: false
			// message: error.message
			// });
			// conn.query(sql, data, (err, result) => {

			return res.send({
				success: true,
				message: 'success',
				data: { uploadedImageUrl: file }
			});
			// });
			//
		} catch (error) {
			fs.unlinkSync(req.file.path);
			res.send({
				success: false,
				message: error.message
			});
			// res.send({ error: 'error' });
		}
	},
	(err, req, res, next) => {
		res.send({
			error: err.message
		});
	}
);

module.exports = router;
