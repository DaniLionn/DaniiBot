const { SlashCommandBuilder } = require('discord.js');
const https = require('https');

const key = "c49df916bac9bdf813076d2d0b7c6cf7"


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ai-image')
		.setDescription("generates an ai image from the supplied prompt")
		.addStringOption(option =>
			option.setName('prompt')
				.setDescription('the prompt for the image')
				.setRequired(true)
),
	async execute(interaction) {
        //give the bot time to think! we need to make sure we get all the data
        //console.log(appDir)
        await interaction.deferReply();

        var word = interaction.options.getString('word')
        word = word.toLowerCase()
        console.log(" ")
        console.log(`Attempting to get definition for "${word}"`)

        //DaniBot now goes "Hey man, can I have the information for [WORD]?" to the API
        //then the API should respond with "Sure thing, just gimmie a sec"



        https.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, (resp) => {
            let data = '';

          // Cue DaniBot waiting patiently for her data
         resp.on('data', (chunk) => {
            console.log(" ")
            console.log("received chunk of data!")
            data += chunk;
		});
            //Now the API hands the data over
         resp.on('end', async () => {
            console.log(" ")
            console.log("finished receiving definition!")

		 })})
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