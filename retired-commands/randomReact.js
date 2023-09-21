const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-react')
		.setDescription("forces danibot to randomly react to the last message somebody sent"),
	async execute(interaction) {

	},
};
