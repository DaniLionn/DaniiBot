const { SlashCommandBuilder, ChannelType  } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('image-message')
		.setDescription("makes your message into an image")
		.addStringOption(option =>
			option.setName('text')
				.setDescription('the message')
				.setRequired(true))
			
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('send in this channel (optional)')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)),
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