const { WAConnection, Browsers } = require('@adiwajshing/baileys')
const { color, bgcolor } = require('./lib/color')
const fs = require("fs-extra")
const figlet = require('figlet')
const { uncache, nocache } = require('./lib/loader')
const setting = JSON.parse(fs.readFileSync('./setting.json'))
const welcome = require('./message/group')
baterai = 'unknown'
charging = 'unknown'

//nocache
require('./farz.js')
nocache('../farz.js', module => console.log(color('[WATCH]', 'yellow'), color(`'${module}'`, 'cyan'), 'File is updated!'))
require('./message/group.js')
nocache('../message/group.js', module => console.log(color('[WATCH]', 'yellow'), color(`'${module}'`, 'yellow'), 'File is updated!'))

const starts = async (farz = new WAConnection()) => {
	farz.logger.level = 'warn'
	console.log(color(figlet.textSync('Its Me Farz', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		width: 80,
		whitespaceBreak: false
	}), 'gold'))
	console.log(color('[FARZ]', 'cyan'), color('Owner is online now!', 'white'))
	console.log(color('[FARZ]', 'cyan'), color('Welcome back, Owner! Hope you are doing well~', 'white'))
	farz.browserDescription = ["ItsMeFarz", "Firefox", "3.0.0"];

	// Menunggu QR
	farz.on('qr', () => {
		console.log(color('[', 'white'), color('!', 'red'), color(']', 'white'), color('Please scan qr code'))
		farz.sendMessage(`6285692949920@s.whatsapp.net`, `「 *NOTIFICATION!* 」\n\n _Bot Berhasil Terhubung!_`, MessageType.extendedText)
	})

	// Menghubungkan
	fs.existsSync(`./${setting.sessionName}.json`) && farz.loadAuthInfo(`./${setting.sessionName}.json`)
	farz.on('connecting', () => {
		console.log(color('[ FARZ ]', 'cyan'), color('Menghubungkan....'));
	})

	//connect
	farz.on('open', () => {
		console.log(color('[ FARZ]', 'cyan'), color('Bot Sudah Online!'));
	})

	// session
	await farz.connect({
		timeoutMs: 30 * 1000
	})
	fs.writeFileSync(`./${setting.sessionName}.json`, JSON.stringify(farz.base64EncodedAuthInfo(), null, '\t'))

	// Baterai
	farz.on('CB:action,,battery', json => {
		global.batteryLevelStr = json[2][0][1].value
		global.batterylevel = parseInt(batteryLevelStr)
		baterai = batterylevel
		if (json[2][0][1].live == 'true') charging = true
		if (json[2][0][1].live == 'false') charging = false
		console.log(json[2][0][1])
		console.log('Baterai : ' + batterylevel + '%')
	})
	global.batrei = global.batrei ? global.batrei : []
	farz.on('CB:action,,battery', json => {
		const batteryLevelStr = json[2][0][1].value
		const batterylevel = parseInt(batteryLevelStr)
		global.batrei.push(batterylevel)
	})

	// welcome
	farz.on('group-participants-update', async (anu) => {
		await welcome(farz, anu)
	})

	farz.on('chat-update', async (message) => {
		require('./farz.js')(farz, message)
	})
}

starts()