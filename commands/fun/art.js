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
