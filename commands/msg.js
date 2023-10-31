const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('msg')
		.setDescription('messages somebody')
		.addUserOption(option => option.setName('messagee').setDescription('The person to message').setRequired(true))
        .addStringOption(option =>
            option.setName('message')
                .setDescription('what to send')
                .setRequired(true))
                .addAttachmentOption(option =>
                    option.setName('attachment')
                        .setDescription('optional attachment to send')
                        .setRequired(false)),

		async execute(interaction) {
            await interaction.deferReply()
            await interaction.deleteReply()

            const a = interaction.options.getAttachment("attachment")
            const target = interaction.options.getUser('messagee');
            if (a != null) {
                console.log("file detected")
                console.log(a.url)
                const attach = new AttachmentBuilder(interaction.options.getAttachment("attachment").url);
                target.send(interaction.options.getString('message'), {
                    files: [attach]
                })
            } else {
                target.send(interaction.options.getString('message'))
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