const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('react')
		.setDescription("forces danibot to react with the specified emoji(s)")
		.addStringOption(option =>
			option.setName('emoji')
				.setDescription('the emoji to react with (you can use more than one)')
				.setRequired(true)
),
	async execute(interaction) {

	},
};
