const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("hug")
    .setDescription("sends somebody a virtual hug")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person to hug")
        .setRequired(true),
    ),

  async execute(interaction) {
    const user = await interaction.options.getUser("user");
    await interaction.reply(
      `https://tenor.com/view/covid-meme-cute-gif-23513805`,
    );
    await interaction.channel.send(`<@${user.id}>`);
  },
};
