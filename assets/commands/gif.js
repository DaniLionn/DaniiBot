const { Discord, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gif')
		.setDescription('Sends a gif!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The gif name')
				.setRequired(true)
				.addChoices(
					{ name: 'Fat Guy', value: 'gif_fatguy' },
					{ name: 'aiyaiyai', value: 'gif_buttburn' },
                    { name: 'Dead chat', value: 'gif_deatchat' },
                    { name: 'i saw what you deleted', value: 'gif_deleted' },
                    { name: 'funny cat', value: 'gif_funnycat' },
                    { name: 'boys bathroom at school (found footage)', value: 'gif_pee' },
                    { name: 'sleepy cat', value: 'gif_sleepycat' },
                    { name: 'dripping cock', value: 'gif_cock' },
                    { name: 'piss', value: 'gif_poss' },
					{name: 'Milk explosion', value: 'gif_boomie'},//https://tenor.com/view/my-reaction-to-that-information-gif-26013120
					{name: 'doctor when pee', value: 'gif_doctorpiss'}, //https://tenor.com/view/urine-test-gif-19939272
					{name: 'my reaction to that information', value: 'gif_info'},
					{name: 'dog :eyes:', value: 'gif_dogstare'},
				)),
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