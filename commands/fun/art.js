const arts = [
  "https://danilionn.github.io/danis-bot-website/assets/images/dino%20man%20and%20sir%20bowling%20pin.png",
  "https://danilionn.github.io/danis-bot-website/assets/images/john.png",
  "https://danilionn.github.io/danis-bot-website/assets/images/cool%20dude.png",
  "https://danilionn.github.io/danis-bot-website/assets/images/cool%20dude.png",
  "https://danilionn.github.io/danis-bot-website/assets/images/aaa.png",
];

const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("art")
    .setDescription("sends art (that i drew)"),
  async execute(interaction) {
    await interaction.reply(arts[Math.floor(Math.random() * arts.length)]);
  },
};
