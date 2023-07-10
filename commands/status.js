const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('change-status')
		.setDescription("changes the bot's status (only dani can use)")
		.addStringOption(option =>
			option.setName('type')
				.setDescription('The status type')
				.setRequired(true)
		.addChoices(
			{ name: 'Random', value: 'NONE' },
			{ name: 'Playing', value: 'PLAYING' },
			{ name: 'Watching', value: 'WATCHING' },
			{ name: 'Listening', value: 'LISTENING' },
			{ name: 'Competing', value: 'COMPETING' },

		)),
	async execute(interaction) {

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