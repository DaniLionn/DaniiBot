const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("me")
    .setDescription(
      'attaches "danibot" to the beginning of your message and makes the message *italic*',
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("the message to echo")
        .setRequired(true),
    ),
  async execute(interaction) {},
};
