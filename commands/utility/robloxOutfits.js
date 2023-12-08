const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const axios = require("axios")
const commonFunc = require("../../assets/mymodules/commonFunctions")

function onError(err) {
    console.error(err)
}


module.exports = {
  data: new SlashCommandBuilder()
    .setName("roblox-outfits")
    .setDescription("returns an image with all of a user's outfits on roblox")
    .addIntegerOption((option) =>
      option.setName("userId").setDescription("the userId of the user").setRequired(true),
    ),
  async execute(interaction) {

    interaction.deferReply();

    let userId = interaction.options.getInteger("userId")

    let outfits = []
    let imageData = []
    let imagePaths = [];
    //this is promise hell omg

    axios
      .get(
        `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
      )
      .then((data) => {
        let currentAvatar = data.body["data"]["imageUrl"];

        commonFunc
          .download(currentAvatar, "../../DanibotTempFolder")
          .then((filePath) => {
            imageData[imageData.length + 1] = {
              path: filePath,
              name: "Current Avatar",
            };
            imagePaths[imagePaths.length + 1] = filePath;
          })
          .finally(() => {
            axios
              .get(
                `https://avatar.roblox.com/v2/avatar/users/${userId}/outfits?page=1&itemsPerPage=50&isEditable=true`,
              )
              .then((data) => {
                outfits = data.body["data"];

                let outfitIds = ""
                let names = {}

                for (let i = 0; 1 < outfits.length; i++) {
                  const outfit = outfits[i];

                names[i] = outfit["name"]

                  outfitIds += `${outfit["id"]},`
                }

                axios
                  .get(
                    `https://thumbnails.roblox.com/v1/users/outfits?userOutfitIds=${outfitIds}&size=420x420&format=Png&isCircular=false`,
                  )
                  .then((data) => {

                    let thumbData = data.body["data"]

                    for (let i = 0; i < thumbData.length; i++) {
                      const piece = thumbData[i];

                      commonFunc.download(piece["imageUrl"], "../../DanibotTempFolder")
                      .then((filePath) => {
                        imageData[imageData.length + 1] = {
                          path: filePath,
                          name: names[i],
                        };    
                        imagePaths[imagePaths.length + 1] = filePath;        
                      });
                       
                    }

                    commonFunc.createImageGrid(imageData).then(async (buffer) => {
                        const file = new AttachmentBuilder(buffer, {
                          name: `userOutfits_${userId}.png`,
                        });

                        await interaction.editReply({
                          files: [file],
                        });
                    })


  

                  })
                  .catch((err) => onError);

              })
              .catch((err) => onError);
          });
      })
      .catch((err) => onError);
  },
};
