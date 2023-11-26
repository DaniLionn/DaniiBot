const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("annoy-on")
    .setDescription("turns on annoy mode"),
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
