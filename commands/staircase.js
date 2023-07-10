const { SlashCommandBuilder } = require('discord.js');

const stairsImages = [ 'https://i.imgur.com/P97Wooy.jpg', 'https://i.imgur.com/CkPVEct.jpg', 'https://imgur.com/RuIwY31', 'https://imgur.com/OcdhpeR', 'https://i.imgur.com/m6MiLky.jpg' ]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('staircase')
		.setDescription("posts an image of somebody falling down the stairs"),
	async execute(interaction) {
     await interaction.reply(stairsImages[Math.floor(Math.random() * stairsImages.length)])
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