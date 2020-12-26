const { token } = require('../config');

process.env.NTBA_FIX_319 = 1;
const Telegram = require('node-telegram-bot-api');
// const util = require('util');
const Promise = require('bluebird');
Promise.config({
	cancellation: true
});
async function RUNbot(Message) {
	try {
		// console.log(Message);
		const bot = new Telegram(token);

		return bot.sendMessage(-1001268005967, Message, { parse_mode: 'HTML' });
	} catch (error) {
		console.log(error);
	}
}

module.exports = { RUNbot };
