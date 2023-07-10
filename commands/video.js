const { Discord, SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('video')
		.setDescription('Sends a video!')
		.addStringOption(option =>
			option.setName('name')
				.setDescription('The video name')
				.setRequired(true)
				.addChoices(
					{ name: 'how to install rolblox hac 2023 working no virus', value: 'hac' },
                    { name: 'frog', value: 'phrog' },
                    { name: 'roblox tragedy', value: 'tragedy' },
                    { name: 'sleep tracking app', value: 'sleep' },
                    { name: 'windows 7', value: '7' },
                    { name: 'fazbear', value: 'fazbear' },
                    { name: 'spoderman', value: 'spoderman' },
                    { name: 'boing', value: 'boing' },
                    { name: 'george dumpyton', value: 'dump' },
                    { name: 'frog', value: 'frog' },
                    { name: 'me eat oragne', value: 'oange' },
                    { name: 'fredy faber what hapen', value: 'squidgame' },
                    { name: 'plant punch', value: 'pow' },
                    { name: 'squidgnebobe', value: 'p' },
                    { name: 'microwave', value: 'sp' },
				)),
	async execute(interaction) {
    	const type = interaction.options.getString('name');
        await interaction.deferReply();

        if (type === 'hac') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/rblx_hac.mp4")
        }
        if (type === 'phrog') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/phrog.mp4")
        }
        if (type === 'tragedy') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/roblox-tragedy.mp4")
        }
        if (type === 'sleep') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/sleep-tracking-app.mp4")
        }
        if (type === '7') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/windows-7.mp4")
        }
                if (type === 'fazbear') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/fazbear-survival.mp4")
        }
        if (type === 'spoderman') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/spoderman.mp4")
        }
        if (type === 'boing') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/BOING.mp4")
        }

        if (type === 'frog') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/stuburtoe.mp4")
        }

        if (type === 'squidgame') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/fredyfaber.mp4")
        }

        if (type === 'oange') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/orange.mp4")
        }

        if (type === 'pow') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/punch.mp4")
        }

        if (type === 'p') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/squidgebob.mp4")
        }

        if (type === 'sp') {
            interaction.editReply("https://danilionn.github.io/danis-bot-website/assets/videos/microwave.mp4")
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