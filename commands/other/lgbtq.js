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

function chunkString(str, length) {
  return str.match(new RegExp('.{1,' + length + '}', 'g'));
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
    await interaction.deferReply();
    let searchTerm = encodeURI(interaction.options.getString("search"));
    let termData = [];

    axios
      .get(`https://en.pronouns.page/api/terms/search/${searchTerm}`)
      .then(async (data) => {
        let responseData = data.data;
        
        if (responseData.length > 0) {
          for (let i = 0; i < responseData.length; i++) {
            const element = responseData[i];

            let origin = processString(element["original"]);

            if (origin === "") {
              origin = "None listed.";
            }

            let term = processString(element["term"]);

            if (term === "") {
                term = "None listed.";
            }



            let def = processString(element["definition"]);

            if (def === "") {
                def = "None listed.";
            }

            let category = processString(element["category"]);

            if (category === "") {
                  category = "None listed.";
            }

            let author = processString(element["author"]) + " on pronouns.page";

            if (author === "") {
                    author = "None listed.";
            }


            let embed = new EmbedBuilder()
              .setTitle(`Search Results for "${searchTerm}"`)

            .addFields(
              {
                name: term,
                value: "\u200b",
              },

            );


            if (def.length <= 1024) {
              embed.addFields(
                {
                  name: "Definition",
                  value: def,
                },

              );
            } else {
              let chunks = chunkString(term, 1024);

                for (let i = 0; i < chunks.length; i++) {
                  let chunk = chunks[i];

                  if (i === 0) {
                    embed.addFields(
                      {
                        name: "Definition",
                        value: chunk,
                      },

                    );
                  } else {
                    embed.addFields(
                      {
                        name: "\u200b",
                        value: chunk,
                      },

                    );
                  }

                }
            }


            embed.addFields( 
              {
                name: "Term origin",
                value: origin,
              },

              {
                name: "Definition author",
                value: author,
              },
          )

            termData[i] = embed;
          }

          await pagination({
            client: interaction.client,
            embeds: termData,
            interaction: interaction,
            ephemeral: true,
            time: 1800000,
            customFilter: () => {
              return interaction.member.user.id == interaction.member.user.id || interaction.member.user.id != interaction.member.user.id ;
            },
            disableButtons: true,
            fastSkip: false,
            pageTravel: false,
            buttons: [
              {
                type: ButtonTypes.previous,
                label: "Previous",
                style: ButtonStyles.Primary,
              },
              {
                type: ButtonTypes.next,
                label: "Next",
                style: ButtonStyles.Success,
              },
            ],
          });

        } else {
          await interaction.editReply("No results found!")
        }
       

      });
  },
};
