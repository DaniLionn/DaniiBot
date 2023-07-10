const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription("goodbye danibot..."),


	async execute(interaction) {
        interaction.guild.leave()
	},
};
