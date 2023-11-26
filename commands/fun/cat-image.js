const { SlashCommandBuilder } = require("discord.js");

const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs-extra");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-cat")
    .setDescription("gives you a random image of a cat")
    // .addStringOption(option =>
    // 	option.setName('options')
    // 		.setDescription('options for the cat image')
    // 		.setRequired(true))
    // .addChoices(
    // 	{ name: 'Regular', value: 'isRegular' },
    // 	//{ name: 'Gif', value: 'isGif' },
    // 	{ name: 'Kitten', value: 'isKitten' },
    // 	{ name: 'Cute', value: 'isCute' },
    // 	{ name: 'Ugly', value: 'isUgly' },
    // 	//{ name: 'Old', value: 'isOld' },

    // ))
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("optional text for the image")
        .setRequired(false),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    //const options = interaction.options.getString('options');
    var text = interaction.options.getString("text");
    let url;
    let path;
    if (text != undefined) {
      text = text.replaceAll(" ", "%20");

      url = `https://cataas.com/cat/says/${text}`;
    } else {
      url = "https://cataas.com/cat";
    }

    const file = fs.createWriteStream("tempcat.png");
    const request = https.get(url, function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", async () => {
        path = file.path;

        file.close(); // close() is async, call cb after close completes.

        await interaction.editReply({ files: [path] });

        setTimeout(async () => {
          await fs.unlink(path);
        }, 1000);
      });
    });
  },
};
