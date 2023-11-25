const { SlashCommandBuilder } = require("discord.js");
var fs = require("fs");
const https = require("https");
const { Curl } = require("node-libcurl");

const options = {
  headers: {
    "x-api-key": process.env["DATASTORE_KEY"],
  },
};

function round(num) {
  return Math.ceil(num * 100) / 100;
}

function createFile(name) {
  fs.open(name, "w", function (err) {
    if (err) console.log(err);
  });
}

function writeFile(name, content) {
  fs.writeFile(name, content, function (err) {
    if (err) console.log(err);
  });
}

function deleteFile(name) {
  fs.unlink(name, function (err) {
    if (err) console.log(err);
  });
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("get-generic-vibe-data")
    .setDescription("gets player data from generic vibe")
    .addStringOption((option) =>
      option
        .setName("user-id")
        .setDescription("the userid of the player whose data you want")
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const userId = interaction.options.getString("user-id");

    const fileName = `./DanibotTempFolder/${userId}_saveData.json`;

    https.get(
      `${process.env["DatastoreAPI_GetURL"]}${userId}%23Data`,
      options,
      (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", async () => {
          fs.open("./DanibotTempFolder/temp.json", "w", function (err) {
            if (err) console.log(err);

            fs.writeFile(
              "./DanibotTempFolder/temp.json",
              JSON.stringify(data),
              async function (err) {
                if (err) console.log(err);

                const stats = fs.statSync("./DanibotTempFolder/temp.json");

                let FinalJSON = {
                  extraInfo: {
                    httpStatus: res.statusCode,
                    userId: parseInt(userId),
                    dataSize: round(stats.size / 1000).toString() + " KB",
                  },
                  saveData: JSON.parse(data),
                };

                createFile(fileName);

                writeFile(fileName, JSON.stringify(FinalJSON, null, 4));
                await interaction.editReply({
                  files: [fileName],
                });
                deleteFile(fileName); //delete file because we don't need it anymore after sending
                deleteFile("./DanibotTempFolder/temp.json");
              },
            );
          });
        });
      },
    );
  },
};

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
