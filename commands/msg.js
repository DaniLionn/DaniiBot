const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('msg')
		.setDescription('messages somebody')
		.addUserOption(option => option.setName('messagee').setDescription('The person to message').setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('what to send')
                .setRequired(true)),

		async execute(interaction) {
            await interaction.deferReply()
            await interaction.deleteReply()
            const target = interaction.options.getUser('messagee');
            target.send(interaction.options.getString('message'))
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