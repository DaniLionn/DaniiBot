const { SlashCommandBuilder, ThreadChannel, AttachmentBuilder } = require('discord.js');

function emotes(str) {
    return str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('poll')
		.setDescription("creates a poll")
/* 		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to echo into')
					.setRequired(true)) */

		.addStringOption(option =>
			option.setName('topic')
				.setDescription('the poll topic')
				.setRequired(true))
        .addStringOption(option =>
                    option.setName('emojis')
                        .setDescription('the emojis to use for the options (does not work with custom emojis)')
                        .setRequired(true)),
               
		/* .addAttachmentOption(option =>
				option.setName('file')
					.setDescription('A file to attach')), */

	async execute(interaction) {
		await interaction.deferReply({ephemeral: true});

        const topic = interaction.options.getString('topic')
        const emojis = interaction.options.getString('emojis')
        const foundEmojis = await emotes(emojis)



			if (foundEmojis != undefined) {
				await interaction.editReply("creating poll...", {ephemeral: true})
				await interaction.channel.send(`**POLL!**\n\n${topic}`)
				const msgs = interaction.channel.messages.fetch(
					{
						limit: 1
					})
					const msg = (await msgs).at(0)
				await foundEmojis.forEach(emoji =>
					{
						msg.react(emoji)
					});
			
					await  interaction.deleteReply()
			} else {
				await interaction.editReply("you didn't supply any emojis!", {ephemeral: true})
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