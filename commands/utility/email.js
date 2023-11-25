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
      option.setName("body").setDescription("the email body").setRequired(true),
    ),
  async execute(interaction) {
    email(
      `[AUTOMATED DANIBOT EMAIL] ${interaction.options.getString("subject")}`,
      interaction.options.getString("body") +
        `\n\n (sent by @${interaction.user.username})`,
      process.env["RECIPIENT_EMAIL"],
    );

    interaction.reply(
      "emailed maybe (idk i'm too lazy to add error checking lmao)",
    );
  },
};
const fs = require("node:fs");
process.on("unhandledRejection", (error) => {
  console.log("Error detected! Saving to error log...");
  let s = new Date().toLocaleString();
  const read = fs.readFileSync("./ErrorLog.txt", "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
  const data = `${read}\n${s}: ${error}`;
  //console.log(data)
  fs.writeFileSync("./ErrorLog.txt", data, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
    console.log("Successfully wrote error!");
  });
});
