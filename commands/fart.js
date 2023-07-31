const { SlashCommandBuilder } = require('discord.js');

const farts = ["../assets/farts/fart (1).mp3", "../assets/farts/fart (2).mp3", "../assets/farts/fart (3).mp3", "../assets/farts/fart (4).mp3", "../assets/farts/fart (5).mp3", "../assets/farts/fart (6).mp3", "../assets/farts/fart (7).mp3", "../assets/farts/fart (8).mp3", "../assets/farts/fart (9).mp3", "../assets/farts/fart (10).mp3", "../assets/farts/fart (11).mp3", "../assets/farts/fart (12).mp3", "../assets/farts/fart (13).mp3", "../assets/farts/fart (14).mp3", "../assets/farts/fart (15).mp3"] 

const wait = require('node:timers/promises').setTimeout;


module.exports = {
	data: new SlashCommandBuilder()
		.setName('fart')
		.setDescription('fart'),


	async execute(interaction) {
        
      await interaction.reply({files: [farts[Math.floor(Math.random() * farts.length)]]})

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