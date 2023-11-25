const { SlashCommandBuilder } = require("discord.js");

const jokes = [
  "Why did the golfer bring two pairs of pants?\nIn case he got a hole in one.",
  "Q: What goes up and down but does not move?\nA: Stairs ",
  "Q: Why was the broom late?\nA: It over swept! ",
  "Q: Why don't traffic lights ever go swimming?\nA: Because they take too long to change!",
  "What time is it when the clock strikes 13?\nTime to get a new clock.",
  "What do you call a dog magician?\nA labracadabrador.",
  "What do you call two birds in love?\nTweethearts",
  "What building in your town has the most stories?\nThe public library.",
  "What’s worse than finding a worm in your apple?\nFinding half a worm.",
  "What is a computer's favorite snack?\nComputer chips.",
  "How do we know that the ocean is friendly?\nIt waves.",
];

const wait = require("node:timers/promises").setTimeout;

const url = "https://official-joke-api.appspot.com/random_joke";
const https = require("https");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Tells you a random joke"),

  async execute(interaction) {
    await interaction.deferReply();

    let joke;

    https.get(url, (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        console.log(" ");
        console.log("received chunk of data!");
        data += chunk;
      });

      resp.on("end", async () => {
        data = JSON.parse(data);

        let setup = data["setup"];
        let punchline = data["punchline"];

        joke = `${setup}\n${punchline}`;

        await interaction.editReply(joke);
      });
    });

    //await interaction.editReply(jokes[Math.floor(Math.random() * jokes.length)]);
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
