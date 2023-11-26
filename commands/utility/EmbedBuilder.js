const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const https = require("https");

const { dirname } = require("path");
//const { abort } = require('node:process');
const appDir = dirname(require.main.filename);

var reg = /^#([0-9a-f]{3}){1,2}$/i;

function hexStringToByteArray(hexString) {
  if (hexString.length % 2 !== 0) {
    throw "Must have an even number of hex digits to convert to bytes";
  } /* w w w.  jav  a2 s .  c o  m*/
  var numBytes = hexString.length / 2;
  var byteArray = [];
  for (var i = 0; i < numBytes; i++) {
    byteArray[i] = parseInt(hexString.substr(i * 2, 2), 16);
  }
  return byteArray;
}

//const { compare } = require('libsodium-wrappers');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("create-embed")
    .setDescription("create an embed message ")

    .addStringOption((option) =>
      option
        .setName("colour")
        .setDescription("embed colour (must be a hex colour code)")
        .setRequired(true),
    )

    .addStringOption((option) =>
      option.setName("title").setDescription("embed title").setRequired(true),
    )

    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("embed description")
        .setRequired(true),
    )

    // .addBooleanOption(option =>
    //     option
    //     .setName('add-timestamp')
    //     .setDescription('give the embed a timestamp')
    //     .setRequired(true))

    .addStringOption((option) =>
      option
        .setName("author")
        .setDescription("embed author")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("thumbnail")
        .setDescription("embed thumbnail (must be an image link)")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("field1-title")
        .setDescription("embed field1 title")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("field1-content")
        .setDescription("embed field1 content")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("field2-title")
        .setDescription("embed field2 title")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("field2-content")
        .setDescription("embed field2 content")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("field3-title")
        .setDescription("embed field3 title")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("field3-content")
        .setDescription("embed field3 content")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("image")
        .setDescription("embed image (must be an image link)")
        .setRequired(false),
    )

    .addStringOption((option) =>
      option
        .setName("footer")
        .setDescription("embed footer")
        .setRequired(false),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const exampleEmbed = new EmbedBuilder();

    if (reg.test(interaction.options.getString("colour")) === true) {
      console.log(interaction.options.getString("colour").includes("#"));

      if (interaction.options.getString("colour").includes("#")) {
        console.log("hex string has # ");

        exampleEmbed.setColor(interaction.options.getString("colour"));
      } else if (!interaction.options.getString("colour").includes("#")) {
        console.log("hex string does not have # ");
        exampleEmbed.setColor("#" + interaction.options.getString("colour"));
      }
    } else {
      exampleEmbed.setColor(0xffffff);
    }
    exampleEmbed.setTitle(interaction.options.getString("title"));

    if (interaction.options.getString("author") != undefined) {
      exampleEmbed.setAuthor({
        name: interaction.options.getString("author"),
      });
    }

    if (interaction.options.getString("description") != undefined) {
      exampleEmbed.setDescription(interaction.options.getString("description"));
    }

    if (interaction.options.getString("thumbnail") != undefined) {
      exampleEmbed.setThumbnail(interaction.options.getString("thumbnail"));
    }

    if (
      interaction.options.getString("field1-title") != undefined &&
      interaction.options.getString("field1-content") != undefined
    ) {
      exampleEmbed.addFields({
        name: interaction.options.getString("field1-title"),
        value: interaction.options.getString("field1-content"),
        inline: true,
      });
    }

    if (
      interaction.options.getString("field2-title") != undefined &&
      interaction.options.getString("field2-content") != undefined
    ) {
      exampleEmbed.addFields({
        name: interaction.options.getString("field2-title"),
        value: interaction.options.getString("field2-content"),
        inline: true,
      });
    }

    if (
      interaction.options.getString("field3-title") != undefined &&
      interaction.options.getString("field3-content") != undefined
    ) {
      exampleEmbed.addFields({
        name: interaction.options.getString("field3-title"),
        value: interaction.options.getString("field3-content"),
        inline: true,
      });
    }

    if (interaction.options.getString("image") != undefined) {
      exampleEmbed.setImage(interaction.options.getString("image"));
    }

    // if (interaction.options.getOption('add-timestamp') === true ) {
    //     exampleEmbed.setTimestamp()
    // }

    if (interaction.options.getString("footer") != undefined) {
      exampleEmbed.setFooter({
        text: interaction.options.getString("footer"),
      });
    }

    await interaction.editReply({
      embeds: [exampleEmbed],
    });
  },
};
