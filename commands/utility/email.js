const { SlashCommandBuilder } = require("discord.js");
const email =
  require("../../assets/mymodules/commonFunctions.js").emailSomething;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("email")
    .setDescription("email me (this is probably a horrible idea)")
    .addStringOption((option) =>
      option.setName("subject").setDescription("the subject").setRequired(true),
    )
    .addStringOption((option) =>
      option.setName("body").setDescription("the email body").setRequired(true))
                     .addStringOption((option) =>
                       option.setName("recipient").setDescription("the email address to send this to").setRequired(false)),

  async execute(interaction) {

    let recipient = interaction.options.getString("recipient");

    if (!recipient) {
      recipient = process.env["RECIPIENT_EMAIL"]
    }
    
    email(
      `[AUTOMATED DANIBOT EMAIL] ${interaction.options.getString("subject")}`,
      interaction.options.getString("body") +
        `\n\n (sent by @${interaction.user.username} on Discord)`,
      recipient,
    );

    interaction.reply(
      "emailed maybe (idk i'm too lazy to add error checking lmao)",
    );
  },
};
