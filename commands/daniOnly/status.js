const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("change-status")
    .setDescription("changes the bot's status (only dani can use)")
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("The status type")
        .setRequired(true)
        .addChoices(
          { name: "Random", value: "NONE" },
          { name: "Playing", value: "PLAYING" },
          { name: "Watching", value: "WATCHING" },
          { name: "Listening", value: "LISTENING" },
          { name: "Competing", value: "COMPETING" },
        ),
    ),
  async execute(interaction) {},
};
