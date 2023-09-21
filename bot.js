const fs = require('node:fs');
const express = require('express')
const bodyparser = require('body-parser')


process.on('unhandledRejection', error =>
{
	console.log(error)
	let s = new Date().toLocaleString();
	const read = fs.readFileSync('./ErrorLog.txt', 'utf8', err => {if (err) {console.log(err)}}) 
	const data = `${read}\n${s}: ${error}`
	//console.log(data)
	fs.writeFileSync('./ErrorLog.txt', data, err =>{ if (err) {console.error(err);}
		// file written successfully
	});
});




// Require the necessary discord.js classes
const
{
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	ActivityType
} = require('discord.js');
const
{
	joinVoiceChannel,
	getVoiceConnection,
	VoiceConnectionStatus,
	NoSubscriberBehavior,
	createAudioPlayer,
	createAudioResource
} = require('@discordjs/voice');
const
{
	token,
	clientId,
	guildId,
	DaniLionnId,
	MariID
} = require('./config.json');

const path = require('node:path');
const emojiCharacters = require('./emojiCharacters.js');
const EventEmitter = require('node:events');
const { setInterval } = require('node:timers');
// const emojiRegex = require('emoji-regex/RGI_Emoji.js');

const audios = ['./postable-assets/fart.mp3', './postable-assets/janky-ass-music.mp3', './postable-assets/mimimimimimi.mp3', './postable-assets/laugh.mp3', './postable-assets/amog.mp3', './postable-assets/alert.mp3', './postable-assets/arooga.mp3', './postable-assets/BANG.mp3', './postable-assets/bluekid.mp3', './postable-assets/cough.mp3', './postable-assets/fart.mp3', './postable-assets/omg.mp3', , './postable-assets/omg2.mp3', './postable-assets/poop.mp3', './postable-assets/run.mp3', './postable-assets/scary.mp3', './postable-assets/scream.mp3']

var currentAudioPlayer 

var CurrentAuudioConnection

var canPlaySounds = false


var canAnnoy = false

EventEmitter.setMaxListeners(100)

const client = new Client(
{
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});


// Log in to Discord with your client's token
client.login(token);



client.commands = new Collection();
const KoTFGeneral = client.channels.cache.get('1032095616836325398');
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const emotes = (str) => str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu)

for (const file of commandFiles)
{
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command)
	{
		client.commands.set(command.data.name, command);
	}
	else
	{
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}



const activityTypes = ['PLAYING', 'WATCHING', 'LISTENING', 'COMPETING'];
const statusTypes = ['ONLINE', 'IDLE', 'DND']
const PlayingMessages = ['with myself 😏', 'some game i enjoy', 'a board game', 'Roblox', 'something very scary 👻👻👻', 'the piano', 'Playing Playing Playing Playing Playing Playing Playing Playing Playing Playing', 'with a bomb', 'with a ouija board'];
const WatchingMessages = ['porn', 'cat videos', 'how 2 take over the universe', 'idiots in cars', 'terraria challeng videos'];
const ListeningMessages = ['music', 'the voices in my head', 'ghost and pals 😌', 'Spotify'];
const CompetingMessages = ['sexiest bot championships 2023', 'pipe bomb building', "winning your mom's heart"]
const GayMessages = ['yes i am :smiley:', 'no u :rage:', 'you\'re gay too, i can smell it (you smell like fruit that\'s how i can tell)'];
const Reactions = ['😭', '🥺', '🏳‍🌈', '😒', '😡', '🤦‍♀️', '✨', '🤪', '🥰', '🔥', /* '😏' , */ /* '😩', */ '😳', '🤩', '👍', '🤔', '🥔', '😔', '❤', '💕', '💔', '😛', '😎', '💀', '🤓', '😈', '🤡', '🤭', '😥', '1048083800590131272', '1056275303720296448'];
// const RandomMessages = ['haha', 'shut up', 'no u', 'rip bozo', 'L']
const PingMessages = ["yes hello that's my name", "what do you want", "danibot danibot", "hello", "shut up", "stop pinging me :rage:"]
const Insults = [" your feet stink", " you look like a wall", " you look like a floor", "you made me wet my pants", " you are a mild inconvienece", " i slightly dislike you", " you look like an empty pop can", " yo mama so fat her belly button gets home 60 minutes before she does", " yo mama so stupid she thought twitter was social media", " YO MAMA SO FAT SHE TRIED TO EAT THE SUPERBOWL", " you remind me of a wet sock", " you're as dry as the 2 week old poo stain in the bathroom", " you look like a rubber ball", " you're as clean as the mcdonalds fry maker", " you stink (slightly)", " you smell like chiken wing", " you look like microwave", " you're about as useful as a shattered light bulb", "you smell as good as a wet napkin", "you are a fire truckS"]
const COmplimens = ["you smell slightly better than usual", "you're as clean as my fresh load of laundry", "your personality is so wet! (thanks duck)", "you look more human than usual", "you remind me of canned beans", "you're not as dumb as you look", "you have really nice veins 🥰", "you're so charming when you make an effort.", "you're pretty…\non the inside.", "i don't care what others say about you.\nyou're alright in my book.", "i love how you just don't care what anyone thinks of you.", "you smell as good as this cupcake i ate last week", "your hair smells good"]
const crayonColours = [ "orange", "green", "purple", "pink", "brown", "black", "white"]
const MariMessages = [" is my best friend we watch my little pony together and draw in coloring books", " you're my best friend :blush:", " i ate all the %c crayons"]

var CurrentSubscription

var audioresources = []

audios.forEach(audio => {

audioresources.push(createAudioResource(audio))

})

//console.log(audioresources)

function setBotStatus()
{ // Function that gives the bot a random status based on the tables above

	const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];

	if (activity === 'PLAYING')
	{

		const randomMessage = PlayingMessages[Math.floor(Math.random() * PlayingMessages.length)];
		client.user.setActivity(randomMessage,
		{
			type: ActivityType.Playing
		});
	}

	if (activity === 'WATCHING')
	{

		const randomMessage = WatchingMessages[Math.floor(Math.random() * WatchingMessages.length)];
		client.user.setActivity(randomMessage,
		{
			type: ActivityType.Watching
		});
	}

	if (activity === 'LISTENING')
	{

		const randomMessage = ListeningMessages[Math.floor(Math.random() * ListeningMessages.length)];
		client.user.setActivity(randomMessage,
		{
			type: ActivityType.Listening
		});
	}

	if (activity === 'COMPETING')
	{

		const randomMessage = CompetingMessages[Math.floor(Math.random() * CompetingMessages.length)];
		client.user.setActivity(randomMessage,
		{
			type: ActivityType.Competing
		});
	}

	setTimeout(() =>
	{

		const status = statusTypes[Math.floor(Math.random() * statusTypes.length)];


		if (status === 'ONLINE')
		{

			client.user.setStatus('online');
		}

		if (status === 'DND')
		{

			client.user.setStatus('dnd');
		}

		if (status === 'IDLE')
		{

			client.user.setStatus('idle');
		}
	}, 1500);


}

function setBotStatus2(KEY)
{ // Function that gives the bot a random status based on the tables above

	if (KEY === 'NONE')
	{
		const activity = activityTypes[Math.floor(Math.random() * activityTypes.length)];

		if (activity === 'PLAYING')
		{

			const randomMessage = PlayingMessages[Math.floor(Math.random() * PlayingMessages.length)];
			client.user.setActivity(randomMessage,
			{
				type: ActivityType.Playing
			});
		}

		if (activity === 'WATCHING')
		{

			const randomMessage = WatchingMessages[Math.floor(Math.random() * WatchingMessages.length)];
			client.user.setActivity(randomMessage,
			{
				type: ActivityType.Watching
			});
		}

		if (activity === 'LISTENING')
		{

			const randomMessage = ListeningMessages[Math.floor(Math.random() * ListeningMessages.length)];
			client.user.setActivity(randomMessage,
			{
				type: ActivityType.Listening
			});
		}

		if (activity === 'COMPETING')
		{

			const randomMessage = CompetingMessages[Math.floor(Math.random() * CompetingMessages.length)];
			client.user.setActivity(randomMessage,
			{
				type: ActivityType.Competing
			});
		}
	};

	if (KEY === 'PLAYING')
	{

		const randomMessage = PlayingMessages[Math.floor(Math.random() * PlayingMessages.length)];
		client.user.setActivity(randomMessage,
		{
			type: ActivityType.Playing
		});

	};

	if (KEY === 'WATCHING')
	{

		const randomMessage = WatchingMessages[Math.floor(Math.random() * WatchingMessages.length)];
		client.user.setActivity(randomMessage,
		{
			type: ActivityType.Watching
		});

	};

	if (KEY === 'COMPETING')
	{

		const randomMessage = CompetingMessages[Math.floor(Math.random() * CompetingMessages.length)];
		client.user.setActivity(randomMessage,
		{
			type: ActivityType.Competing
		});

	};

	if (KEY === 'LISTENING')
	{

		const randomMessage = ListeningMessages[Math.floor(Math.random() * ListeningMessages.length)];
		client.user.setActivity(randomMessage,
		{
			type: ActivityType.Listening
		});

	};


}
// Create a new client instance

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c =>
{


	console.log(`Ready! Logged in as ${c.user.tag}`);

	// Startup stuff

	const deploy = require('./deploy-commands')

	setBotStatus(); // Call random status function
	let s = new Date().toLocaleString();
	console.log(s)

	if (s.includes("10/19")) {
		console.log("danibot bday!!")
		client.user.setAvatar('./DaniBotBirthdayPFP.png');
		client.channels.cache.get('1032095616836325398').send("hey guys!! today is my birthday!!!")

	} else {
		client.user.setAvatar('./DaniBotPFP.png');
	}

	

	setInterval(setBotStatus, 420000); // Calls setBotStatus() every 7 minutes

	// const comamnds = deploy.prep()
	console.log(deploy.success)
});


function getOnlineMembers(g)
{

	// First use guild.members.fetch to make sure all members are cached
	g.members.fetch(
	{
		withPresences: true
	}).then(fetchedMembers =>
	{
		const totalOnline = fetchedMembers.filter(member => member.presence?.status === 'online');
		// Now you have a collection with all online member objects in the totalOnline variable
		console.log(totalOnline)
		return totalOnline

	});


}

client.on("messageCreate", (message) =>
{
	if (message.content.includes("<@1032426388457787402>"))
	{
		if (message.author.id == MariID) {
			message.reply("hii bestieee :blush:")
		} else {
			message.reply(PingMessages[Math.floor(Math.random() * PingMessages.length)])
		}
		
	};

		if (message.content.includes("-del"))
	{ if (!message.content.includes("https://")) {

	
		setTimeout(() => {
			message.delete()
		}, 125)
	}};

	/*     if ((message.author.id != clientId)) {
	        if  (message.guild.id === guildId) {
	    const randomChance = Math.floor(Math.random() * 10);
	    if (randomChance === 1) {
	    
	    message.react(Reactions[Math.floor(Math.random() * Reactions.length)]);
	    
	    }}}; */

	if (canAnnoy === true)
	{
		if ((message.author.id != clientId))
		{

			const mesg = message.content

			console.log(mesg)

			message.channel.send(mesg)
		}
	};
});

async function insult()
{



}

client.on(Events.InteractionCreate, async interaction =>
{
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command)
	{
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	/*if (interaction.commandName === 'ping')
	{
		await interaction.reply('Pong!');

	}*/

	if (interaction.commandName === 'random-react')
	{
		await interaction.deferReply({ephemeral: true});
		const msgs = interaction.channel.messages.fetch(
		{
			limit: 2
		})
		const message = (await msgs).at(1)

		message.react(Reactions[Math.floor(Math.random() * Reactions.length)]);

		interaction.deleteReply()

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

		 if (interaction.commandName === 'ping')
		 {		await interaction.reply({ content: `Websocket heartbeat: ${client.ws.ping}ms.`, ephemeral: true});}

	if (interaction.commandName === 'connect')
	{

		if (interaction.guild.id === "1078429734536486924") {

			CurrentAuudioConnection = joinVoiceChannel(
			{
				channelId: "1078429735425691681",
				guildId: "1078429734536486924",
				adapterCreator: client.guilds.cache.get("1078429734536486924").voiceAdapterCreator,
				selfDeaf: false,
			});
		} else 
		

		if (interaction.guild.id === "1032095616219754576") {

		CurrentAuudioConnection = joinVoiceChannel(
		{
			channelId: "1032095616836325399",
			guildId: "1032095616219754576",
			adapterCreator: client.guilds.cache.get("1032095616219754576").voiceAdapterCreator,
			selfDeaf: false,
		});
	} else {
		CurrentAuudioConnection = joinVoiceChannel(
			{
				channelId: "946797124824203308",
				guildId: "946797124824203304",
				adapterCreator: client.guilds.cache.get("946797124824203304").voiceAdapterCreator,
				selfDeaf: false,
			});

	}
		currentAudioPlayer = createAudioPlayer(
		{
			behaviors:
			{
				noSubscriber: NoSubscriberBehavior.Pause,
			},
		});

		canPlaySounds = true

		interaction.reply("Connected to the voice channel")

		if (canPlaySounds === true)
		{

			let resource =  createAudioResource(audios[Math.floor(Math.random() * audios.length)]) 



			 CurrentSubscription = CurrentAuudioConnection.subscribe(currentAudioPlayer);


			console.log("playing")
			currentAudioPlayer.play(resource);

			resource

			const play = setInterval(() =>
			{

				if (canPlaySounds === false) {

					clearInterval(play)

				}

				let resource = createAudioResource(audios[Math.floor(Math.random() * audios.length)]) 


				console.log("playing")
				currentAudioPlayer.play(resource);
				

				
			}, 15000);

			


			currentAudioPlayer.on('error', error => {
				console.error(`Error: ${error.message} with resource ${error.resource.metadata.title}`);
				//resource = createAudioResource(audios[Math.floor(Math.random() * audios.length)])
			});

		}


	}
	if (interaction.commandName === 'disconnect')
	{


		currentAudioPlayer.stop()
		canPlaySounds = false
		CurrentAuudioConnection.destroy()
		CurrentSubscription.unsubscribe()
		
		
		interaction.reply("Disconnected from the voice channel")
		


	}


		


	if (interaction.commandName === 'change-status')
	{

		if (interaction.user.id === DaniLionnId)
		{
			const type = interaction.options.getString('type');
			setBotStatus2(type);

			await interaction.reply(
			{
				content: 'Bot status switched!',
				ephemeral: true
			});

		}
		else
		{
			await interaction.reply(
			{
				content: 'Sorry, but this command is reserved for dani only.',
				ephemeral: true
			});
		};
	}

	if (interaction.commandName === 'emojify')
	{

		await interaction.deferReply();

		const str = interaction.options.getString('message').toLowerCase();

		// console.log(str)

		var finalMessage = " "
		for (let i = 0; i < str.length; i++)
		{
			const letter = str[i]

			if (letter === 'a')
			{



				finalMessage = finalMessage.concat([emojiCharacters.a])

			}

			if (letter === 'b')
			{




				finalMessage = finalMessage.concat([emojiCharacters.b])

			}

			if (letter === 'c')
			{




				finalMessage = finalMessage.concat([emojiCharacters.c])

			}

			if (letter === 'd')
			{




				finalMessage = finalMessage.concat([emojiCharacters.d])

			}

			if (letter === 'e')
			{




				finalMessage = finalMessage.concat([emojiCharacters.e])

			}

			if (letter === 'f')
			{




				finalMessage = finalMessage.concat([emojiCharacters.f])

			}

			if (letter === 'g')
			{




				finalMessage = finalMessage.concat([emojiCharacters.g])

			}

			if (letter === 'h')
			{




				finalMessage = finalMessage.concat([emojiCharacters.h])

			}

			if (letter === 'i')
			{




				finalMessage = finalMessage.concat([emojiCharacters.i])

			}

			if (letter === 'j')
			{




				finalMessage = finalMessage.concat([emojiCharacters.j])

			}

			if (letter === 'k')
			{




				finalMessage = finalMessage.concat([emojiCharacters.k])

			}

			if (letter === 'l')
			{




				finalMessage = finalMessage.concat([emojiCharacters.l])

			}

			if (letter === 'm')
			{




				finalMessage = finalMessage.concat([emojiCharacters.m])

			}

			if (letter === 'n')
			{




				finalMessage = finalMessage.concat([emojiCharacters.n])

			}

			if (letter === 'o')
			{




				finalMessage = finalMessage.concat([emojiCharacters.o])

			}

			if (letter === 'p')
			{




				finalMessage = finalMessage.concat([emojiCharacters.p])

			}

			if (letter === 'q')
			{




				finalMessage = finalMessage.concat([emojiCharacters.q])

			}

			if (letter === 'r')
			{




				finalMessage = finalMessage.concat([emojiCharacters.r])

			}

			if (letter === 's')
			{




				finalMessage = finalMessage.concat([emojiCharacters.s])

			}

			if (letter === 't')
			{




				finalMessage = finalMessage.concat([emojiCharacters.t])

			}

			if (letter === 'u')
			{




				finalMessage = finalMessage.concat([emojiCharacters.u])

			}

			if (letter === 'v')
			{




				finalMessage = finalMessage.concat([emojiCharacters.v])

			}

			if (letter === 'w')
			{




				finalMessage = finalMessage.concat([emojiCharacters.w])

			}

			if (letter === 'x')
			{




				finalMessage = finalMessage.concat([emojiCharacters.x])

			}

			if (letter === 'y')
			{




				finalMessage = finalMessage.concat([emojiCharacters.y])

			}

			if (letter === 'z')
			{




				finalMessage = finalMessage.concat([emojiCharacters.z])

			}

			if (letter === '1')
			{




				finalMessage = finalMessage.concat([emojiCharacters[1]])

			}

			if (letter === '2')
			{




				finalMessage = finalMessage.concat([emojiCharacters[2]])

			}

			if (letter === '3')
			{




				finalMessage = finalMessage.concat([emojiCharacters[3]])

			}

			if (letter === '4')
			{




				finalMessage = finalMessage.concat([emojiCharacters[4]])

			}

			if (letter === '5')
			{




				finalMessage = finalMessage.concat([emojiCharacters[5]])

			}

			if (letter === '6')
			{




				finalMessage = finalMessage.concat([emojiCharacters[6]])

			}

			if (letter === '7')
			{




				finalMessage = finalMessage.concat([emojiCharacters[7]])

			}

			if (letter === '8')
			{




				finalMessage = finalMessage.concat([emojiCharacters[8]])

			}

			if (letter === '9')
			{




				finalMessage = finalMessage.concat([emojiCharacters[9]])

			}

			if (letter === '0')
			{




				finalMessage = finalMessage.concat([emojiCharacters[0]])

			}

			if (letter === '#')
			{




				finalMessage = finalMessage.concat([emojiCharacters['#']])

			}

			if (letter === '*')
			{




				finalMessage = finalMessage.concat([emojiCharacters['*']])

			}

			if (letter === '!')
			{




				finalMessage = finalMessage.concat([emojiCharacters['!']])

			}

			if (letter === '?')
			{




				finalMessage = finalMessage.concat([emojiCharacters['?']])

			}

			if (letter === ' ')
			{




				finalMessage = finalMessage.concat('     ')

			}





		}

		if (finalMessage === " ")
		{
			await interaction.editReply(
			{
				content: "Couldn't emojify string!",
				ephemeral: true
			});
		}
		else
		{
			interaction.editReply(finalMessage)
		}

	};

	if (interaction.commandName === 'annoy')
	{
		var count = 0
		canAnnoy = true
		var timer = setInterval(function ()
		{
			count = count + 1
			if (count === 60)
			{
				canAnnoy = false
				interaction.channel.send("the minute is up! i will no longer repeat messages")
				clearInterval(timer)
			}
		}, 1000)

	};

	if (interaction.commandName === 'crash')
	{

		if (interaction.user.id === DaniLionnId)
		{
			let s = new Date().toLocaleString();
			const read = fs.readFileSync('./ErrorLog.txt', 'utf8', err => {if (err) {console.log(err)}}) 
			const data = `${read}\n${s}: Bot was crashed using a command`
			//console.log(data)
			fs.writeFileSync('./ErrorLog.txt', data, errr =>
			{
				if (errr)
				{
					console.error(errr);
				}

				// file written successfully
			});
			console.error("Bot was crashed using a command")
			process.exit(0)
		}
		else
		{
			await interaction.reply(
			{
				content: 'Sorry, but this command is reserved for dani only.',
				ephemeral: true
			});
		};
	}

	if (interaction.commandName === 'time-out')
	{

		if (interaction.user.id === DaniLionnId)
		{
			interaction.reply("guess i'll go sit in the corner")
			setTimeout(function ()
			{
				console.log("DaniBot was put into time out!")
				const data = `${fs.readFileSync('./ErrorLog.txt', 'utf8')}\n${s}: DaniBot was put into time out.`
				fs.writeFile('./ErrorLog.txt', data, err =>
				{
					if (err)
					{
						console.error(err);
					}
					// file written successfully
				});
				client.destroy()
				process.exit(0)
			}, 500)
		}
		else
		{
			await interaction.reply(
			{
				content: 'Sorry, but this command is reserved for dani only.',
				ephemeral: true
			});
		};
	}

	if (interaction.commandName === 'echo')
	{

		



	}

	if (interaction.commandName === 'me')
	{

		await interaction.deferReply({ephemeral: true});

		await interaction.deleteReply();

		const msg = interaction.options.getString('message');

		await interaction.channel.send(`*danibot ${msg}*`);



	}


	if (interaction.commandName === 'insult')
	{
		await interaction.deferReply({ephemeral: true});

		const target = interaction.options.getUser('insultee');
		if (target.id == MariID)
		{

			await interaction.deleteReply()

			let nicemessage = MariMessages[Math.floor(Math.random() * MariMessages.length)]

			if (nicemessage === " i ate all the %c crayons") {

				nicemessage = nicemessage.replace("%c", crayonColours[Math.floor(Math.random() * crayonColours.length)])
			}

			console.log(nicemessage)

			await interaction.channel.send(`<@${target.id}> ${nicemessage}`); //send a random index in the array as a mention to the channel

		}else if (target.id != "1032426388457787402")
		
		{

			await interaction.deleteReply()

			await interaction.channel.send(`<@${target.id}>${Insults[Math.floor(Math.random() * Insults.length)]}`); //send a random index in the array as a mention to the channel

		}
		else
		{
			await interaction.editReply(
			{
				content: "HAHAHAHAH you can't make me insult myself LMAO",
				ephemeral: true
			});

		}
	}

	if (interaction.commandName === 'bad-compliment')
	{
		await interaction.deferReply({ephemeral: true});

		const target = interaction.options.getUser('user');
		if (target.id == MariID)
		{

			await interaction.deleteReply()

			let nicemessage = MariMessages[Math.floor(Math.random() * MariMessages.length)]

			if (nicemessage == " i ate all the %c crayons") {

				 nicemessage = nicemessage.replace("%c", crayonColours[Math.floor(Math.random() * crayonColours.length)])
			}

				

			console.log(nicemessage)

			await interaction.channel.send(`<@${target.id}> ${nicemessage}`);

		}else if (target.id != "1032426388457787402")
		{

			await interaction.deleteReply()

			await interaction.channel.send(`<@${target.id}> ${COmplimens[Math.floor(Math.random() * COmplimens.length)]}`); //send a random index in the array as a mention to the channel

		}
		else
		{
			await interaction.editReply(
			{
				content: "HAHAHAHAH you can't make me bad compliment myself LMAO",
				ephemeral: true
			});

		}
	}

	if (interaction.commandName === 'react')
	{

		await interaction.deferReply({ephemeral: true})

		const msgs = interaction.channel.messages.fetch(
		{
			limit: 2
		})
		const message = (await msgs).at(1)

		const foundEmojis = await emotes(interaction.options.getString('emoji'))

		await foundEmojis.forEach(emoji =>
		{
			message.react(emoji)
		});

		await interaction.deleteReply()

	}

	if (interaction.commandName === 'gif')
	{
		const type = interaction.options.getString('name');
		console.log(type)
		await interaction.deferReply();

		if (type === 'gif_fatguy')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/r22csKw.gifv')
		}

		if (type === 'gif_buttburn')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/o86PPkN.gifv')
		}

		if (type === 'gif_deatchat')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/SPUJ8lW.gifv')
		}

		if (type === 'gif_deleted')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/cyOxq74.gifv')
		}

		if (type === 'gif_funnycat')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/VY8KeS6.gifv')
		}

		if (type === 'gif_pee')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/gz7YaDR.gifv')
		}

		if (type === 'gif_sleepycat')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/n4fhwjP.gifv')
		}

		if (type === 'gif_cock')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/FUMmPce.gifv')
		}

		if (type === 'gif_poss')
		{
			/* await */
			interaction.editReply('https://i.imgur.com/4xfhltw.gifv')
		}

		if (type === 'gif_boomie')
		{
			/* await */
			interaction.editReply('https://tenor.com/view/cum-penis-cum-i-creamed-cumming-xd-gif-20404521')
		}

		if (type === 'gif_doctorpiss')
		{
			/* await */
			interaction.editReply('https://tenor.com/view/urine-test-gif-19939272')
		}

		if (type === 'gif_info')
		{
			/* await */
			interaction.editReply('https://tenor.com/view/my-reaction-to-that-information-gif-26013120')
		}

		if (type === 'gif_dogstare')
		{
			/* await */
			interaction.editReply('https://tenor.com/view/kinkytwt-stan-twitter-dog-gif-22789987')
		}

	}

	try
	{
		await command.execute(interaction);
	}
	catch (error)
	{
		console.error(error);
		await interaction.reply(
		{
			content: 'There was an error while executing this command!',
			ephemeral: true
		});
	}
});

const app = express()
var port = 3000
var port2 = 3001
app.use(bodyparser.text())

var got = 0

var message = ""

function send() {

	client.channels.cache.get('1032095616836325398').send(message);

message = ""
}

client.on("guildMemberAdd", function(member){
    console.log(`hey! somebody joined: ${member.user.tag}`);
	client.channels.cache.get('1032095616836325398').send(`omg omg guys omg somebody new joined the server and i was told their user was <@${member.user.id}>`);
});
client.on("guildMemberRemove", function(member){
    console.log(`hey! somebody joined: ${member.user.tag}`);
	client.channels.cache.get('1032095616836325398').send(`omg omg guys omg <@${member.user.tag}> left the server :sob::sob::sob::sob::sob:`);
});

app.post('/part1', (request, response) => {
    response.send("Gotten POST request 1")
    console.log(request.body)
	message = message.concat(request.body)

})
app.post('/part2', (request, response) => {
    response.send("Gotten POST request 2")
    console.log(request.body)
	message = message.concat(`\n"${request.body}"`)

	send()
})

app.listen(port, function(){
    console.log(`started server at http://localhost:${port}`)
})

app.listen(port2, function(){
    console.log(`started server at http://localhost:${port2}`)
})

