const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bug-report')
		.setDescription("submits a bug report")
        .addStringOption(option =>
			option.setName('title')
				.setDescription('title of the bug report')
				.setRequired(true))
                .addStringOption(option =>
                    option.setName('report')
                        .setDescription('the actual bug report')
                        .setRequired(true)),


	async execute(interaction) {

        await interaction.reply("sent bug report!", {
            ephemeral: true
        })

        setTimeout(async () =>  {
            await interaction.deleteReply()
        }, 2000)
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