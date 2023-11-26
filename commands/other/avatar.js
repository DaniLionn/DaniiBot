const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar-card")
    .setDescription("sends an avatar card for your profile")
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("optional text to display above your username")
        .setRequired(false),
    ),
  async execute(interaction) {},
};
