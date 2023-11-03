const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('neon-green-squad-members')
		.setDescription("lists members in the neon green squad"),
	async execute(interaction) {
 
        let roleID = '1170036686722441236';
        let memberCount = interaction.guild.roles.cache.get(roleID).members.size

			let message = memberCount + " people are in the Neon Green Squad.\n"

			interaction.guild.roles.cache.get(roleID).members.forEach((member) => {
				let user = member.user.username
				
				message = message + "\n1. " + user 
			})

        await interaction.reply(message);
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