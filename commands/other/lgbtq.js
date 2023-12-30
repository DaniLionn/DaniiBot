const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} = require("discord.js");

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
        .addStringOption("search"),
    ),
  async execute(interaction) {
    await interaction.deferRelpy();
    let term = encodeURI(interaction.options.getString("search"));
    let termData = [];
    let currentPage = 0;

    axios
      .get(`https://en.pronouns.page/api/terms/search/${term}`)
      .then(async (data) => {
        let responseData = data.data;
        for (let i = 0; i < responseData.length; i++) {
          const element = array[i];

          let newDataEntry = [];

          newDataEntry["term"] = element["term"];
          newDataEntry["original"] = element["original"];
          newDataEntry["definition"] = element["definition"];
          newDataEntry["category"] = element["category"];

          termData[i] = newDataEntry;
        }

        const nextButton = new ButtonBuilder()
          .setCustomId("next")
          .setLabel("➡️")
          .setStyle(ButtonStyle.Primary);

        const pageDisplay = new ButtonBuilder()
          .setCustomId("page")
          .setLabel(`1/${termData.length} 📃`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true);

        const backButton = new ButtonBuilder()
          .setCustomId("back")
          .setLabel("⬅️")
          .setStyle(ButtonStyle.Primary);

        let row = new ActionRowBuilder().addComponents(
          nextButton,
          pageDisplay,
          backButton,
        );

        let embed = new EmbedBuilder().setFields(
          { name: termData[currentPage]["term"], value: "" },
          {
            name: "Definition",
            value: processString(termData[currentPage]["definition"]),
          },
          {
            name: "Term origin",
            value: processString(termData[currentPage]["original"]),
          },
          {
            name: "Category",
            value: processString(termData[currentPage]["category"]),
          },
        );

        const response = await interaction.reply({
          embeds: [embed],
          components: [row],
        });

        const collectorFilter = (i) => i.user.id === interaction.user.id;

        try {
          const confirmation = await response.awaitMessageComponent({
            filter: collectorFilter,
            time: 1_800_000,
          });

          if (confirmation.customId === "next") {
            currentPage += 1;

            if (currentPage === termData.length) {
              nextButton.setDisabled(true);
            } else {
              nextButton.setDisabled(false);
            }

            if (currentPage === 0) {
              pageDisplay.setLabel(`1/${termData.length} 📃`);
            } else {
              pageDisplay.setLabel(`${currentPage}/${termData.length} 📃`);
            }

            let embed = new EmbedBuilder().setFields(
              { name: termData[currentPage]["term"], value: "" },
              {
                name: "Definition",
                value: processString(termData[currentPage]["definition"]),
              },
              {
                name: "Term origin",
                value: processString(termData[currentPage]["original"]),
              },
              {
                name: "Category",
                value: processString(termData[currentPage]["category"]),
              },
            );

            row = new ActionRowBuilder().addComponents(
              nextButton,
              pageDisplay,
              backButton,
            );

            await confirmation.update({
              embeds: [embed],
              components: [row],
            });
          } else if (confirmation.customId === "back") {
            currentPage -= 1;

            if (currentPage === 0) {
              backButton.setDisabled(true);
            } else {
              backButton.setDisabled(false);
            }

            if (currentPage === 0) {
              pageDisplay.setLabel(`1/${termData.length} 📃`);
            } else {
              pageDisplay.setLabel(`${currentPage}/${termData.length} 📃`);
            }

            let embed = new EmbedBuilder().setFields(
              { name: termData[currentPage]["term"], value: "" },
              {
                name: "Definition",
                value: processString(termData[currentPage]["definition"]),
              },
              {
                name: "Term origin",
                value: processString(termData[currentPage]["original"]),
              },
              {
                name: "Category",
                value: processString(termData[currentPage]["category"]),
              },
            );

            row = new ActionRowBuilder().addComponents(
              nextButton,
              pageDisplay,
              backButton,
            );

            await confirmation.update({
              embeds: [embed],
              components: [row],
            });
          }
        } catch (e) {
          await interaction.deleteReply();
        }
      });
  },
};
