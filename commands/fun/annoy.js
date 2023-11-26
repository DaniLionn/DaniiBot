const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("annoy")
    .setDescription(
      "danibot will repeat any message that isn't her's for the next one minute",
    ),

  async execute(interaction) {
    interaction.reply(
      "i will now repeat every message for the next one minute \n have fun.",
    );
  },
};

