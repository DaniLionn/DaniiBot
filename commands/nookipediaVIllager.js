const { SlashCommandBuilder, EmbedBuilder  } = require('discord.js');
const fs = require('node:fs');
const https = require('https');
const { NookipediaAPIKey } = require('./configure.json');
const { dirname } = require('path');
//const { abort } = require('node:process');
const appDir = dirname(require.main.filename);

const VillagerOptions = {
    hostname: 'https://api.nookipedia.com',
    path: '/villagers',
    headers: {
        'x-api-key': NookipediaAPIKey
    }
}



//const { compare } = require('libsodium-wrappers');
module.exports = {
	data: new SlashCommandBuilder()
    .setName('nookipedia')
	.setDescription('get various animal crossing related info')
	.addSubcommand(subcommand =>
		subcommand
			.setName('villager')
			.setDescription('info about a villager')
			.addStringOption(option => option.setName('name').setDescription('The villager you want info about')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('bug')
			.setDescription('Info about the server')
),
	async execute(interaction) {
        //give the bot time to think! we need to make sure we get all the data
        //console.log(appDir)
        await interaction.deferReply();

        if (interaction.options.getSubcommand() === 'villager') {
            https.get(options, (response) => {

                var result = ''
                response.on('data', function (chunk) {
                    result += chunk;
                });
            
                response.on('end', function () {
                    console.log(result);
                });
            
            });
        }

       
    }
}




process.on('unhandledRejection', error =>
{
	console.log(error)
	let s = new Date().toLocaleString();
	const read = fs.readFileSync('./ErrorLog.txt', 'utf8', err => {if (err) {console.log(err)}}) 
	const data = `${read}\n${s}: ${error}`
	//console.log(data)
	fs.writeFileSync('./ErrorLog.txt', data, err =>{ if (err) {console.error(err);}
		// file written successfully
	});
});
