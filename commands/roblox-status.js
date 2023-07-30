const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const https = require('https');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('roblox-status')
		.setDescription("returns the current status for roblox"),

	async execute(interaction) {

		interaction.deferReply()

		try {
            https.get(`https://4277980205320394.hostedstatus.com/1.0/status/59db90dbcdeb2f04dadcf16d`, (resp) => {
                
                let data = '';
                
                resp.on('data', (chunk) => {
                    
                    data += chunk;
                });
                
                resp.on('end', async () => {
                    const result = JSON.parse(data)
                    
                    let status_overall = result["result"]["status_overall"]["status"]
                    let full_status = result["result"]["status"]
                
                        const StatusEmbed = new EmbedBuilder()
                            .setColor(0xFFFFFF)
                            .setTitle('Roblox status')
                            .setURL('https://status.roblox.com')
                            .setDescription(`Current Status: ${status_overall}`)
                            .addFields({
                                    name: full_status[0]['name'],
                                    value: full_status[0]['status']
                                }, {
                                    name: full_status[0]['containers'][0]['name'],
                                    value: full_status[0]['containers'][0]['status']
                                }, {
                                    name: full_status[0]['containers'][1]['name'],
                                    value: full_status[0]['containers'][1]['status'],
                                    inline: true
                                }, {
                                    name: full_status[0]['containers'][2]['name'],
                                    value: full_status[0]['containers'][2]['status'],
                                    inline: true
                                }, {
                                    name: full_status[0]['containers'][3]['name'],
                                    value: full_status[0]['containers'][3]['status'],
                                    inline: true
                                },
                                
                                {
                                    name: full_status[1]['name'],
                                    value: full_status[1]['status']
                                }, {
                                    name: full_status[1]['containers'][0]['name'],
                                    value: full_status[1]['containers'][0]['status']
                                }, {
                                    name: full_status[1]['containers'][1]['name'],
                                    value: full_status[1]['containers'][1]['status'],
                                    inline: true
                                }, {
                                    name: full_status[1]['containers'][2]['name'],
                                    value: full_status[1]['containers'][2]['status'],
                                    inline: true
                                }, {
                                    name: full_status[1]['containers'][3]['name'],
                                    value: full_status[1]['containers'][3]['status'],
                                    inline: true
                                }, {
                                    name: full_status[1]['containers'][4]['name'],
                                    value: full_status[1]['containers'][4]['status'],
                                    inline: true
                                },
                                
                                {
                                    name: full_status[2]['name'],
                                    value: full_status[2]['status']
                                }, {
                                    name: full_status[2]['containers'][0]['name'],
                                    value: full_status[2]['containers'][0]['status']
                                }, {
                                    name: full_status[2]['containers'][1]['name'],
                                    value: full_status[2]['containers'][1]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][2]['name'],
                                    value: full_status[2]['containers'][2]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][3]['name'],
                                    value: full_status[2]['containers'][3]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][4]['name'],
                                    value: full_status[2]['containers'][4]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][5]['name'],
                                    value: full_status[2]['containers'][5]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][6]['name'],
                                    value: full_status[2]['containers'][6]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][7]['name'],
                                    value: full_status[2]['containers'][7]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][8]['name'],
                                    value: full_status[2]['containers'][8]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][9]['name'],
                                    value: full_status[2]['containers'][9]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][10]['name'],
                                    value: full_status[2]['containers'][10]['status'],
                                    inline: true
                                }, {
                                    name: full_status[2]['containers'][11]['name'],
                                    value: full_status[2]['containers'][11]['status'],
                                    inline: true
                                },
                            )
                        
                        interaction.editReply({
							embeds: [StatusEmbed]
						})

                    })
                    
            })
            
        } catch (err) {
            interaction.editReply("An error occured!")
        }
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