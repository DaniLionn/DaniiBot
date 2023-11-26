const { SlashCommandBuilder } = require("discord.js");
const https = require("https");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("creates an invite to generic vibe"),

  async execute(interaction) {
    const channel = interaction.channel.id;
    const user = interaction.user.username;
    await interaction.deferReply({ ephemeral: true });

    https.get(
      `https://daniibot.dani-lionn.repl.co/postInvite?channelID=${channel}&placeID=11138886508&name=Invite%20sent%20by%20${user}&message=<@1130288851521392750>%20wanna%20play?`,
    );
    await interaction.deleteReply();
  },
};
