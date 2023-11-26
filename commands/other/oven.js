const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("oven")
    .setDescription(
      "why do they call it oven when you of in the cold food of out hot eat the food",
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    await interaction.deleteReply();
    await interaction.channel.send(
      "https://DaniLionn.github.io/danis-bot-website/assets/images/oven.png",
    );
  },
};
