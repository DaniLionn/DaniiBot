const { SlashCommandBuilder } = require('discord.js');



module.exports = {
	data: new SlashCommandBuilder()
		.setName('random-cat')
		.setDescription("gives you a random image of a cat")
		.addStringOption(option =>
			option.setName('options')
				.setDescription('options for the cat image')
				.setRequired(true)
				.addChoices(
					{ name: 'Regular', value: 'isRegular' },
					//{ name: 'Gif', value: 'isGif' },
					{ name: 'Kitten', value: 'isKitten' },
					{ name: 'Cute', value: 'isCute' },
					{ name: 'Ugly', value: 'isUgly' },
					//{ name: 'Old', value: 'isOld' },
					
				))
				.addStringOption(option =>
					option.setName('text')
						.setDescription('optional text for the image')
						.setRequired(false)
				),

	async execute(interaction) {
		const options = interaction.options.getString('options');
		var text = interaction.options.getString('text');

		if (text != undefined) {

			text = text.replaceAll(" ", "%20")

			

			if (options == "isRegular") {

				interaction.reply(`https://cataas.com/cat/says/${text}`)

			}

			// else if (options == "isGif") {

			// 	interaction.reply(`https://cataas.com/cat/gif`)

			// }

			else if (options == "isKitten") {

				interaction.reply(`https://cataas.com/cat/kitten/says/${text}`)

			}

			else if (options == "isCute") {

				interaction.reply(`https://cataas.com/cat/cute/says/${text}`)

			}

			else if (options == "isUgly") {

				interaction.reply(`https://cataas.com/cat/ugly/says/${text}`)

			}

			// else if (options == "isOld") {

			// 	interaction.reply(`https://cataas.com/cat/old/says/${text}`)

			// }
		} else {			
			
			if (options == "isRegular") {

			interaction.reply(`https://cataas.com/cat`)

		}

		// else if (options == "isGif") {

		// 	interaction.reply(`https://cataas.com/cat/gif`)

		// }

		else if (options == "isKitten") {

			interaction.reply(`https://cataas.com/cat/kitten`)

		}

		else if (options == "isCute") {

			interaction.reply(`https://cataas.com/cat/cute`)

		}

		else if (options == "isUgly") {

			interaction.reply(`https://cataas.com/cat/ugly`)

		}

		// else if (options == "isOld") {

		// 	interaction.reply(`https://cataas.com/cat/old`)

		// }
	}
	},
};

const fs = require('node:fs');
process.on('unhandledRejection', error =>
{
	console.log("Error detected! Saving to error log...")
	let s = new Date().toLocaleString();
	const read = fs.readFileSync('./ErrorLog.txt', 'utf8', err => {if (err) {console.log(err)}}) 
	const data = `${read}\n${s}: ${error}`
	//console.log(data)
	fs.writeFileSync('./ErrorLog.txt', data, err =>{ if (err) {console.error(err);}
		// file written successfully
		console.log("Successfully wrote error!")
	});
});