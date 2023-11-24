const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('insult')
		.setDescription('insults somebody')
		.addUserOption(option => option.setName('insultee').setDescription('The person to insult').setRequired(true)),
			
		async execute(interaction) {
			/* 		const type = interaction.options.getString('name');
					await interaction.deferReply();
			
					await interaction.editReply( // Sending the image
					{
						files: [type]
					}) */
			
					// category must be one of 'gif_funny', 'gif_meme', or 'gif_movie'
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