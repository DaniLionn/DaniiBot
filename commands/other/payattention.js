const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("payattention")
    .setDescription("basically a ping but different")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person to try to get to pay attention")
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const target = interaction.options.getUser("user");

    await interaction.deleteReply();
    await interaction.channel.send(
      `*snaps fingers in <@${target.id}>'s face* HEY!`,
    );
  },
};
