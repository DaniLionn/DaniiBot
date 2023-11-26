const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disgusting")
    .setDescription("eeeeeewwwwwwwwwwwwwwwwww"),

  async execute(interaction) {
    interaction.reply(
      "https://danilionn.github.io/danis-bot-website/assets/gifs/disgusting.gif",
    );
  },
};

