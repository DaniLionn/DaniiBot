//========Requires========
const express = require("express");
const bodyparser = require("body-parser");
const { createCanvas, Image, GlobalFonts } = require("@napi-rs/canvas");
const {
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  AudioPlayerStatus,
} = require("@discordjs/voice");

const { readFile } = require("fs/promises");
const { request } = require("undici");
const fs = require("node:fs");
const https = require("https");
const logError = require("./logErrors.js").logErrors;

const {
  Client,
  Collection,
  Events,
  AttachmentBuilder,
  GatewayIntentBits,
  ActivityType,
  EmbedBuilder /*DiscordAPIError, ButtonBuilder, ButtonStyle, ActionRowBuilder, Attachment*/,
} = require("discord.js");
const token = process.env["DISCORD_TOKEN"];
const DatastoresAPIKey = process.env["DATASTORE_KEY"];
const {
  clientId,
  guildId,
  DaniLionnId,
  UnderDevelopment,
} = require("./configure.json");
const path = require("node:path");
const EventEmitter = require("node:events");
const { setInterval } = require("node:timers");
//=============================================

//==========Variables==========
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

const audioPlayer = createAudioPlayer({
  behaviors: {
    noSubscriber: NoSubscriberBehavior.Play,
  },
});

const emotes = (str) =>
  str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);
const activityTypes = ["PLAYING", "WATCHING", "LISTENING", "COMPETING"];
const statusTypes = ["ONLINE", "IDLE", "DND"];
const PlayingMessages = [
  "some game i enjoy",
  "a board game",
  "Roblox",
  "something very scary 👻👻👻",
  "the piano",
  "Playing Playing Playing Playing Playing Playing Playing Playing Playing Playing",
  "with a bomb",
  "with a ouija board",
  "Doubutsu no Mori (Animal Forest)",
  "Doubutsu no Mori+ (Animal Forest+)",
  "Animal Crossing GCN",
  "Doubutsu no Mori e+ (Animal Forest e+)",
  "Animal Crossing: Wild World",
  "Animal Crossing: City Folk",
  "Animal Crossing: New Leaf",
  "Animal Crossing: New Horizons",
  "Rhythm Tengoku",
  "Rhythm Heaven",
  "Rhythm Heaven Fever",
  "Rhythm Heaven Megamix",
  "Hatsune Miku: Project Diva Megamix",
  "Demon Slayer -Kimetsu no Yaibu- THe Hinokami Chronicles",
  "Pokémon Diamond",
  "Pokémon X",
  "Pokémon Ultra Sun",
  "Pokémon Legends: Arceus",
  "Pokémon Violet",
  "Pokémon Sword",
  "danibot is danihot",
];
const WatchingMessages = [
  "cat videos",
  "how 2 take over the universe",
  "idiots in cars",
  "terraria challeng videos",
  "is",
  "the",
  "Minions: Rise of Gru",
  "Gekijōban Doubutsu no Mori",
];
const ListeningMessages = [
  "music",
  "the voices in my head",
  "ghost and pals 😌",
  "Spotify",
  "new leaf's hourly soundtrack",
  "miitpoia ost",
];
const CompetingMessages = [
  `sexiest bot championships ${new Date().getFullYear()}`,
  "pipe bomb building",
  "winning your mom's heart",
];
const Reactions = [
  "😭",
  "🥺",
  "🏳‍🌈",
  "😒",
  "😡",
  "🤦‍♀️",
  "✨",
  "🤪",
  "🥰",
  "🔥",
  "😳",
  "🤩",
  "👍",
  "🤔",
  "🥔",
  "😔",
  "❤",
  "💕",
  "💔",
  "😛",
  "😎",
  "💀",
  "🤓",
  "😈",
  "🤡",
  "🤭",
  "😥",
  "1048083800590131272",
  "1056275303720296448",
];
const busyMessages = [
  "napping",
  "waiting to execute commands",
  "taking *bytes* of a digital sandwich",
  "being cool",
  "doing things",
];
const PingMessages = [
  "yes hello that's my name",
  "what do you want",
  "danibot danibot",
  "hello",
  "be quiet, i'm busy taking over the worl- i mean i'm busy %s",
  "We're no strangers to love\nYou know the rules, and so do I",
];
const Insults = [
  " your feet stink",
  " you look like a wall",
  " you look like a floor",
  "you made me wet my pants",
  " you are a mild inconvienece",
  " i slightly dislike you",
  " you look like an empty pop can",
  " yo mama so fat her belly button gets home 60 minutes before she does",
  " yo mama so stupid she thought twitter was social media",
  " YO MAMA SO FAT SHE TRIED TO EAT THE SUPERBOWL",
  " you remind me of a wet sock",
  " you're as dry as the 2 week old poo stain in the bathroom",
  " you look like a rubber ball",
  " you're as clean as the mcdonalds fry maker",
  " you stink (slightly)",
  " you smell like chiken wing",
  " you look like microwave",
  " you're about as useful as a shattered light bulb",
  "you smell as good as a wet napkin",
  "you are a fire truckS",
];
const COmplimens = [
  "you smell slightly better than usual",
  "you're as clean as my fresh load of laundry",
  "your personality is so wet! (thanks duck)",
  "you look more human than usual",
  "you remind me of canned beans" /*"you're not as dumb as you look"*/,
  ,
  "you have really nice veins 🥰" /*"you're so charming when you make an effort.", "you're pretty…\non the inside.", "i don't care what others say about you.\nyou're alright in my book.", "i love how you just don't care what anyone thinks of you."*/,
  ,
  "you smell as good as this cupcake i ate last week",
  "your hair smells good",
  "you're disgusting in a cute way 🥰",
  "you have attractive ribs 🥰",
];
const emojiPool = [];
const PingLimit = 7;
const PingCooldown = 15 * 1000;
const emojiCharacters = require("./assets/emojiStuff/emojiCharacters.js");
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

var canPing = true;
var CurrnentTimeout = undefined;
var pingNumber = 0;
var emojiList = require("emoji.json");
var canAnnoy = false;

var changeStatusLoop;
//=============================================

//--variables no longer needed but i'm too lazy to remove lol--

//const KoTFGeneral = client.channels.cache.get('1032095616836325398');
// const RandomMessages = ['haha', 'shut up', 'no u', 'rip bozo', 'L']
//const crayonColours = ["orange", "green", "purple", "pink", "brown", "black", "white"]
// const MariMessages = [" is my best friend we watch my little pony together and colour in colouring books", " you're my best friend :blush:", " i ate all the %c crayons"]
// const reply = ["hello", "yo", " hey how are you doing", "heyy", "i am dani bot", "😱", "😀", "yo yo waffle stick i really think you smell like wooden flooring with cheese involved", "afosdklfbmdskjlfvkjnmakjwlfsdvnmdjlk;fdvjnm,zjldk;vjnm zdkjlkvnmc,m", "Unfortunately you'd better stop with that popcorn mess of the butter, so that you could have it for a movie theater actually, so that you could drink a soda and then eat a candy and then-- burp Excuse me. Eat popcorn. So- grunt I was in a movie theater and I eat popcorn with a- seasoning cheese- and then, I drink a cherry sprite in the movie theater. And that was ago when I was actually well about that. Plus I would rather- eat chocolate, as well. So, that butter mess; clean it up please. So, I don't wanna cause any more troublemakers.", "hi"]
//const GayMessages = ['yes i am :smiley:', 'no u :rage:', 'you\'re gay too, i can smell it (you smell like fruit that\'s how i can tell)'];
// const port3 = 80
//const keep_alive = require('./keep_alive.js')
// const emojiRegex = require('emoji-regex/RGI_Emoji.js');
// const audios = ['./postable-assets/fart.mp3', './postable-assets/janky-ass-music.mp3', './postable-assets/mimimimimimi.mp3', './postable-assets/laugh.mp3', './postable-assets/amog.mp3', './postable-assets/alert.mp3', './postable-assets/arooga.mp3', './postable-assets/BANG.mp3', './postable-assets/bluekid.mp3', './postable-assets/cough.mp3', './postable-assets/fart.mp3', './postable-assets/omg.mp3', , './postable-assets/omg2.mp3', './postable-assets/poop.mp3', './postable-assets/run.mp3', './postable-assets/scary.mp3', './postable-assets/scream.mp3']

// var currentAudioPlayer
// var CurrentAuudioConnection
// var canPlaySounds = false
// var CurrentSubscription
// var audioresources = []

// let currentUniverseId = 0
//let messages = []
//=================================

GlobalFonts.registerFromPath(
  "./assets/fonts/ArialRoundedMTBold.ttf",
  "arial-rounded-bold",
);
EventEmitter.setMaxListeners(100);
client.commands = new Collection();

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
      );
    }
  }
}

// async function updateDatastore(universeId, message, user, channel, channelid, server, serverid) {

//   messages.unshift([message, user, [channel, channelid],
//     [server, serverid]
//   ])

//   const ds = new OpenCloudDataStore(universeId, "Messages", "global")

//   ds.authenticate("")

//   ds.set("Messages", messages)
// }

function setBotStatus() {
  // Function that gives the bot a random status based on the tables above

  const activity =
    activityTypes[Math.floor(Math.random() * activityTypes.length)];

  if (activity === "PLAYING") {
    const randomMessage =
      PlayingMessages[Math.floor(Math.random() * PlayingMessages.length)];
    client.user.setActivity(randomMessage, {
      type: ActivityType.Playing,
    });
  }

  if (activity === "WATCHING") {
    const randomMessage =
      WatchingMessages[Math.floor(Math.random() * WatchingMessages.length)];
    client.user.setActivity(randomMessage, {
      type: ActivityType.Watching,
    });
  }

  if (activity === "LISTENING") {
    const randomMessage =
      ListeningMessages[Math.floor(Math.random() * ListeningMessages.length)];
    client.user.setActivity(randomMessage, {
      type: ActivityType.Listening,
    });
  }

  if (activity === "COMPETING") {
    const randomMessage =
      CompetingMessages[Math.floor(Math.random() * CompetingMessages.length)];
    client.user.setActivity(randomMessage, {
      type: ActivityType.Competing,
    });
  }

  setTimeout(() => {
    const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];

    let random = Math.floor(Math.random() * 3);

    if (random === 0) {
      if (status === "ONLINE") {
        client.user.setStatus("online");
      }

      if (status === "DND") {
        client.user.setStatus("dnd");
      }

      if (status === "IDLE") {
        client.user.setStatus("idle");
      }
    }
  }, 1500);
}

function writeCOmmandsLog(interaction) {
  let s = getTimestamp();
  const read = fs.readFileSync("./CommandsLogg.txt", "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
  const command = interaction.commandName;

  const data = `${read}\n${s}: Command ${command} used by ${interaction.user.tag}!`;
  //console.log(data)
  fs.writeFileSync("./CommandsLogg.txt", data, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
  });
}

function setBotStatus2(KEY) {
  // Function that gives the bot a random status based on the tables above

  if (KEY === "NONE") {
    const activity =
      activityTypes[Math.floor(Math.random() * activityTypes.length)];

    if (activity === "PLAYING") {
      const randomMessage =
        PlayingMessages[Math.floor(Math.random() * PlayingMessages.length)];
      client.user.setActivity(randomMessage, {
        type: ActivityType.Playing,
      });
    }

    if (activity === "WATCHING") {
      const randomMessage =
        WatchingMessages[Math.floor(Math.random() * WatchingMessages.length)];
      client.user.setActivity(randomMessage, {
        type: ActivityType.Watching,
      });
    }

    if (activity === "LISTENING") {
      const randomMessage =
        ListeningMessages[Math.floor(Math.random() * ListeningMessages.length)];
      client.user.setActivity(randomMessage, {
        type: ActivityType.Listening,
      });
    }

    if (activity === "COMPETING") {
      const randomMessage =
        CompetingMessages[Math.floor(Math.random() * CompetingMessages.length)];
      client.user.setActivity(randomMessage, {
        type: ActivityType.Competing,
      });
    }
  }

  if (KEY === "PLAYING") {
    const randomMessage =
      PlayingMessages[Math.floor(Math.random() * PlayingMessages.length)];
    client.user.setActivity(randomMessage, {
      type: ActivityType.Playing,
    });
  }

  if (KEY === "WATCHING") {
    const randomMessage =
      WatchingMessages[Math.floor(Math.random() * WatchingMessages.length)];
    client.user.setActivity(randomMessage, {
      type: ActivityType.Watching,
    });
  }

  if (KEY === "COMPETING") {
    const randomMessage =
      CompetingMessages[Math.floor(Math.random() * CompetingMessages.length)];
    client.user.setActivity(randomMessage, {
      type: ActivityType.Competing,
    });
  }

  if (KEY === "LISTENING") {
    const randomMessage =
      ListeningMessages[Math.floor(Math.random() * ListeningMessages.length)];
    client.user.setActivity(randomMessage, {
      type: ActivityType.Listening,
    });
  }
}

function getRobloxStatus(lastStatus, channelID) {
  https.get(
    `https://4277980205320394.hostedstatus.com/1.0/status/59db90dbcdeb2f04dadcf16d`,
    (resp) => {
      let data = "";

      resp.on("data", (chunk) => {
        data += chunk;
      });

      resp.on("end", async () => {
        const result = JSON.parse(data);

        let status_overall = result["result"]["status_overall"]["status"];
        let full_status = result["result"]["status"];

        if (status_overall != lastStatus) {
          const StatusEmbed = new EmbedBuilder()
            .setColor(0xffffff)
            .setTitle("<@1133561883144757328> ROBLOX STATUS UPDATE")
            .setURL("https://status.roblox.com")
            .setDescription(`Current Status: ${status_overall}`)
            .addFields(
              {
                name: full_status[0]["name"],
                value: full_status[0]["status"],
              },
              {
                name: full_status[0]["containers"][0]["name"],
                value: full_status[0]["containers"][0]["status"],
              },
              {
                name: full_status[0]["containers"][1]["name"],
                value: full_status[0]["containers"][1]["status"],
                inline: true,
              },
              {
                name: full_status[0]["containers"][2]["name"],
                value: full_status[0]["containers"][2]["status"],
                inline: true,
              },
              {
                name: full_status[0]["containers"][3]["name"],
                value: full_status[0]["containers"][3]["status"],
                inline: true,
              },

              {
                name: full_status[1]["name"],
                value: full_status[1]["status"],
              },
              {
                name: full_status[1]["containers"][0]["name"],
                value: full_status[1]["containers"][0]["status"],
              },
              {
                name: full_status[1]["containers"][1]["name"],
                value: full_status[1]["containers"][1]["status"],
                inline: true,
              },
              {
                name: full_status[1]["containers"][2]["name"],
                value: full_status[1]["containers"][2]["status"],
                inline: true,
              },
              {
                name: full_status[1]["containers"][3]["name"],
                value: full_status[1]["containers"][3]["status"],
                inline: true,
              },
              {
                name: full_status[1]["containers"][4]["name"],
                value: full_status[1]["containers"][4]["status"],
                inline: true,
              },

              {
                name: full_status[2]["name"],
                value: full_status[2]["status"],
              },
              {
                name: full_status[2]["containers"][0]["name"],
                value: full_status[2]["containers"][0]["status"],
              },
              {
                name: full_status[2]["containers"][1]["name"],
                value: full_status[2]["containers"][1]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][2]["name"],
                value: full_status[2]["containers"][2]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][3]["name"],
                value: full_status[2]["containers"][3]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][4]["name"],
                value: full_status[2]["containers"][4]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][5]["name"],
                value: full_status[2]["containers"][5]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][6]["name"],
                value: full_status[2]["containers"][6]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][7]["name"],
                value: full_status[2]["containers"][7]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][8]["name"],
                value: full_status[2]["containers"][8]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][9]["name"],
                value: full_status[2]["containers"][9]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][10]["name"],
                value: full_status[2]["containers"][10]["status"],
                inline: true,
              },
              {
                name: full_status[2]["containers"][11]["name"],
                value: full_status[2]["containers"][11]["status"],
                inline: true,
              },
            );

          client.channels.cache.get(channelID).send({
            embeds: [StatusEmbed],
          });
          lastStatus = status_overall;
          console.log(status_overall);
        }
      });
    },
  );
}

function getTimestamp() {
  const date = new Date();
  const stamp = date.toLocaleString("en-US", {
    timeZone: process.env["TIMESTAMP_LOCATION"],
  });

  return stamp;
}

function writeError(error) {
  logError(error, "./ErrorLog.txt");
}

const applyText = (canvas, text) => {
  const context = canvas.getContext("2d");
  let fontSize = 70;

  do {
    context.font = `${(fontSize -= 10)}px Courier New`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};

const applyText2 = (canvas, text) => {
  const context = canvas.getContext("2d");
  let fontSize = 32;

  do {
    context.font = `${(fontSize -= 10)}px Courier New`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;
};

async function createWelcomeGraphic(guildID, channelID, message, user, member) {
  const stamp = getTimestamp();

  const fileName = `${user.username}-avatarCard-${stamp}.png`;

  console.log(
    `Creating avatar card for ${member.displayName} (${user.username}) with message ${message} in server ${guildID} channel ${channelID}`,
  );

  const canvas = createCanvas(700, 250);
  const context = canvas.getContext("2d");

  let background;
  let main;

  if (guildID === "1134908713078095933") {
    background = await readFile("./tamari.jpg");
    main = "#DFFF00";
  } else {
    background = await readFile("./regular.jpg");
    main = "#FFFFFF";
  }

  const backgroundImage = new Image();
  backgroundImage.src = background;
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  context.font = applyText2(canvas, message);
  context.fillStyle = "#ffffff";
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.strokeText(message, canvas.width / 2.5, canvas.height / 3.5);
  context.fillText(message, canvas.width / 2.5, canvas.height / 3.5);

  context.font = applyText(canvas, `${member.displayName}`);
  context.fillStyle = main;
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.strokeText(
    `${member.displayName}`,
    canvas.width / 2.5,
    canvas.height / 1.8,
  );
  context.fillText(
    `${member.displayName}`,
    canvas.width / 2.5,
    canvas.height / 1.8,
  );

  context.beginPath();
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  const { body } = await request(
    user.displayAvatarURL({
      format: "jpg",
    }),
  );
  const avatar = new Image();
  avatar.src = Buffer.from(await body.arrayBuffer());
  context.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
    name: fileName,
  });

  client.channels.cache.get(channelID).send({
    files: [attachment],
  });
}

async function systemessage(guildID, channelID, message, user, member) {
  const stamp = getTimestamp();

  const fileName = `${user.username}-systemMessage-${stamp}.png`;

  const canvas = createCanvas(700, 250);
  const context = canvas.getContext("2d");

  let background;
  let main;

  if (guildID === "1134908713078095933") {
    background = await readFile("./assets/images/tamari.jpg");
    main = "#DFFF00";
  } else {
    background = await readFile("./assets/images/regular.jpg");
    main = "#FFFFFF";
  }

  const backgroundImage = new Image();
  backgroundImage.src = background;
  context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

  context.font = applyText2(canvas, `Message from ${member.displayName}.`);
  context.fillStyle = "#ffffff";
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.strokeText(
    `Message from ${member.displayName}.`,
    canvas.width / 2.5,
    canvas.height / 3.5,
  );
  context.fillText(
    `Message from ${member.displayName}.`,
    canvas.width / 2.5,
    canvas.height / 3.5,
  );

  context.font = applyText(canvas, message);
  context.fillStyle = main;
  context.strokeStyle = "black";
  context.lineWidth = 6;
  context.strokeText(message, canvas.width / 2.5, canvas.height / 1.8);
  context.fillText(message, canvas.width / 2.5, canvas.height / 1.8);

  context.beginPath();
  context.arc(125, 125, 100, 0, Math.PI * 2, true);
  context.closePath();
  context.clip();

  const { body } = await request(
    user.displayAvatarURL({
      format: "jpg",
    }),
  );
  const avatar = new Image();
  avatar.src = Buffer.from(await body.arrayBuffer());
  context.drawImage(avatar, 25, 25, 200, 200);

  const attachment = new AttachmentBuilder(canvas.toBuffer("image/png"), {
    name: fileName,
  });

  client.channels.cache.get(channelID).send({
    files: [attachment],
  });
}

client.once(Events.ClientReady, (c) => {
  // Startup stuff

  const deploy = require("./deploy-commands.js");
  //const deploy2 = require('./deploy-local-commands.js')

  console.log(`Ready! Logged in as ${c.user.tag}`);
  if (UnderDevelopment === false) {
    setBotStatus();
  } else {
    client.user.setActivity(
      "🔨 Bot currently under development. Commands might not be executed due to frequent restarting.",
      {
        type: ActivityType.Playing,
      },
    );
  }

  for (var emojitype in emojiList) {
    emojiPool.push(emojiList[emojitype]["char"]);
  }
  client.guilds.cache.get(guildId).emojis.cache.forEach((emoji) => {
    emojiPool.push(emoji.id);
  });

  // Call random status function
  // 	let s = new Date().toLocaleString();
  // 	console.log(s)

  // 	let split1 = s.split(",")
  // 	console.log(split1)
  // 	let split2 = split1[0].split("/")
  // 	console.log(split2)

  // 	if (s.includes("10/19")) {
  // 		console.log("danibot bday!!")
  // 		client.user.setAvatar('./DaniBotBirthdayPFP.png');
  // 		client.channels.cache.get('1032095616836325398').send("hey guys!! today is my birthday!!!")}

  // 		else if ((Number(split2[0]) === 12 && (Number(split2[1]) >= 17 && Number(split2[1]) <= 25)) || (Number(split2[0]) === 1 && (Number(split2[1]) >= 1 && Number(split2[1]) <= 5))) {
  // 			console.log("christmas")
  // 			client.user.setAvatar('./DaniBotChristmasPFP.png');

  // 	}

  // 	else if ((Number(split2[0]) === 12 && (Number(split2[1]) >= 26 && Number(split2[1]) <= 31))) {
  // 		console.log("new years")
  // 		client.user.setAvatar('./DaniBotBirthdayPFP.png');

  // }

  // 		else if (Number(split2[0]) === 10 && (Number(split2[1]) >= 24 && Number(split2[1]) <= 31)) {
  // 			console.log("halloween")
  // 			client.user.setAvatar('./DaniBotHalloweenPFP.png');

  // 	}

  // 	else if (Number(split2[0]) === 6 && (Number(split2[1]) >= 1 && Number(split2[1]) <= 30)) {
  // 		console.log("pride month")
  // 		client.user.setAvatar('./DaniBotPrideMonthPFP.png');
  // 	} else if (Number(split2[0]) === 7 && (Number(split2[1]) === 1)) {
  // 		console.log("canada day")
  // 		client.user.setAvatar('./DaniBotCanadaDayPFP.png');}
  // 	else {
  // 		client.user.setAvatar('./DaniBotPFP.png');
  // 	}

  //testStatusGet()

  let lastStatus = "Operational";

  setInterval(() => {
    try {
      getRobloxStatus(lastStatus, "1168669731482521671");
    } catch (err) {
      writeError(err);
    }
  }, 180000);

  if (UnderDevelopment === false) {
    changeStatusLoop = setInterval(setBotStatus, 420000); // Calls setBotStatus() every 7 minutes
  }
});

async function playNextInQueue(connection, queue, message) {
  while (queue.length > 0) {
    const nextItem = queue.shift();
    const { audioResource, info } = nextItem;

    if (!changeStatusLoop == null) {
      clearInterval(changeStatusLoop);
    }

    client.user.setActivity({
      name: `"${info.audioName} " in server ${info.serverName}'s  "${info.channelName}" voice channel`,
      type: "LISTENING",
    });

    audioPlayer.play(audioResource);
    connection.subscribe(audioPlayer);

    // Wait for the audio to finish playing
    await new Promise((resolve) => {
      const checkStatus = setInterval(() => {
        if (audioPlayer.state.status === AudioPlayerStatus.Idle) {
          clearInterval(checkStatus);
          setTimeout(() => {
            resolve();
          }, 5000);
        }
      }, 1000); // Check every second
    });
  }

  setBotStatus();
  changeStatusLoop = setInterval(setBotStatus, 420000); //
  message.reply("Done playing.");
}
const queues = new Map();

client.on("messageCreate", async (message) => {
  if (message.channelId == "1168723486655647744") {
    let emoji = emojiPool[Math.floor(Math.random() * emojiPool.length)];
    try {
      await message.react(emoji);
    } catch (error) {
      await message.react("1168734317464272966");
    }
  }

  const voiceChannel = message.member.voice.channel;

  if (message.content.toLowerCase() === "!play") {
    if (!voiceChannel) {
      return message.reply(
        "You need to be in a voice channel to use this command!",
      );
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const attachments = message.attachments.filter(
        (attachment) => (attachment.contentType = "audio/mpeg"),
      );

      if (attachments.size === 0) {
        return message.reply(
          "Please attach at least one valid .mp3 file to play.",
        );
      }

      if (!queues.has(message.guild.id)) {
        queues.set(message.guild.id, []);
      }

      const queue = queues.get(message.guild.id);

      attachments.forEach(async (attachment) => {
        const audioResource = createAudioResource(attachment.url, {
          inputType: StreamType.Arbitrary,
        });

        queue.push({
          audioResource,
          info: {
            audioName: attachment.name,
            serverName: message.guild.name,
            channelName: voiceChannel.name,
          },
        });

        if (
          !audioPlayer.state.status ||
          audioPlayer.state.status === AudioPlayerStatus.Idle
        ) {
          playNextInQueue(connection, queue, message);
        }
      });

      message.reply(`Now playing ${attachments.size} MP3 files.`);
    } catch (error) {
      console.error(error);
      message.reply(
        "There was an error while trying to join the voice channel.",
      );
    }
  } else if (message.content.toLowerCase() === "!stop") {
    if (!voiceChannel) {
      return message.reply(
        "You need to be in a voice channel to use this command!",
      );
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      connection.destroy();
      queues.delete(message.guild.id);
      client.user.setActivity({ name: "Nothing", type: "LISTENING" }); // Reset the activity
      message.reply("Playback stopped, and the bot left the voice channel.");
    } catch (error) {
      console.error(error);
      message.reply("There was an error while trying to stop the playback.");
    }
  } else if (message.content.toLowerCase() === "!next") {
    if (!voiceChannel) {
      return message.reply(
        "You need to be in a voice channel to use this command!",
      );
    }

    try {
      const connection = joinVoiceChannel({
        channelId: voiceChannel.id,
        guildId: voiceChannel.guild.id,
        adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

      const queue = queues.get(message.guild.id);

      if (!queue || queue.length === 0) {
        return message.reply("There are no songs in the queue.");
      }

      audioPlayer.stop();
      message.reply("Skipped to the next song in the queue.");

      audioPlayer.once(AudioPlayerStatus.Idle, () => {
        playNextInQueue(connection, queue, message);
      });
    } catch (error) {
      console.error(error);
      message.reply(
        "There was an error while trying to skip to the next song.",
      );
    }
  }

  if (message.content.includes("<@1032426388457787402>")) {
    if (message.author.id == "1032426388457787402") {
      //message.reply("hii bestieee :blush:")
    } else {
      if (canPing === true) {
        pingNumber += 1;
        console.log(`Count ${pingNumber}`);

        if (CurrnentTimeout != undefined) {
          clearTimeout(CurrnentTimeout);
        }

        CurrnentTimeout = setTimeout(async () => {
          pingNumber = 0;
          console.log("cooldown reset");
          CurrnentTimeout = undefined;
        }, 5 * 1000);

        if (pingNumber > PingLimit - 1) {
          if (CurrnentTimeout != undefined) {
            clearTimeout(CurrnentTimeout);
          }
          //await client.user.setAvatar('./DaniBotAngryPFP.png');
          await message.reply("stop pinging me :rage::rage::rage:");
          canPing = false;
          console.log("ping limit reached");
          setTimeout(async () => {
            pingNumber = 0;
            console.log("cooldown reset");
            //await  client.user.setAvatar('./DaniBotPFP.png');
            await client.channels.cache
              .get("1032095616836325398")
              .send(`sorry for getting angry i forgive you guys now`);
          }, PingCooldown);
          return;
        }

        var response =
          PingMessages[Math.floor(Math.random() * (PingMessages.length - 1))];
        let random = Math.floor(Math.random() * 30);
        console.log(`Random ${random}`);
        if (
          response ===
          "be quiet, i'm busy taking over the worl- i mean i'm busy %s"
        ) {
          response = response.replace(
            "%s",
            busyMessages[Math.floor(Math.random() * busyMessages.length)],
          );
        }

        if (random === 30) {
          response = PingMessages[6];
        }
        message.reply(response);
      }
    }
  }

  if (message.content.includes("-del")) {
    if (!message.content.includes("https://")) {
      setTimeout(() => {
        message.delete();
      }, 125);
    }
  }

  /*     if ((message.author.id != clientId)) {
          if  (message.guild.id === guildId) {
      const randomChance = Math.floor(Math.random() * 10);
      if (randomChance === 1) {

      message.react(Reactions[Math.floor(Math.random() * Reactions.length)]);

      }}}; */

  if (canAnnoy === true) {
    if (message.content.includes("<@599641108116406300>")) {
      message.delete();

      return;
    }

    if (message.author.id != clientId) {
      const mesg = message.content;

      console.log(mesg);

      message.channel.send(mesg);
    }
  }
});

// setInterval(() => {
//     if ( client.guilds.cache.get("1168382484069744671").members.cache.get("752903262046519327").roles.cache.has("1170036686722441236")) {
//         client.guilds.cache.get("1168382484069744671").members.cache.get("752903262046519327").roles.remove("1170036686722441236")
//     }
// }, 1000)

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (canPing === true) {
    const command = client.commands.get(interaction.commandName);

    writeCOmmandsLog(interaction);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`,
      );
      return;
    }

    if (interaction.commandName === "annoy-on") {
      if (interaction.user.id == "599641108116406300") {
        canAnnoy = true;
        interaction.reply("annoy mode on");
      } else {
        interaction.reply("you aren't dani idiot");
      }
    }

    if (interaction.commandName === "annoy-off") {
      interaction.reply("annoy mode off");
      canAnnoy = false;
    }

    if (interaction.commandName === "bug-report") {
      https.get(
        `${process.env["bugReportURL"]}?title=${encodeURI(
          interaction.options.getString("title"),
        )}&report=${encodeURI(
          interaction.options.getString("report"),
        )}&user=${encodeURI(interaction.user.username)}`,
        (res) => {},
      );
    }

    if (interaction.commandName === "avatar-card") {
      await interaction.deferReply();

      let msg;

      if (interaction.options.getString("text")) {
        msg = interaction.options.getString("text");
      } else {
        msg = "";
      }
      createWelcomeGraphic(
        interaction.guildId,
        interaction.channelId,
        msg,
        interaction.user,
        interaction.member,
      );

      await interaction.deleteReply();
    }

    if (interaction.commandName === "image-message") {
      await interaction.deferReply();

      let msg;

      let channel;

      if (interaction.options.getString("text")) {
        msg = interaction.options.getString("text");
      } else {
        msg = "";
      }

      if (interaction.options.getChannel("channel")) {
        channel = interaction.options.getChannel("channel").id;
      } else {
        channel = interaction.channelId;
      }

      systemessage(
        interaction.guildId,
        channel,
        msg,
        interaction.user,
        interaction.member,
      );

      await interaction.deleteReply();
    }

    if (interaction.commandName === "test") {
      await interaction.deferReply();

      createWelcomeGraphic(
        interaction.guildId,
        interaction.guild.systemChannelId,
        "Welcome! (Test)",
        interaction.user,
        interaction.member,
      );

      await interaction.deleteReply();
    }

    /*if (interaction.commandName === 'ping')
    {
      await interaction.reply('Pong!');

    }*/

    if (interaction.commandName === "random-react") {
      await interaction.deferReply({
        ephemeral: true,
      });
      const msgs = interaction.channel.messages.fetch({
        limit: 2,
      });
      const message = (await msgs).at(1);

      message.react(Reactions[Math.floor(Math.random() * Reactions.length)]);

      interaction.deleteReply();
    }

    /*     if (interaction.commandName === 'react') {
            await interaction.deferReply({ephemeral: true});


            const re = emojiRegex();
            let match;
            let emojis = [];
            while ((match = re.exec(message.content)) != null) {
              emojis.push(match[0]);
            }

            interaction

         } */

    if (interaction.commandName === "ping") {
      await interaction.reply({
        content: `Websocket heartbeat: ${client.ws.ping}ms.`,
        ephemeral: true,
      });
    }

    // if (interaction.commandName === 'connect')
    // {

    // 	if (interaction.guild.id === "1078429734536486924") {

    // 		CurrentAuudioConnection = joinVoiceChannel(
    // 		{
    // 			channelId: "1078429735425691681",
    // 			guildId: "1078429734536486924",
    // 			adapterCreator: client.guilds.cache.get("1078429734536486924").voiceAdapterCreator,
    // 			selfDeaf: false,
    // 		});
    // 	} else

    // 	if (interaction.guild.id === "1032095616219754576") {

    // 	CurrentAuudioConnection = joinVoiceChannel(
    // 	{
    // 		channelId: "1032095616836325399",
    // 		guildId: "1032095616219754576",
    // 		adapterCreator: client.guilds.cache.get("1032095616219754576").voiceAdapterCreator,
    // 		selfDeaf: false,
    // 	});
    // } else if (interaction.guild.id === "1116526117348720661") {
    // 	CurrentAuudioConnection = joinVoiceChannel(
    // 		{
    // 			channelId: "1116526118510530624",
    // 			guildId: "1116526117348720661",
    // 			adapterCreator: client.guilds.cache.get("1116526117348720661").voiceAdapterCreator,
    // 			selfDeaf: false,
    // 		});

    // } else {
    // 			CurrentAuudioConnection = joinVoiceChannel(
    // 		{
    // 			channelId: "946797124824203308",
    // 			guildId: "946797124824203304",
    // 			adapterCreator: client.guilds.cache.get("946797124824203304").voiceAdapterCreator,
    // 			selfDeaf: false,
    // 		});
    // }
    // 	currentAudioPlayer = createAudioPlayer(
    // 	{
    // 		behaviors:
    // 		{
    // 			noSubscriber: NoSubscriberBehavior.Pause,
    // 		},
    // 	});

    // 	canPlaySounds = true

    // 	interaction.reply("Connected to the voice channel")

    // 	if (canPlaySounds === true)
    // 	{

    // 		let resource =  createAudioResource(audios[Math.floor(Math.random() * audios.length)])

    // 		 CurrentSubscription = CurrentAuudioConnection.subscribe(currentAudioPlayer);

    // 		console.log("playing")
    // 		currentAudioPlayer.play(resource);

    // 		resource

    // 		const play = setInterval(() =>
    // 		{

    // 			if (canPlaySounds === false) {

    // 				clearInterval(play)

    // 			}

    // 			let resource = createAudioResource(audios[Math.floor(Math.random() * audios.length)])

    // 			console.log("playing")
    // 			currentAudioPlayer.play(resource);

    // 		}, 15000);

    // 		currentAudioPlayer.on('error', error => {
    // 			console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
    // 			//resource = createAudioResource(audios[Math.floor(Math.random() * audios.length)])
    // 		});

    // 	}

    // }
    // if (interaction.commandName === 'disconnect')
    // {

    // 	currentAudioPlayer.stop()
    // 	canPlaySounds = false
    // 	CurrentAuudioConnection.destroy()
    // 	CurrentSubscription.unsubscribe()

    // 	interaction.reply("Disconnected from the voice channel")

    // }

    if (interaction.commandName === "change-status") {
      console.log("changing sttus");

      if (interaction.user.id === DaniLionnId) {
        const type = interaction.options.getString("type");

        console.log(type);

        setBotStatus2(type);

        await interaction.reply({
          content: "Bot status switched!",
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: "Sorry, but this command is reserved for dani only.",
          ephemeral: true,
        });
      }
    }

    if (interaction.commandName === "emojify") {
      await interaction.deferReply();

      const str = interaction.options.getString("message").toLowerCase();

      // console.log(str)

      var finalMessage = " ";
      for (let i = 0; i < str.length; i++) {
        const letter = str[i];

        if (letter === "a") {
          finalMessage = finalMessage.concat([emojiCharacters.a]);
        }

        if (letter === "b") {
          finalMessage = finalMessage.concat([emojiCharacters.b]);
        }

        if (letter === "c") {
          finalMessage = finalMessage.concat([emojiCharacters.c]);
        }

        if (letter === "d") {
          finalMessage = finalMessage.concat([emojiCharacters.d]);
        }

        if (letter === "e") {
          finalMessage = finalMessage.concat([emojiCharacters.e]);
        }

        if (letter === "f") {
          finalMessage = finalMessage.concat([emojiCharacters.f]);
        }

        if (letter === "g") {
          finalMessage = finalMessage.concat([emojiCharacters.g]);
        }

        if (letter === "h") {
          finalMessage = finalMessage.concat([emojiCharacters.h]);
        }

        if (letter === "i") {
          finalMessage = finalMessage.concat([emojiCharacters.i]);
        }

        if (letter === "j") {
          finalMessage = finalMessage.concat([emojiCharacters.j]);
        }

        if (letter === "k") {
          finalMessage = finalMessage.concat([emojiCharacters.k]);
        }

        if (letter === "l") {
          finalMessage = finalMessage.concat([emojiCharacters.l]);
        }

        if (letter === "m") {
          finalMessage = finalMessage.concat([emojiCharacters.m]);
        }

        if (letter === "n") {
          finalMessage = finalMessage.concat([emojiCharacters.n]);
        }

        if (letter === "o") {
          finalMessage = finalMessage.concat([emojiCharacters.o]);
        }

        if (letter === "p") {
          finalMessage = finalMessage.concat([emojiCharacters.p]);
        }

        if (letter === "q") {
          finalMessage = finalMessage.concat([emojiCharacters.q]);
        }

        if (letter === "r") {
          finalMessage = finalMessage.concat([emojiCharacters.r]);
        }

        if (letter === "s") {
          finalMessage = finalMessage.concat([emojiCharacters.s]);
        }

        if (letter === "t") {
          finalMessage = finalMessage.concat([emojiCharacters.t]);
        }

        if (letter === "u") {
          finalMessage = finalMessage.concat([emojiCharacters.u]);
        }

        if (letter === "v") {
          finalMessage = finalMessage.concat([emojiCharacters.v]);
        }

        if (letter === "w") {
          finalMessage = finalMessage.concat([emojiCharacters.w]);
        }

        if (letter === "x") {
          finalMessage = finalMessage.concat([emojiCharacters.x]);
        }

        if (letter === "y") {
          finalMessage = finalMessage.concat([emojiCharacters.y]);
        }

        if (letter === "z") {
          finalMessage = finalMessage.concat([emojiCharacters.z]);
        }

        if (letter === "1") {
          finalMessage = finalMessage.concat([emojiCharacters[1]]);
        }

        if (letter === "2") {
          finalMessage = finalMessage.concat([emojiCharacters[2]]);
        }

        if (letter === "3") {
          finalMessage = finalMessage.concat([emojiCharacters[3]]);
        }

        if (letter === "4") {
          finalMessage = finalMessage.concat([emojiCharacters[4]]);
        }

        if (letter === "5") {
          finalMessage = finalMessage.concat([emojiCharacters[5]]);
        }

        if (letter === "6") {
          finalMessage = finalMessage.concat([emojiCharacters[6]]);
        }

        if (letter === "7") {
          finalMessage = finalMessage.concat([emojiCharacters[7]]);
        }

        if (letter === "8") {
          finalMessage = finalMessage.concat([emojiCharacters[8]]);
        }

        if (letter === "9") {
          finalMessage = finalMessage.concat([emojiCharacters[9]]);
        }

        if (letter === "0") {
          finalMessage = finalMessage.concat([emojiCharacters[0]]);
        }

        if (letter === "#") {
          finalMessage = finalMessage.concat([emojiCharacters["#"]]);
        }

        if (letter === "*") {
          finalMessage = finalMessage.concat([emojiCharacters["*"]]);
        }

        if (letter === "!") {
          finalMessage = finalMessage.concat([emojiCharacters["!"]]);
        }

        if (letter === "?") {
          finalMessage = finalMessage.concat([emojiCharacters["?"]]);
        }

        if (letter === " ") {
          finalMessage = finalMessage.concat("     ");
        }
      }

      if (finalMessage === " " || finalMessage.length > 2000) {
        await interaction.editReply({
          content: "Couldn't emojify string!",
          ephemeral: true,
        });
      } else {
        interaction.editReply(finalMessage);
      }
    }

    if (interaction.commandName === "annoy") {
      var count = 0;
      canAnnoy = true;
      var timer = setInterval(function () {
        count = count + 1;
        if (count === 60) {
          canAnnoy = false;
          interaction.channel.send(
            "the minute is up! i will no longer repeat messages",
          );
          clearInterval(timer);
        }
      }, 1000);
    }

    if (interaction.commandName === "crash") {
      if (interaction.user.id === DaniLionnId) {
        let s = new Date().toLocaleString();
        const read = fs.readFileSync("./ErrorLog.txt", "utf8", (err) => {
          if (err) {
            console.log(err);
          }
        });
        const data = `${read}\n${s}: Bot was crashed using a command`;
        //console.log(data)
        fs.writeFileSync("./ErrorLog.txt", data, (errr) => {
          if (errr) {
            console.error(errr);
          }

          // file written successfully
        });
        console.error("Bot was crashed using a command");
        process.exit(0);
      } else {
        await interaction.reply({
          content: "Sorry, but this command is reserved for dani only.",
          ephemeral: true,
        });
      }
    }

    if (interaction.commandName === "time-out") {
      if (interaction.user.id === DaniLionnId) {
        interaction.reply("guess i'll go sit in the corner");
        setTimeout(function () {
          console.log("DaniBot was put into time out!");
          const data = `${fs.readFileSync(
            "./ErrorLog.txt",
            "utf8",
          )}\n${s}: DaniBot was put into time out.`;
          fs.writeFile("./ErrorLog.txt", data, (err) => {
            if (err) {
              console.error(err);
            }
            // file written successfully
          });
          client.destroy();
          process.exit(0);
        }, 500);
      } else {
        await interaction.reply({
          content: "Sorry, but this command is reserved for dani only.",
          ephemeral: true,
        });
      }
    }

    if (interaction.commandName === "echo") {
    }

    if (interaction.commandName === "me") {
      await interaction.deferReply({
        ephemeral: true,
      });

      await interaction.deleteReply();

      const msg = interaction.options.getString("message");

      await interaction.channel.send(`*danibot ${msg}*`);
    }

    if (interaction.commandName === "insult") {
      await interaction.deferReply({
        ephemeral: true,
      });

      const target = interaction.options.getUser("insultee");

      /* if (target.id == MariID)
      {

        await interaction.deleteReply()

        let nicemessage = MariMessages[Math.floor(Math.random() * MariMessages.length)]

        if (nicemessage === " i ate all the %c crayons") {

          nicemessage = nicemessage.replace("%c", crayonColours[Math.floor(Math.random() * crayonColours.length)])
        }

        console.log(nicemessage)

        await interaction.channel.send(`<@${target.id}> ${nicemessage}`); //send a random index in the array as a mention to the channel

      }else */
      if (target.id != "1032426388457787402") {
        await interaction.deleteReply();

        await interaction.channel.send(
          `<@${target.id}>${
            Insults[Math.floor(Math.random() * Insults.length)]
          }`,
        ); //send a random index in the array as a mention to the channel
      } else {
        await interaction.editReply({
          content: "HAHAHAHAH you can't make me insult myself LMAO",
          ephemeral: true,
        });
      }
    }

    if (interaction.commandName === "bad-compliment") {
      await interaction.deferReply({
        ephemeral: true,
      });

      const target = interaction.options.getUser("user");
      /* 	if (target.id == MariID)
        {

          await interaction.deleteReply()

          let nicemessage = MariMessages[Math.floor(Math.random() * MariMessages.length)]

          if (nicemessage == " i ate all the %c crayons") {

             nicemessage = nicemessage.replace("%c", crayonColours[Math.floor(Math.random() * crayonColours.length)])
          }



          console.log(nicemessage)

          await interaction.channel.send(`<@${target.id}> ${nicemessage}`);

        }else */
      if (target.id != "1032426388457787402") {
        await interaction.deleteReply();

        await interaction.channel.send(
          `<@${target.id}> ${
            COmplimens[Math.floor(Math.random() * COmplimens.length)]
          }`,
        ); //send a random index in the array as a mention to the channel
      } else {
        await interaction.editReply({
          content: "HAHAHAHAH you can't make me bad compliment myself LMAO",
          ephemeral: true,
        });
      }
    }

    if (interaction.commandName === "react") {
      await interaction.deferReply({
        ephemeral: true,
      });

      const msgs = interaction.channel.messages.fetch({
        limit: 2,
      });
      const message = (await msgs).at(1);

      const foundEmojis = await emotes(interaction.options.getString("emoji"));

      await foundEmojis.forEach((emoji) => {
        message.react(emoji);
      });

      await interaction.deleteReply();
    }

    if (interaction.commandName === "gif") {
      const type = interaction.options.getString("name");
      console.log(type);
      await interaction.deferReply();

      if (type === "gif_fatguy") {
        /* await */
        interaction.editReply("https://i.imgur.com/r22csKw.gifv");
      }

      if (type === "gif_buttburn") {
        /* await */
        interaction.editReply("https://i.imgur.com/o86PPkN.gifv");
      }

      if (type === "gif_deatchat") {
        /* await */
        interaction.editReply("https://i.imgur.com/SPUJ8lW.gifv");
      }

      if (type === "gif_deleted") {
        /* await */
        interaction.editReply("https://i.imgur.com/cyOxq74.gifv");
      }

      if (type === "gif_funnycat") {
        /* await */
        interaction.editReply("https://i.imgur.com/VY8KeS6.gifv");
      }

      if (type === "gif_pee") {
        /* await */
        interaction.editReply("https://i.imgur.com/gz7YaDR.gifv");
      }

      if (type === "gif_sleepycat") {
        /* await */
        interaction.editReply("https://i.imgur.com/n4fhwjP.gifv");
      }

      if (type === "gif_cock") {
        /* await */
        interaction.editReply("https://i.imgur.com/FUMmPce.gifv");
      }

      if (type === "gif_poss") {
        /* await */
        interaction.editReply("https://i.imgur.com/4xfhltw.gifv");
      }

      if (type === "gif_boomie") {
        /* await */
        interaction.editReply(
          "https://tenor.com/view/cum-penis-cum-i-creamed-cumming-xd-gif-20404521",
        );
      }

      if (type === "gif_doctorpiss") {
        /* await */
        interaction.editReply("https://tenor.com/view/urine-test-gif-19939272");
      }

      if (type === "gif_info") {
        /* await */
        interaction.editReply(
          "https://tenor.com/view/my-reaction-to-that-information-gif-26013120",
        );
      }

      if (type === "gif_dogstare") {
        /* await */
        interaction.editReply(
          "https://tenor.com/view/kinkytwt-stan-twitter-dog-gif-22789987",
        );
      }
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

const app = express();

app.use(bodyparser.text());

client.on("guildMemberAdd", function (member) {
  let systemMessagesChannel = member.guild.systemChannelId;

  createWelcomeGraphic(
    member.guildID,
    systemMessagesChannel,
    "Welcome!",
    member.user,
    member,
  );
});

///http stuff for my replit hosting

// app.post('/part1', (request, response) => {
//   response.send("Gotten POST request 1")
//   console.log(request.body)
//   message = message.concat(request.body)

// })
// app.post('/part2', (request, response) => {
//   response.send("Gotten POST request 2")
//   console.log(request.body)
//   message = message.concat(`\n"${request.body}"`)

//   send()
// })

// app.post('/universeID', (request, response) => {
//   response.send("Gotten POST request 2")
//   console.log(request.body)
//   currentUniverseId = request.body

// })

let ResponseHTML = fs.readFileSync("./assets/web-assets/OKPage.html", "utf8");

app.post("/SendMessage", (request, response) => {
  response.send("messageRequest");
  console.log(request.body);
  var message = request.body.Message;
  var ServerId = request.body.ServerId;
  var ChannelId = request.body.ChannelId;

  client.channels.cache.get(ChannelId).send(message);
});

var inviteLink = "";

const listOptions = {
  params: {
    prefix: "",
    limit: "10",
  },
  headers: {
    "x-api-key": DatastoresAPIKey,
  },
};

app.get("/sendUpdates", function (req, res) {
  let message = req.query.message;
  //console.log(message)
  try {
    client.channels.cache.get("1159652037278052395").send(message);
    res.send("sent");
  } catch (e) {
    console.error(e);
    res.send("error");
  }
});

const querystring = require("querystring");
const { Curl } = require("node-libcurl");
//const terminate = send.close.bind(curlTest);

app.get("/list", function (req, res) {
  const send = new Curl();

  send.setOpt(Curl.option.URL, process.env["DatastoreAPI_URL"]);
  send.setOpt(Curl.option.HTTPGET, true);
  send.setOpt(Curl.option.HTTPHEADER, [`x-api-key: ${DatastoresAPIKey}`]);

  send.on("end", function (statusCode, data, headers) {
    let finalJSON = JSON.parse(data);
    res.send(data);

    this.close();
  });

  send.on("error", send.close.bind(send));
  send.perform();
});

app.get("/getData", function (req, res) {
  let key = `${req.query.UserId}%23Data`;

  //console.log(key)
  const send = new Curl();

  send.setOpt(Curl.option.URL, `${process.env["DatastoreAPI_GetURL"]}${key}`);
  send.setOpt(Curl.option.HTTPGET, true);
  send.setOpt(Curl.option.HTTPHEADER, [`x-api-key: ${DatastoresAPIKey}`]);

  send.on("end", function (statusCode, data, headers) {
    let finalJSON = JSON.parse(data);
    res.send(finalJSON);

    this.close();
  });

  send.on("error", send.close.bind(send));
  send.perform();
});
app.get("/openGame", function (req, res) {
  res.redirect(inviteLink);
});

app.get("/postGVInvite", async function (Request, Res) {
  inviteLink = `roblox://experiences/start?placeId=11138886508`;

  await client.channels.cache.get("1059267554025152514").send({
    content: `<@1130288851521392750> join me pls`,
    tts: false,
    components: [
      {
        type: 1,
        components: [
          {
            style: 5,
            label: `join`,
            url: process.env["OpenGameURL"],
            disabled: false,
            type: 2,
          },
        ],
      },
    ],
    embeds: [
      {
        type: "rich",
        title: "",
        description: "",
        color: 0x580b6c,
        image: {
          url: `https://tr.rbxcdn.com/7a8f2e1bbf2a30a996a2656176ad6350/150/150/Image/Png`,
          height: 0,
          width: 0,
        },
      },
    ],
  });

  Res.send("Sent");
});

app.get("/postInvite", async function (req, resp) {
  const channelID = req.query.channelID;
  const placeID = req.query.placeID;
  const name = req.query.name;
  const message = req.query.message;

  console.log(channelID, placeID, message);

  inviteLink = `roblox://experiences/start?placeId=${placeID}`;

  https
    .get(
      `${process.env["ThumbnailsAPI"]}?assetIds=${placeID}&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`,
      (res) => {
        let data = [];

        res.on("data", (chunk) => {
          data.push(chunk);
        });

        res.on("end", () => {
          // console.log('Response ended: ');
          const parsed = JSON.parse(Buffer.concat(data).toString());

          console.log(parsed);
          const thumb = parsed["data"][0]["imageUrl"];
          console.log(thumb);

          client.channels.cache.get(channelID).send({
            content: message,
            tts: false,
            components: [
              {
                type: 1,
                components: [
                  {
                    style: 5,
                    label: `join`,
                    url: process.env["OpenGameURL"],
                    disabled: false,
                    type: 2,
                  },
                ],
              },
            ],
            embeds: [
              {
                type: "rich",
                title: name,
                description: "",
                color: 0x580b6c,
                image: {
                  url: thumb,
                  height: 512,
                  width: 512,
                },
              },
            ],
          });

          resp.send("Sent");
        });
      },
    )
    .on("error", (err) => {
      console.log("Error: ", err.message);
      resp.send("error");
    });
});

app.get("/test", function (Request, Res) {
  //let stamp = getTimestamp()
  //console.log(`${stamp}: TEST OK`)
  Res.send("OK");
});

app.get("/", async function (Request, Res) {
  // if (fs.existsSync('tempcat.png')) {
  //     fs.unlink('tempcat.png',function(err){
  //         if(err) return console.log(err);
  //    });
  // }

  Res.status(200);

  // let path = download("https://cataas.com/cat", 'tempcat.png')

  // console.log(path)

  Res.send(ResponseHTML);
});

app.listen(80);

// setInterval(async () => {

//     try {

//         https.get("https://daniibot.dani-lionn.repl.co")

//         //console.log("revived")

//     } catch (err) {
//         writeError(err)
//     }

// }, (1800 * 1000) - 1000)

client.login(token); //login
