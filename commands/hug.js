const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hug')
		.setDescription('sends somebody a virtual hug')
					.addUserOption(option => option.setName('user').setDescription('The person to hug').setRequired(true)),
	
		async execute(interaction) {
            const user = await interaction.options.getUser('user')
         await  interaction.reply(`https://tenor.com/view/covid-meme-cute-gif-23513805`)
            await interaction.channel.send(`<@${user.id}>`)
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