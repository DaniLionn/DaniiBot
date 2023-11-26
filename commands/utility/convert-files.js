const { SlashCommandBuilder } = require("discord.js");
var ffmpeg = require("fluent-ffmpeg");
const ffmpegStatic = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegStatic);
const https = require("https");
const fs = require("fs-extra");
const { exec } = require("child_process");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("convert-file")
    .setDescription("Uses ffmpeg to convert a file")
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription("The file to convert")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("extension")
        .setDescription("The file you want to convert to")
        .setRequired(true),
    ),

  async execute(interaction) {
    const attachment = interaction.options.getAttachment("file");
    const extension = interaction.options.getString("extension");

    const name = attachment.name;
    const url = attachment.url;

    console.log("Downloading file");
    await interaction.editReply("Downloading...");

    const file = fs.createWriteStream(name);
    const request = https.get(url, function (response) {
      response.pipe(file);

      file.on("finish", async () => {
        const path = file.path;

        let path2;
        if (extension.includes(".")) {
          console.log(".");
          path2 = `${path.split(".")[0]}${extension}`;
        } else {
          path2 = `${path.split(".")[0]}.${extension}`;
        }

        console.log(path2);
        file.close();

        await interaction.editReply("Converting...");

        // Now you can use path and path2 to perform the conversion using ffmpeg.
        // Add the ffmpeg conversion logic here.
      });
    });
  },
};
