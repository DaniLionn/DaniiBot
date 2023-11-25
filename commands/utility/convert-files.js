const { SlashCommandBuilder } = require("discord.js");
var ffmpeg = require("fluent-ffmpeg");

const ffmpegStatic = require("ffmpeg-static");
ffmpeg.setFfmpegPath(ffmpegStatic);
const https = require("https"); // or 'https' for https:// URLs
const fs = require("fs-extra");
const { exec } = require("child_process");

(module.exports = {
  data: new SlashCommandBuilder()
    .setName("convert-file")
    .setDescription("uses ffmpeg to convert a file")
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription("the file to convert")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("extension")
        .setDescription("the file you want to convert to")
        .setRequired(true),
    ),

  async execute(interaction) {
    const attachment = interaction.options.getAttachment("file");

    const extension = interaction.options.getString("extension");

    const newName = undefined;

    const name = attachment.name;
    const url = attachment.url;
    const proxyURL = attachment.proxyURL;

    let path;
    let path2;

    console.log(name, name.split(".")[0]);

    console.log("downloading file");

    await interaction.editReply("Downloading...");

    const file = fs.createWriteStream(name);
    const request = https.get(url, function (response) {
      response.pipe(file);

      // after download completed close filestream
      file.on("finish", async () => {
        path = file.path;

        if (extension.includes(".")) {
          console.log(".");
          path2 = `${name.split(".")[0]}${extension}`;
        } else {
          path2 = `${name.split(".")[0]}.${extension}`;
        }

        console.log(path2);
        file.close(); // close() is async, call cb after close completes.

        await interaction.editReply("Converting...");
      });
    });
  },
}),
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
