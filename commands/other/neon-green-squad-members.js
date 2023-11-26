const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("neon-green-squad-members")
    .setDescription("lists members in the neon green squad"),
  async execute(interaction) {
    let roleID = "1170036686722441236";
    let memberCount = interaction.guild.roles.cache.get(roleID).members.size;

    let message = memberCount + " people are in the Neon Green Squad.\n";

    interaction.guild.roles.cache.get(roleID).members.forEach((member) => {
      let user = member.displayName;

      message = message + "\n1. " + user;
    });

    await interaction.reply(message);
  },
};
