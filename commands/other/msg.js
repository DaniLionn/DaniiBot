const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("msg")
    .setDescription("messages somebody")
    .addUserOption((option) =>
      option
        .setName("messagee")
        .setDescription("The person to message")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("what to send")
        .setRequired(true),
    ),
  // .addAttachmentOption(option =>
  //     option.setName('attachment')
  //         .setDescription('optional attachment to send')
  //         .setRequired(false))
  async execute(interaction) {
    await interaction.deferReply();
    await interaction.deleteReply();

    // const a = interaction.options.getAttachment("attachment")
    const target = interaction.options.getUser("messagee");
    // if (a != null) {
    //     console.log("file detected")

    //     const file = fs.createWriteStream(a.name);
    //     const request = https.get(a.url, function (response) {

    //         response.pipe(file);

    //         // after download completed close filestream
    //         file.on("finish", async () => {
    //             const attach = new AttachmentBuilder(file);
    //             target.send(interaction.options.getString('message'), {
    //                 files: [attach]
    //             })
    //             file.close(); // close() is async, call cb after close completes.

    //         })

    //     })

    // } else {
    target.send(interaction.options.getString("message"));
    // }
  },
};
