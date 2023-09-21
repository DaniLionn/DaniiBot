const { SlashCommandBuilder } = require('discord.js');
const https = require("https")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription("creates an invite to generic vibe"),

	async execute(interaction) {
		const channel = interaction.channel.id
		await interaction.deferReply({ephemeral: true})

		https.get(`https://daniibot.dani-lionn.repl.co/postInvite?channelID=${channel}&placeID=11138886508&message=<@1130288851521392750>%20wanna%20play?`, res => {
			res.on('end', async () => {
				await interaction.deleteReply()
			})

			res.on('error', async () => {
				await interaction.editReply("An error occured whilst sending the invite!")
			})
		})
		
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