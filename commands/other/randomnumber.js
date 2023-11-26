const { SlashCommandBuilder } = require("discord.js");

function mama(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-number")
    .setDescription("generates a random number")
    .addNumberOption((option) =>
      option.setName("min").setDescription("minimum number").setRequired(true),
    )

    .addNumberOption((option) =>
      option.setName("max").setDescription("maximum number").setRequired(true),
    ),

  async execute(interaction) {
    await interaction.reply(
      `${mama(interaction.options.get("min"), interaction.options.get("max"))}`,
    );
  },
};

