const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("bad-compliment")
    .setDescription("sends somebody a random backhanded compliment")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription('The person to "compliment"')
        .setRequired(true),
    ),

  async execute(interaction) {},
};
