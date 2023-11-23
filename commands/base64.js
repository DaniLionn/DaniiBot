const { SlashCommandBuilder } = require('discord.js');
const { atob } = require('node:buffer');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('base64')
		.setDescription("encodes a string to or decodes a string from base64 ")
		.addStringOption(option =>
			option.setName('string')
				.setDescription('the string to use')
				.setRequired(true))

                .addStringOption(option =>
                    option.setName('action')
                        .setDescription('encode/decode')
                        .setRequired(true)

                			.addChoices(
				{ name: 'encode', value: 'encode' },
				{ name: 'decode', value: 'decode' },
			)
),
	async execute(interaction) {
		let string = interaction.options.getString('string')
		let mode = interaction.options.getString('action')

		if (mode === 'encode') {

			const buff = Buffer.from(string, 'utf-8');

			const base64 = buff.toString('base64');

			interaction.reply(base64)

		} else {

			const buff = Buffer.from(string, 'base64');

			const str = buff.toString('utf-8');
			
			interaction.reply(str)

		}

		

	},
};

const fs = require('node:fs');
process.on('unhandledRejection', error =>
{
	console.log("Error detected! Saving to error log...")
	let s = new Date().toLocaleString();
	const read = fs.readFileSync('./ErrorLog.txt', 'utf8', err => {if (err) {console.log(err)}}) 
	const data = `${read}\n${s}: ${error}`
	//console.log(data)
	fs.writeFileSync('./ErrorLog.txt', data, err =>{ if (err) {console.error(err);}
		// file written successfully
		console.log("Successfully wrote error!")
	});
});