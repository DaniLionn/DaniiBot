const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("emojify")
    .setDescription("turns a message into emoji letters")
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("the message to emojify")
        .setRequired(true),
    ),
  async execute(interaction) {},
};
