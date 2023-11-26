const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("crash")
    .setDescription("causes the bot to crash (only dani can use)"),
  async execute(interaction) {},
};

