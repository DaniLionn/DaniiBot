const { SlashCommandBuilder } = require("discord.js");

function mama(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("deletes messages")
    .addNumberOption((option) =>
      option.setName("number").setDescription("1-100").setRequired(true),
    ),
  async execute(interaction) {
    await interaction.channel.messages
      .fetch({ limit: interaction.options.get("number").value })
      .then((messages) => {
        interaction.channel.bulkDelete(messages);
      });

    await interaction.reply(
      `Purged ${interaction.options.get("number").value} messages.`,
    );
    setTimeout(async () => {
      interaction.deleteReply();
    }, 1000);
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
