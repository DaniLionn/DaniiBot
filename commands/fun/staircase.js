const { SlashCommandBuilder } = require("discord.js");

const stairsImages = [
  "https://i.imgur.com/P97Wooy.jpg",
  "https://i.imgur.com/CkPVEct.jpg",
  "https://imgur.com/RuIwY31",
  "https://imgur.com/OcdhpeR",
  "https://i.imgur.com/m6MiLky.jpg",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("staircase")
    .setDescription("posts an image of somebody falling down the stairs"),
  async execute(interaction) {
    await interaction.reply(
      stairsImages[Math.floor(Math.random() * stairsImages.length)],
    );
  },
};
