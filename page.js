// let { APIURL } = require('../../config');
const { baseURL } = require('./config');
const pageverif = (data) => {
	return `<div>
	<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#e5e9ec">
		<tbody>
			<tr>
				<td>
					<table bgcolor="#4d0103" align="center" width="600px" style="height:5px">
						<tbody>
							<tr>
								<td></td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
				<td>
					<table bgcolor="#ffffff" align="center" width="600px" style="border-bottom:1px solid #eee;padding:15px 0">
						<tbody>
							<tr>
								<td>
									<table bgcolor="#ffffff" align="left">
										<tbody>
											<tr>
												<td align="left" valign="top">
													<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
														<tbody>
															<tr>
																<td align="left" valign="middle" style="font:14px Arial,Helvetica,sans-serif;color:#2ba6cb;padding-left:6px"><a href="${baseURL}" style="color:#2ba6cb" target="_blank" >	SISTEM APLIKASI DATABASE PARTAI POLITIK <br />
                                                            
                                                               
                                                                    BADAN KESATUAN BANGSA DAN POLITIK DALAM NEGERI KABUPATEN MADIUN
                                                                </a>
																</td>
															</tr>
															<!-- <tr>
																<td align="left" valign="top" style="color:#858485;font-weight:bold;line-height:20px;padding-left:6px">Administrator</td>
															</tr> -->
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
				<td>
					<table bgcolor="#ffffff" align="center" width="600px" style="border-spacing:0">
						<tbody>
							<tr style="height:20px">
								<td></td>
							</tr>
							<tr align="center">
								<td style="font:17px Arial,Helvetica,sans-serif;color:#000;padding:0 50px 10px">Konfirmasi Akun Registrasi </td>
							</tr>
							<tr style="padding-top:10px">
								<td style="font:12px Arial,Helvetica,sans-serif;padding:0 50px 10px;color:#000"><b>Pendaftar yang kami hormati,</b>
								</td>
							</tr>
							<tr style="padding-top:10px">
								<td style="font:12px Arial,Helvetica,sans-serif;padding:0 50px 10px;color:#000">Berikut adalah Data Username dan Password Anda:</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr align="center">
				<td>
					<table bgcolor="#fafafa" align="center" width="600px" style="padding:15px 0">
						<tbody>
							<tr>
								<td width="8%"></td>
								<td width="20%">Username</td>
								<td width="*"><a href="mailto:${data.email} target="_blank">${data.email}</a>
								</td>
							</tr>
							<tr>
								<td width="8%"></td>
								<td width="20%">Password</td>
								<td width="*">${data.password}</td>
							</tr>
							<!-- <tr>
								<td width="8%"></td>
								<td width="20%">Nomor Identitas</td>
								<td width="*">00</td>
							</tr> -->
						</tbody>
					</table>
				</td>
			</tr>
			<tr align="center">
				<td align="left" valign="top">
					<table width="600px" border="0" align="center" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="padding:25px 0">
						<tbody>
							<tr>
								<td align="left" valign="top">
									<table width="100%" border="0" align="left" cellpadding="0" cellspacing="0">
										<tbody>
											<tr style="padding-top:10px">
												<td style="font:12px Arial,Helvetica,sans-serif;text-align:justify;padding:0 50px 10px;color:#000">Terima kasih Anda sudah melakukan registrasi. Silakan login pada aplikasi <a href="${baseURL}" target="_blank">SISTEM APLIKASI DATABASE PARTAI POLITIK</a> menggunakan username dan password di atas.</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
				<td>
					<table bgcolor="#ffffff" align="center" width="600px" style="border-top:1px solid #eee;padding:15px 0">
						<tbody>
							<tr>
								<td>
									<table bgcolor="#ffffff" align="left">
										<tbody>
											<tr>
												<td align="left" valign="top">
													<table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
														<tbody>
															<tr>
                                                                <td align="left" valign="top" style="color:#2ba6cb;line-height:18px;font:12pxpadding-left:6px">BADAN KESATUAN BANGSA DAN POLITIK DALAM NEGERI <br>
                                                                    KABUPATEN MADIUN</td>
															</tr>
														
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
			<tr>
				<td>
					<table align="center" border="0" cellpadding="0" cellspacing="0" width="600px">
						<tbody>
							<tr>
								<td bgcolor="#4d0103" align="center">
									<table cellspacing="0" cellpadding="0" border="0">
										<tbody>
											<tr>
												<td width="560">
													<table cellspacing="0" cellpadding="0" border="0">
														<tbody>
															<tr>
																<td height="15" width="560"></td>
															</tr>
															<tr>
																<td class="m_8077415812288234086text-white" align="center" width="560"><a style="color:#fff" class="m_8077415812288234086text-white m_8077415812288234086hover-white">©2020</a>
																</td>
															</tr>
															<tr>
																<td width="560" height="20"></td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>
				</td>
			</tr>
		</tbody>
	</table>
</div>`;
};

module.exports = { pageverif };
