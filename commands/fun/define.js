const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("node:fs");
const https = require("https");

const { dirname } = require("path");
//const { abort } = require('node:process');
const appDir = dirname(require.main.filename);

//const { compare } = require('libsodium-wrappers');
module.exports = {
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription(
      "returns the definition of a word (uses a free dictionary API from https://dictionaryapi.dev/)",
    )
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("the word to define")
        .setRequired(true),
    ),
  async execute(interaction) {
    //give the bot time to think! we need to make sure we get all the data
    //console.log(appDir)
    await interaction.deferReply();

    var word = interaction.options.getString("word");
    word = word.toLowerCase();
    console.log(" ");
    console.log(`Attempting to get definition for "${word}"`);

    //DaniBot now goes "Hey man, can I have the information for [WORD]?" to the API
    //then the API should respond with "Sure thing, just gimmie a sec"

    if (word != "ohio") {
      https
        .get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
          (resp) => {
            let data = "";

            // Cue DaniBot waiting patiently for her data
            resp.on("data", (chunk) => {
              console.log(" ");
              console.log("received chunk of data!");
              data += chunk;
            });
            //Now the API hands the data over
            resp.on("end", async () => {
              console.log(" ");
              console.log("finished receiving definition!");
              // console.log(data)
              //Gotta check if we got a valid definition responce
              if (
                data !=
                `{"title":"No Definitions Found","message":"Sorry pal, we couldn't find definitions for the word you were looking for.","resolution":"You can try the search again at later time or head to the web instead."}`
              ) {
                //If so, DaniBot will interpret the data
                const result = JSON.parse(data)["0"].meanings;
                const sources = JSON.parse(data)["0"].sourceUrls;
                const partOfSpeech = result["0"].partOfSpeech;
                const definition = result["0"].definitions["0"].definition;
                const example = result["0"].definitions["0"].example;
                const synonyms = result["0"].synonyms;
                const antonyms = result["0"].antonyms;

                let partOfSpeech2;
                let definition2;
                let example2;
                let synonyms2;
                let antonyms2;

                //console.log(result["1"])

                if (result["1"] != undefined) {
                  partOfSpeech2 = result["1"].partOfSpeech;
                  definition2 = result["1"].definitions["0"].definition;
                  example2 = result["1"].definitions["0"].example;
                  synonyms2 = result["1"].synonyms;
                  antonyms2 = result["1"].antonyms;
                }

                //console.log(example)
                //console.log(synonyms)
                //console.log(antonyms)

                console.log(" ");
                console.log(partOfSpeech);
                console.log(" ");
                console.log(definition);

                const embed = new EmbedBuilder()
                  .setTitle(word)
                  .setColor(0xffffff)
                  .setImage(
                    "https://danilionn.github.io/danis-bot-website/assets/images/danibot-dictionary-v2.png",
                  )
                  .addFields({ name: partOfSpeech, value: definition });

                if (example != undefined) {
                  embed.addFields({ name: "Example:", value: example });
                }

                if (synonyms.length != 0) {
                  let s = "";

                  let length = synonyms.length;

                  console.log(`${length} synonym(s) found.`);

                  for (var i = 0; i < length; i++, (err) => console.log(err)) {
                    //console.log(`${i}/${length}`)

                    if (length > 1 && i != length - 1) {
                      s = s + synonyms[i] + ", ";
                    }
                    if (i === length - 1) {
                      s = s + synonyms[i];
                    }

                    // if (length === 1) {
                    //     s = (s + synonyms[i])
                    // };

                    //console.log('hi')
                    //console.log(synonyms[i])
                  }
                  // console.log(s)

                  embed.addFields({ name: "Synonyms:", value: s });
                }

                if (antonyms.length != 0) {
                  let a = "";

                  let length = antonyms.length;

                  console.log(`${length} antonym(s) found.`);

                  for (var i = 0; i < length; i++, (err) => console.log(err)) {
                    //console.log(`${i}/${length}`)

                    if (length > 1 && i != length - 1) {
                      a = a + antonyms[i] + ", ";
                    }
                    if (i === length - 1) {
                      a = a + antonyms[i];
                    }

                    // if (length === 1) {
                    //     a = (a + antonyms[i])
                    // };
                    //console.log('hi')
                    // console.log(antonyms[i])
                  }
                  // console.log(a)

                  embed.addFields({ name: "Antonyms:", value: a });
                }

                if (partOfSpeech2 != undefined && definition2 != undefined) {
                  embed.addFields({ name: partOfSpeech2, value: definition2 });
                }

                if (example2 != undefined) {
                  embed.addFields({ name: "Example2:", value: example2 });
                }

                if (synonyms2 && synonyms2.length != 0) {
                  let a = "";

                  let length = synonyms2.length;

                  console.log(`${length} antonym(s) found.`);

                  for (var i = 0; i < length; i++, (err) => console.log(err)) {
                    //console.log(`${i}/${length}`)

                    if (length > 1 && i != length - 1) {
                      a = a + synonyms2[i] + ", ";
                    }
                    if (i === length - 1) {
                      a = a + synonyms2[i];
                    }

                    // if (length === 1) {
                    //     a = (a + antonyms[i])
                    // };
                    //console.log('hi')
                    // console.log(antonyms[i])
                  }
                  embed.addFields({ name: "Synonyms2:", value: a });
                }

                if (antonyms2 && antonyms2.length != 0) {
                  let a = "";

                  let length = antonyms2.length;

                  console.log(`${length} antonym(s) found.`);

                  for (var i = 0; i < length; i++, (err) => console.log(err)) {
                    //console.log(`${i}/${length}`)

                    if (length > 1 && i != length - 1) {
                      a = a + antonyms2[i] + ", ";
                    }
                    if (i === length - 1) {
                      a = a + antonyms2[i];
                    }

                    // if (length === 1) {
                    //     a = (a + antonyms[i])
                    // };
                    //console.log('hi')
                    // console.log(antonyms[i])
                  }
                  embed.addFields({ name: "Antonyms2:", value: a });
                }

                embed.setFooter({ text: `Source: ${sources["0"]}` });

                //Finally! Now DaniBot can return the definition to the server that used the command
                await interaction.editReply({ embeds: [embed] });
                console.log(" ");
                console.log(`sent defininition for "${word}"!`);
              } else {
                //Uh oh, we couldn't get a definition for the word query! Let the command user know.
                await interaction.editReply(`Couldn't define "${word}"!`);
                console.log(" ");
                console.log(`Error: couldn't define "${word}"!`);
              }
            });
          },
        )
        .on("error", async (err) => {
          //Oh my, seems like an error happened whilst trying to run the command.
          //Log it to the Error Log and let the user know.
          console.log(" ");

          let s = new Date().toLocaleString();

          const read = fs.readFileSync(
            `${dirname}/ErrorLog.txt`,
            `utf-8`,
            (errr) => {
              if (errr) {
                console.log(err);
              }
            },
          );

          const data = `${read}\n${s} Command Error: ${err}`;

          console.log("Error: " + err.message);

          fs.writeFileSync(`${dirname}/ErrorLog.txt`, data, (errrr) => {
            if (errrr) {
              console.log(errrr);
            }
          });

          await interaction.editReply(
            "An error occurred whilst trying to execute this command!",
          );
        });
    } else {
      const embed = new EmbedBuilder()
        .setTitle("Ohio")
        .setColor(0xffffff)
        .setImage(
          "https://danilionn.github.io/danis-bot-website/assets/images/danibot-dictionary-v2.png",
        )
        .addFields(
          //{name: "noun", value: "Literally hell on earth. Volcanos litter the landscape. Earthquakes happen daily. The McDonalds ice cream machine is twice as broken. Conservatives. Visit with caution."},
          {
            name: "noun",
            value: `An odd way to spell "Conservative hellscape".`,
          },
          {
            name: "Example:",
            value: "Where are you going? Heaven, or Ǫ̵̧̢̛̺̻̖̜̹͎͎̟͔͒̽̓̊͑̀́̃̓̂͂̕͜ͅ ̷̱͍̰̘̘̠͐̌̈̃͊̒̊͆̆͆̒͐̏̂̈́ H̵̢̛͙̟̻̰̦̜̳͉̣̑̊̓̇͗͒̎̿̎͝ ̵̛͉̭̳̼͍̖̦̓̈̏̄̍̎̇̈̾͂̕͠͝͝ I̵̩̮͆̆̈́̓ ̶̧̞̬͉̮́̾̓̃͝ O̷̢͎̘͋̏̊͘",
          },
          { name: "Synonyms:", value: "hell" },
          { name: "Antonyms:", value: "heaven" },
        )
        .setFooter({ text: "Source: no need. you know this is true." });

      await interaction.editReply({ embeds: [embed] });
      console.log(" ");
      console.log(`sent defininition for "${word}"!`);
    }
  },
};

process.on("unhandledRejection", (error) => {
  console.log(error);
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
  });
});
