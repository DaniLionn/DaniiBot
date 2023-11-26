const { SlashCommandBuilder, ChannelType } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("image-message")
    .setDescription("makes your message into an image")
    .addStringOption((option) =>
      option.setName("text").setDescription("the message").setRequired(true),
    )

    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("send in this channel (optional)")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false),
    ),
  async execute(interaction) {},
};
