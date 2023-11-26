const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("time-out")
    .setDescription("puts danibot in time out (only dani can use)"),
  async execute(interaction) {},
};

