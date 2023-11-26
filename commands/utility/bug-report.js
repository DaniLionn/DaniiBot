const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bug-report")
    .setDescription("submits a bug report")
    .addStringOption((option) =>
      option
        .setName("title")
        .setDescription("title of the bug report")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("report")
        .setDescription("the actual bug report")
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.reply("sent bug report!", {
      ephemeral: true,
    });

    setTimeout(async () => {
      await interaction.deleteReply();
    }, 2000);
  },
};
