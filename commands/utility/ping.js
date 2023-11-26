const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("returns websocket heartbeat of bot"),

  async execute(interaction) {},
};

