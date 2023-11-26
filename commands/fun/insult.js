const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("insult")
    .setDescription("insults somebody")
    .addUserOption((option) =>
      option
        .setName("insultee")
        .setDescription("The person to insult")
        .setRequired(true),
    ),

  async execute(interaction) {
    /* 		const type = interaction.options.getString('name');
					await interaction.deferReply();
			
					await interaction.editReply( // Sending the image
					{
						files: [type]
					}) */
    // category must be one of 'gif_funny', 'gif_meme', or 'gif_movie'
  },
};
