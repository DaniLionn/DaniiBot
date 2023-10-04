const { SlashCommandBuilder } = require('discord.js');
var fs = require("fs");
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-generic-vibe-data')
		.setDescription("gets player data from generic vibe")
		.addStringOption(option =>
			option.setName('user-id')
				.setDescription('the userid of the player whose data you want')
				.setRequired(true)),
		
	async execute(interaction) {
		

		https.get(`https://daniibot.dani-lionn.repl.co/getData?UserId=${interaction.options.getString('user-id')}`, options, (response) => {

		var result = ''
		response.on('data', function(chunk) {
			result += chunk;
		});
	
		response.on('end', async function() {
			FinalJSON = JSON.parse(result);
	
			var createStream = fs.createWriteStream("data.json");
			createStream.end();
			writeStream.write(FinalJSON);

			writeStream.end();

			await interaction.channel.send({
				files: ['./data.json']
			});
			
				})
	})}
};

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