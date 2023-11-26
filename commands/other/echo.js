const {
  SlashCommandBuilder,
  ThreadChannel,
  AttachmentBuilder,
} = require("discord.js");

const BlockedWords = ["faggot", "nigger", "beaner", "dune coon"];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("causes the bot to repeat whatever you said")
    /* 		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to echo into')
					.setRequired(true)) */

    .addStringOption((option) =>
      option
        .setName("message")
        .setDescription("the message to echo")
        .setRequired(true),
    ),
  /* .addAttachmentOption(option =>
				option.setName('file')
					.setDescription('A file to attach')), */

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    let msg = interaction.options.getString("message");
    //let channel = interaction.options.getChannel('channel');
    //let attachment = interaction.options.getAttachment('file');

    console.log(msg.length);

    if (msg.length > 2000) {
      interaction.editReply(
        "Your message is too long! Try shortening the message or splitting it up across multiple messages.",
      );
      return;
    }

    //if (msg != undefined) {
    BlockedWords.forEach((word) => {
      //console.log(word)
      if (msg.includes(word) == true) {
        let tags = "";

        for (let i = 0; i < word.length; i++) {
          tags += "#";
        }

        console.log(tags);

        msg = msg.replace(word, tags);
      }
    }); //}

    /* 		if (attachment != undefined && msg != undefined) {
			console.log(attachment)
/* 			const file = new AttachmentBuilder();
					file.setAttachment(attachment) 
			await interaction.channel.send(`${msg}`, { files: [{attachment}] });
		} else if (attachment == undefined && msg != undefined ){ */
    await interaction.deleteReply();
    await interaction.channel.send(msg);
    /* 		} else if (attachment != undefined && msg == undefined) {
						console.log(attachment)
/* 			const file = new AttachmentBuilder();
					file.setAttachment(attachment) 
							await interaction.channel.send( { files: [{attachment}] } );
		} */
  },
};
