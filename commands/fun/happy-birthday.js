const { SlashCommandBuilder } = require("discord.js");

const messages = [
  "%u told me to wish %t to have a very happy birthday! :partying_face: :tada:",
  "%u hopes %t has the best birthday ever! :partying_face: :tada:",
  "Happy birthday, %t! From, %u :partying_face: :tada:",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("happy-birthday")
    .setDescription("wishes somebody a happy birthday")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The person to wish a happy birthday")
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });
    let chosenMessage = messages[Math.round(Math.random() * messages.length)];

    chosenMessage = chosenMessage.replace("%u", `<@${interaction.user.id}>`);
    chosenMessage = chosenMessage.replace(
      "%t",
      `<@${interaction.options.getUser("user").id}>`,
    );
    await interaction.deleteReply();
    interaction.channel.send(chosenMessage);
  },
};
