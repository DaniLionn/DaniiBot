const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

const {
  pagination,
  ButtonTypes,
  ButtonStyles,
} = require("@devraelfreeze/discordjs-pagination");

const axios = require("axios");

function processString(input) {
  let result = "";
  let insideHashTag = false;
  let currentHashTag = "";

  for (const char of input) {
    if (char === "{") {
      insideHashTag = false;
    } else if (char === "}") {
    } else if (char === "#") {
      insideHashTag = true;
      currentHashTag = "";
    } else if (char === "=" && insideHashTag) {
      insideHashTag = false;

      result += "";

      currentHashTag = "";
    } else if (insideHashTag) {
      currentHashTag += char;
    } else {
      result += char;
    }
  }

  return result;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lgbtq")
    .setDescription("commands for lgbtq+ related stuff")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("terminology")
        .setDescription("definitions for lgbtq+ terms")
        .addStringOption((option) =>
          option
            .setName("search")
            .setDescription("the term to get info about")
            .setRequired(true),
        ),
    ),
  async execute(interaction) {
    const response = await interaction.deferReply();
    let term = encodeURI(interaction.options.getString("search"));
    let termData = [];
    let currentPage = 0;

    axios
      .get(`https://en.pronouns.page/api/terms/search/${term}`)
      .then(async (data) => {
        let responseData = data.data;
        for (let i = 0; i < responseData.length; i++) {
          const element = responseData[i];

          let origin = processString(element["original"]);

          if (origin === "") {
            origin = "None listed.";
          }

          let embed = new EmbedBuilder()
            .setTitle(`Search Results for "${term}"`)
            .addFields(
              {
                name: processString(element["term"]),
                value: "\u200b",
              },
              {
                name: "Definition",
                value: processString(element["definition"]),
              },
              {
                name: "Term origin",
                value: origin,
              },
              {
                name: "Category",
                value: processString(element["category"]),
              },
            );

          termData[i] = newDataEntry;
        }

        await pagination({
          embeds: termData,
          author: null,
          interaction: interaction,
          ephemeral: true,
          time: 1_800_000,
          disableButtons: true,
          fastSkip: false,
          pageTravel: false,
          buttons: [
            {
              type: ButtonTypes.previous,
              label: "⬅️",
              style: ButtonStyles.Primary,
            },
            {
              type: ButtonTypes.next,
              label: "➡️",
              style: ButtonStyles.Success,
            },
          ],
        });

        await interaction.editReply({
          embeds: [embed],
          components: [row],
        });
      });
  },
};
