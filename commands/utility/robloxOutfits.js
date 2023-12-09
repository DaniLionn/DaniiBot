const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const axios = require("axios");
const commonFunc = require("../../assets/mymodules/commonFunctions");

function onError(err) {
  console.error(err);
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName("roblox-outfits")
    .setDescription("returns an image with all of a user's outfits on roblox")
    .addIntegerOption((option) =>
      option
        .setName("user-id")
        .setDescription("the userId of the user")
        .setRequired(true),
    ),
  async execute(interaction) {
    interaction.deferReply();

    let userId = interaction.options.getInteger("user-id");

    let outfits = [];
    let imageData = [];
    let imagePaths = [];
    let urls = [];
    let names = [];
    let outfitIds = "";
    //this is promise hell omg

    console.log(userId);

    axios
      .get(
        `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
      )
      .then((data) => {
        console.log(data.data);
        let currentAvatar = data.data["data"][0]["imageUrl"];

        commonFunc.download(currentAvatar, "./").then((filePath) => {
          console.log(filePath);
          imageData[imageData.length + 1] = {
            path: filePath,
            name: "Current Avatar",
          };
          imagePaths[0] = filePath;

          axios
            .get(
              `https://avatar.roblox.com/v2/avatar/users/${userId}/outfits?page=1&itemsPerPage=50&isEditable=true`,
            )
            .then((data) => {
              outfits = data.data["data"];

              console.log(outfits);

              for (let i = 0; i < outfits.length; i++) {
                //console.log(i)
                const outfit = outfits[i];
                if (outfit) {
                  console.log(outfit);
                  names[i] = outfit["name"];
                  outfitIds = outfitIds + outfit["id"] + ",";
                }
              }

              console.log(names);

              console.log(outfitIds);

              axios
                .get(
                  `https://thumbnails.roblox.com/v1/users/outfits?userOutfitIds=${outfitIds}&size=420x420&format=Png&isCircular=false`,
                )
                .then((data) => {
                  let thumbData = data.data["data"];

                  console.log(thumbData);

                  for (let i = 0; i < thumbData.length; i++) {
                    const piece = thumbData[i];

                    if (piece["imageUrl"]) {
                      urls.push(piece["imageUrl"]);
                    } else {
                      urls.push(
                        "https://danilionn.github.io/danis-bot-website/assets/images/RBX_broken.png",
                      );
                    }
                  }
                  commonFunc
                    .downloadMultiple(urls, "./")
                    .then((filePaths) => {
                      for (let i = 0; i < filePaths.length; i++) {
                        const filePath = filePaths[i];

                        //console.log(filePath)

                        imageData[i] = {
                          path: filePath,
                          name: names[i],
                        };
                        imagePaths[i] = filePath;
                      }
                    })
                    .finally(() => {
                      console.log(imageData, imagePaths);
                      commonFunc
                        .createImageGrid(imageData)
                        .then(async (buffer) => {
                          const file = new AttachmentBuilder(buffer, {
                            name: `userOutfits_${userId}.png`,
                          });

                          await interaction.editReply({
                            files: [file],
                          });
                          commonFunc.del(imagePaths);
                        });
                    });
                })
                .catch((err) => {
                  onError(err);
                });
            })

            .catch((err) => {
              onError(err);
            });
        });
      })
      .catch((err) => {
        onError(err);
      });
  },
};
