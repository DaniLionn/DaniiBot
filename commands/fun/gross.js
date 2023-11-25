const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("disgusting")
    .setDescription("eeeeeewwwwwwwwwwwwwwwwww"),

  async execute(interaction) {
    interaction.reply(
      "https://danilionn.github.io/danis-bot-website/assets/gifs/disgusting.gif",
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
