const { SlashCommandBuilder } = require('discord.js');
var fs = require("fs");
const https = require('https');
const { Curl } = require("node-libcurl");
const {

  DatastoresAPIKey
} = require('../configure.json');

const options = {
	headers: {
		'x-api-key': DatastoresAPIKey
	}
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('get-generic-vibe-data')
		.setDescription("gets player data from generic vibe")
		.addStringOption(option =>
			option.setName('user-id')
				.setDescription('the userid of the player whose data you want')
				.setRequired(true)),
		
	async execute(interaction) {
		await interaction.deferReply()

		     https.get(`https://apis.roblox.com/datastores/v1/universes/3984205042/standard-datastores/datastore/entries/entry?datastoreName=PlayerData&entryKey=${interaction.options.getString('user-id')}%23Data`, options, res => {
        let data = [];

        res.on('data', chunk => {
          data.push(chunk);
        });
      
        res.on('end', async () => {
console.log("finished")

  let FinalJSON = JSON.parse(data)

  console.log(FinalJSON)

  var writeStream = fs.createWriteStream("data.json");
			writeStream.write(FinalJSON);
    console.log("written")
			writeStream.end();

			await interaction.channel.editReply({
				files: ['./data.json']
			});
});



})
}}

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