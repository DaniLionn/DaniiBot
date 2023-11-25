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
