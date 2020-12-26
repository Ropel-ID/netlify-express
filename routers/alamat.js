const { query } = require('../config');
const router = require('express').Router();

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

router.get('/kabupaten/:id', async (req, res) => {
	// SELECT * FROM `m_kab` WHERE prov_id
	var sql = `SELECT id, name as kab FROM m_kab where prov_id = '${req.params.id}'`;
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
router.get('/kecamatan/:id', async (req, res) => {
	var sql = `SELECT id, name as  kec FROM m_kec where kab_id =${req.params.id}`;
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
router.get('/Desa/:id', async (req, res) => {
	var sql = `SELECT id, name as des FROM m_des where kec_id =${req.params.id}`;
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

router.post('/full_alamat', async (req, res) => {
	var { prov, kab, kec, des } = req.body;
	// console.log(req.body);
	var sql = `SELECT name as prov FROM m_prov  WHERE id = '${prov}'`;
	var sql1 = `SELECT name as kab FROM m_kab  WHERE id = '${kab}'`;
	var sql2 = `SELECT name as kec FROM m_kec  WHERE id = '${kec}'`;
	var sql3 = `SELECT name as des FROM m_des  WHERE id = '${des}'`;
	try {
		const result = await query(sql);
		const result1 = await query(sql1);
		const result2 = await query(sql2);
		const result3 = await query(sql3);
		var prov = '';
		if (result.length) prov = result[0].prov;
		var kab = '';
		if (result1.length) kab = result1[0].kab;
		var kec = '';
		if (result2.length) kec = result2[0].kec;
		var des = '';
		if (result3.length) des = result3[0].des;
		var datar = { prov, kab, kec, des };
		// console.log(datar);
		return res.send({
			success: true,
			message: 'success',
			data: datar
		});
	} catch (err) {
		return res.send({
			success: false,
			message: err.message
		});
	}
});

module.exports = router;
