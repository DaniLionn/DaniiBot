const {
	SlashCommandBuilder,
	EmbedBuilder,
	AttachmentBuilder
} = require('discord.js');
const {
	readFile
} = require('fs/promises');
const {
	NookipediaAPIKey
} = require('../configure.json');
const {
	createCanvas,
	Image,
} = require('@napi-rs/canvas');
const fs = require('node:fs');
const https = require('https');

const commonFunc = require('../mymodules/commonFunctions.js');

const options = {
	headers: {
		'x-api-key': NookipediaAPIKey
	}
}

const EmbedColours = {
	//colours are in hex
	["Default"]: 0x91EC7D,
	["Fish"]: 0x4ABBD7,
	["Bug"]: 0x51D74A,
	["DeepSeaCreature"]: 0x1A2693,
    ["Fossil"]: 0x5955CF,
	["Artwork"]: 0xFAFDAB,
}

function FormatKey(key) {
	if (key === "DNM") {
		return "Dōbutsu no Mori"
	} else if (key === "AC") {
		return "Animal Crossing GCN"
	} else if (key === "E_PLUS") {
		return "Dōbutsu no Mori e+"
	} else if (key === "WW") {
		return "Animal Crossing: Wild World"
	} else if (key === "CF") {
		return "Animal Crossing: City Folk"
	} else if (key === "NL") {
		return "Animal Crossing: New Leaf"
	} else if (key === "WA") {
		return "Animal Crossing New Leaf: Welcome amiibo"
	} else if (key === "NH") {
		return "Animal Crossing: New Horizons"
	} else if (key === "FILM") {
		return "Gekijōban Dōbutsu no Mori (Animal Crossing the Movie)"
	} else if (key === "HHD") {
		return "Animal Crossing: Happy Home Designer"
	} else if (key === "PC") {
		return "Animal Crossing: Pocket Camp"
	}
}

function FormatCurrency(num, currency) {

	let formatted = commonFunc.formatNumberWithCommas(num)

	return formatted + ` ${currency}`
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nookipedia')
		.setDescription('get various animal crossing related info')
		.addSubcommand(subcommand =>
			subcommand
			.setName('villager')
			.setDescription('info about a villager')
			.addStringOption(option => option.setName('name').setDescription('The villager you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('fish')
			.setDescription('info about a fish')
			.addStringOption(option => option.setName('fish-name').setDescription('The fish you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('bug')
			.setDescription('info about a bug')
			.addStringOption(option => option.setName('bug-name').setDescription('The bug you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('sea-creature')
			.setDescription('info about a sea creature')
			.addStringOption(option => option.setName('sea-creature-name').setDescription('The sea creature you want info about').setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
            .setName('fossil')
            .setDescription('info about a fossil')
            .addStringOption(option => option.setName('fossil-name').setDescription('The fossil you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('artwork')
			.setDescription('info about a piece of artwork')
			.addStringOption(option => option.setName('art-name').setDescription('The artwork you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('furniture')
			.setDescription('info about a piece of furniture')
			.addStringOption(option => option.setName('furniture-name').setDescription('The piece of furniture you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('interior_item')
			.setDescription('info about an interior item')
			.addStringOption(option => option.setName('item-name').setDescription('The interior item you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('clothing')
			.setDescription('info about an article of clothing ')
			.addStringOption(option => option.setName('clothing-name').setDescription('The clothing you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('photo')
			.setDescription("info about a villager's photo")
			.addStringOption(option => option.setName('photo-name').setDescription('The photo you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('misc-item')
			.setDescription('info about a miscellaneous item')
			.addStringOption(option => option.setName('misc-name').setDescription('The miscellaneous item you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('diy')
			.setDescription('info about a diy recipe ')
			.addStringOption(option => option.setName('diy-name').setDescription('The diy recipe you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('tool')
			.setDescription('info about a tool')
			.addStringOption(option => option.setName('tool-name').setDescription('The tool you want info about').setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
			.setName('events-today')
			.setDescription('events happening in game right now'))
		.addSubcommand(subcommand =>
			subcommand
			.setName('events')
			.setDescription('events happening on the specified date')
			.addStringOption(option => option.setName('date').setDescription('The date you want event info about (MUST BE FORMATTED AS YYYY-MM-DD)').setRequired(true))),

	async execute(interaction) {
		//do later: figure out how to handle when no data is returned
		await interaction.deferReply();

		let FinalJSON
		let appearances = ""

		if (interaction.options.getSubcommand() === 'villager') {

			try {
				https.get(`https://api.nookipedia.com/villagers?name=${interaction.options.getString('name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {

						FinalJSON = JSON.parse(result)[0];

						console.log(FinalJSON, FinalJSON["appearances"])
						if (!FinalJSON["title"] || !FinalJSON === '') {
							for (var i = 0; i < FinalJSON["appearances"].length; i++) {
								appearances = appearances + `\n${FormatKey(FinalJSON["appearances"][i])},`
							}

							const embed = new EmbedBuilder()
								.setColor(FinalJSON["title_color"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Species',
									value: `${FinalJSON["species"]} (${FinalJSON["id"]})`
								}, {
									name: 'Personality',
									value: FinalJSON["personality"]
								}, {
									name: 'Gender',
									value: FinalJSON["gender"],
								}, {
									name: 'Birthday',
									value: `${FinalJSON["birthday_month"]} ${FinalJSON["birthday_day"]}`,
								}, {
									name: 'Star Sign',
									value: FinalJSON["sign"],
								}, {
									name: 'Catchphrase',
									value: `"${FinalJSON["phrase"]}"`,
								}, {
									name: 'Quote',
									value: `"${FinalJSON["quote"]}"`,
								}, {
									name: 'Clothing',
									value: FinalJSON["clothing"],
								}, {
									name: 'Debut Game',
									value: FormatKey(FinalJSON["debut"]),
								}, {
									name: 'Appearances',
									value: appearances,
								})
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("No info for that villager was found!")
						}
					});

				});
			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'fish')) {

			let fishName = interaction.options.getString('fish-name').toLowerCase().replace(" ", "%20")

			try {
				https.get(`https://api.nookipedia.com/nh/fish/${fishName}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);

						console.log(FinalJSON)

						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Fish"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, {
									name: 'Location',
									value: FinalJSON["location"]
								}, {
									name: 'Shadow Size',
									value: FinalJSON["shadow_size"],
								}, {
									name: 'Catches needed to unlock',
									value: FinalJSON["total_catch"].toString(),
								}, {
									name: 'Sell Price',
									value: `Regular: ${FormatCurrency(FinalJSON["sell_nook"], "Bells")}\nC.J.: ${FormatCurrency(FinalJSON["sell_cj"], "Bells")}`,
								}, {
									name: '"Catch" phrase',
									value: `"${FinalJSON["catchphrases"][0]}"`,
								}, {
									name: 'Avaliability',
									value: `Northern Hemisphere: ${FinalJSON["north"]["months"]}\nSouthern Hemisphere: ${FinalJSON["south"]["months"]}`,
								}, {
									name: 'Times',
									value: `*Northern Hemisphere:* \nJanuary: ${FinalJSON["north"]["times_by_month"]["1"]}\nFeburary: ${FinalJSON["north"]["times_by_month"]["2"]}\nMarch: ${FinalJSON["north"]["times_by_month"]["3"]}\nApril: ${FinalJSON["north"]["times_by_month"]["4"]}\nMay: ${FinalJSON["north"]["times_by_month"]["5"]}\nJune: ${FinalJSON["north"]["times_by_month"]["6"]}\nJuly: ${FinalJSON["north"]["times_by_month"]["7"]}\nAugust: ${FinalJSON["north"]["times_by_month"]["8"]}\nSeptember: ${FinalJSON["north"]["times_by_month"]["9"]}\nOctober: ${FinalJSON["north"]["times_by_month"]["10"]}\nNovember: ${FinalJSON["north"]["times_by_month"]["11"]}\nDecember: ${FinalJSON["north"]["times_by_month"]["12"]}\n\n*Southern Hemisphere:* \nJanuary: ${FinalJSON["south"]["times_by_month"]["1"]}\nFeburary: ${FinalJSON["south"]["times_by_month"]["2"]}\nMarch: ${FinalJSON["south"]["times_by_month"]["3"]}\nApril: ${FinalJSON["south"]["times_by_month"]["4"]}\nMay: ${FinalJSON["south"]["times_by_month"]["5"]}\nJune: ${FinalJSON["south"]["times_by_month"]["6"]}\nJuly: ${FinalJSON["south"]["times_by_month"]["7"]}\nAugust: ${FinalJSON["south"]["times_by_month"]["8"]}\nSeptember: ${FinalJSON["south"]["times_by_month"]["9"]}\nOctober: ${FinalJSON["south"]["times_by_month"]["10"]}\nNovember: ${FinalJSON["south"]["times_by_month"]["11"]}\nDecember: ${FinalJSON["south"]["times_by_month"]["12"]}`,
								})
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}

					})
				})
			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'bug')) {

			try {
				https.get(`https://api.nookipedia.com/nh/bugs/${interaction.options.getString('bug-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);
						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Bug"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, {
									name: 'Location',
									value: FinalJSON["location"]
								}, {
									name: 'Catches needed to unlock',
									value: FinalJSON["total_catch"].toString(),
								}, {
									name: 'Sell Price',
									value: `Regular: ${FormatCurrency(FinalJSON["sell_nook"], "Bells")}\nFlick: ${FormatCurrency(FinalJSON["sell_flick"], "Bells")}`,
								}, {
									name: '"Catch" phrase',
									value: `"${FinalJSON["catchphrases"][0]}"`,
								}, {
									name: 'Avaliability',
									value: `Northern Hemisphere: ${FinalJSON["north"]["months"]}\nSouthern Hemisphere: ${FinalJSON["south"]["months"]}`,
								}, {
									name: 'Times',
									value: `*Northern Hemisphere:* \nJanuary: ${FinalJSON["north"]["times_by_month"]["1"]}\nFeburary: ${FinalJSON["north"]["times_by_month"]["2"]}\nMarch: ${FinalJSON["north"]["times_by_month"]["3"]}\nApril: ${FinalJSON["north"]["times_by_month"]["4"]}\nMay: ${FinalJSON["north"]["times_by_month"]["5"]}\nJune: ${FinalJSON["north"]["times_by_month"]["6"]}\nJuly: ${FinalJSON["north"]["times_by_month"]["7"]}\nAugust: ${FinalJSON["north"]["times_by_month"]["8"]}\nSeptember: ${FinalJSON["north"]["times_by_month"]["9"]}\nOctober: ${FinalJSON["north"]["times_by_month"]["10"]}\nNovember: ${FinalJSON["north"]["times_by_month"]["11"]}\nDecember: ${FinalJSON["north"]["times_by_month"]["12"]}\n\n*Southern Hemisphere:* \nJanuary: ${FinalJSON["south"]["times_by_month"]["1"]}\nFeburary: ${FinalJSON["south"]["times_by_month"]["2"]}\nMarch: ${FinalJSON["south"]["times_by_month"]["3"]}\nApril: ${FinalJSON["south"]["times_by_month"]["4"]}\nMay: ${FinalJSON["south"]["times_by_month"]["5"]}\nJune: ${FinalJSON["south"]["times_by_month"]["6"]}\nJuly: ${FinalJSON["south"]["times_by_month"]["7"]}\nAugust: ${FinalJSON["south"]["times_by_month"]["8"]}\nSeptember: ${FinalJSON["south"]["times_by_month"]["9"]}\nOctober: ${FinalJSON["south"]["times_by_month"]["10"]}\nNovember: ${FinalJSON["south"]["times_by_month"]["11"]}\nDecember: ${FinalJSON["south"]["times_by_month"]["12"]}`,
								})
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}

					})
				})
			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'sea-creature')) {

			try {
				https.get(`https://api.nookipedia.com/nh/sea/${interaction.options.getString('sea-creature-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);

						console.log(FinalJSON)

						if (!FinalJSON["title"] || !FinalJSON === '') {

							const embed = new EmbedBuilder()
								.setColor(EmbedColours["DeepSeaCreature"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, {
									name: 'Shadow Size',
									value: FinalJSON["shadow_size"],
								}, {
									name: 'Speed',
									value: FinalJSON["shadow_movement"],
								}, {
									name: 'Catches needed to unlock',
									value: FinalJSON["total_catch"].toString(),
								}, {
									name: 'Sell Price',
									value: `${FormatCurrency(FinalJSON["sell_nook"], "Bells")}`,
								}, {
									name: '"Catch" phrase',
									value: `"${FinalJSON["catchphrases"][0]}"`,
								}, {
									name: 'Avaliability',
									value: `Northern Hemisphere: ${FinalJSON["north"]["months"]}\nSouthern Hemisphere: ${FinalJSON["south"]["months"]}`,
								}, {
									name: 'Times',
									value: `*Northern Hemisphere:* \nJanuary: ${FinalJSON["north"]["times_by_month"]["1"]}\nFeburary: ${FinalJSON["north"]["times_by_month"]["2"]}\nMarch: ${FinalJSON["north"]["times_by_month"]["3"]}\nApril: ${FinalJSON["north"]["times_by_month"]["4"]}\nMay: ${FinalJSON["north"]["times_by_month"]["5"]}\nJune: ${FinalJSON["north"]["times_by_month"]["6"]}\nJuly: ${FinalJSON["north"]["times_by_month"]["7"]}\nAugust: ${FinalJSON["north"]["times_by_month"]["8"]}\nSeptember: ${FinalJSON["north"]["times_by_month"]["9"]}\nOctober: ${FinalJSON["north"]["times_by_month"]["10"]}\nNovember: ${FinalJSON["north"]["times_by_month"]["11"]}\nDecember: ${FinalJSON["north"]["times_by_month"]["12"]}\n\n*Southern Hemisphere:* \nJanuary: ${FinalJSON["south"]["times_by_month"]["1"]}\nFeburary: ${FinalJSON["south"]["times_by_month"]["2"]}\nMarch: ${FinalJSON["south"]["times_by_month"]["3"]}\nApril: ${FinalJSON["south"]["times_by_month"]["4"]}\nMay: ${FinalJSON["south"]["times_by_month"]["5"]}\nJune: ${FinalJSON["south"]["times_by_month"]["6"]}\nJuly: ${FinalJSON["south"]["times_by_month"]["7"]}\nAugust: ${FinalJSON["south"]["times_by_month"]["8"]}\nSeptember: ${FinalJSON["south"]["times_by_month"]["9"]}\nOctober: ${FinalJSON["south"]["times_by_month"]["10"]}\nNovember: ${FinalJSON["south"]["times_by_month"]["11"]}\nDecember: ${FinalJSON["south"]["times_by_month"]["12"]}`,
								})
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})

			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		}else if ((interaction.options.getSubcommand() === 'fossil')) {

			try {
				https.get(`https://api.nookipedia.com/nh/fossils/individuals/${interaction.options.getString('fossil-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {

                        let colours = ''

						FinalJSON = JSON.parse(result);

						console.log(FinalJSON)

                        for (const c in FinalJSON["colors"]) {
                            colours = colours + `\n${c}`
                        }

						if (!FinalJSON["title"] || !FinalJSON === '') {

                            let i = ""

                            if (FinalJSON["interactable"] == true) {
                                i = "Yes"
                            } else {
                                i = "No"
                            }

							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Fossil"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Fossil Group',
									value: FinalJSON["fossil_group"]
								}, {
									name: 'Sell Price',
									value: `${FormatCurrency(FinalJSON["sell"], "Bells")}`,
								},{
									name: 'Interactable',
									value: i,
								}, {
									name: 'HHA Base Points',
									value: FinalJSON["hha_base"].toString(),
								}, {
									name: 'Size',
									value: `${FinalJSON["width"]}x${FinalJSON["length"]} tiles`,
								},{
                                    name: 'Colours',
                                    value: colours,
                                },  )
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})

			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'clothing')) {

			try {
				https.get(`https://api.nookipedia.com/nh/clothing/${interaction.options.getString('clothing-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {

						FinalJSON = JSON.parse(result);
						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Default"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, )

							await interaction.editReply({
								embeds: [embed]
							})

						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})
			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}
			//
		} else if ((interaction.options.getSubcommand() === 'tool')) {
			try {
				https.get(`https://api.nookipedia.com/nh/tools/${interaction.options.getString('tool-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);
						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Default"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, )

							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})
			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}
		} else if ((interaction.options.getSubcommand() === 'events-today')) {
			let date = commonFunc.getLocaleString('America/Edmonton', 'localeDate')

			try {
				https.get(`https://api.nookipedia.com/nh/events?date=today`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);

						let total = 0

						let max = 25

						console.log(FinalJSON)
						//mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm wet diaper sludge
						const embed = new EmbedBuilder()
							.setColor(EmbedColours["Default"])
							.setTitle(`Events for ${commonFunc.formatDate_YYYY_MM_DD(date)}`)

						for (var i = 0; i < FinalJSON.length; i++) {
							total += 3

							if (total <= max) {
								embed.addFields({
									name: 'Event Name',
									value: FinalJSON[i]["event"]
								}, {
									name: 'Date',
									value: FinalJSON[i]["date"]
								}, {
									name: 'Type',
									value: FinalJSON[i]["type"],
								})
							}

						}

						await interaction.editReply({
							embeds: [embed]
						})
					})
				})
			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'events')) {


			try {

				https.get(`https://api.nookipedia.com/nh/events?date=${interaction.options.getString('date')}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);

						let total = 0

						let max = 25

						console.log(FinalJSON)

						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Default"])
								.setTitle(`Events for ${interaction.options.getString('date')}`)

							for (var i = 0; i < FinalJSON.length; i++) {
								total += 3

								if (total <= max) {
									embed.addFields({
										name: 'Event Name',
										value: FinalJSON[i]["event"]
									}, {
										name: 'Date',
										value: FinalJSON[i]["date"]
									}, {
										name: 'Type',
										value: FinalJSON[i]["type"],
									})
								}

							}

							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}

					})
				})
			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}
		} else if ((interaction.options.getSubcommand() === 'artwork')) {

			try {
				https.get(`https://api.nookipedia.com/nh/art/${interaction.options.getString('art-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);
						console.log(FinalJSON)

						if (!FinalJSON["title"] || !FinalJSON === '') {

							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Artwork"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["real_info"]["image_url"])
								.addFields({
									name: 'Real Name',
									value: FinalJSON["art_name"]
								}, {
									name: 'Art Type',
									value: FinalJSON["art_type"]
								}, {
									name: 'Art Info',
									value: `*Artist*\n${FinalJSON["author"]}\n\n*Year*\n${FinalJSON["year"]}\n\n*Method used*\n${FinalJSON["art_style"]}\n\n*Description*\n${FinalJSON["real_info"]["description"]}`
								}, {
									name: 'Prices',
									value: `*Buy*\n${FormatCurrency(FinalJSON["buy"], "Bells")}\n\n*Sell*\n${FormatCurrency(FinalJSON["sell"], "Bells")}`
								})
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							if (FinalJSON["has_fake"] === true) {
								//some artworks are always real, so check if the art can be fake 
								//before making the real vs fake image.
								const canvas = createCanvas(750, 500);
								const context = canvas.getContext('2d');

								if (FinalJSON["art_type"] === "Painting") {
									//paintings have slightly different data compared to statues.
									//we download the texture of the painting for the real vs fake image.
									commonFunc.download(FinalJSON["real_info"]["texture_url"], "real.png")
									commonFunc.download(FinalJSON["fake_info"]["texture_url"], "fake.png")
								} else {
									//statues don't have a texture image, it's just a render of the model used
									//for the statue. we download that image for the real vs fake image instead.
									commonFunc.download(FinalJSON["real_info"]["image_url"], "real.png")
									commonFunc.download(FinalJSON["fake_info"]["image_url"], "fake.png")
								}

								setTimeout(async () => {
									//timeout delay because i couldn't find another way to asynchronously
									//run the image loading code after images get downloaded
									const realImage = await readFile("./real.png");
									const fakeImage = await readFile("./fake.png")
									const real = new Image();
									real.src = realImage
									context.drawImage(real, 0, 0, canvas.width / 2, canvas.height);

									const fake = new Image();
									fake.src = fakeImage;
									context.drawImage(fake, canvas.width / 2, 0, canvas.width / 2, canvas.height);

									context.font = "32px Courier New";
									context.fillStyle = '#ffffff';
									context.strokeStyle = 'black';
									context.lineWidth = 6;
									context.strokeText("REAL", ((canvas.width / 2) / 2) / 2, (canvas.height - 10));
									context.fillText("REAL", ((canvas.width / 2) / 2) / 2, (canvas.height - 10));

									context.font = "32px Courier New";
									context.fillStyle = '#ffffff';
									context.strokeStyle = 'black';
									context.lineWidth = 6;
									context.strokeText("FAKE", canvas.width / 2 + (((canvas.width / 2) / 2) / 2), (canvas.height - 10));
									context.fillText("FAKE", canvas.width / 2 + (((canvas.width / 2) / 2) / 2), (canvas.height - 10));

									const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
										name: 'artguide.png'
									});

									embed.addFields({
										name: 'Fake difference',
										value: FinalJSON["fake_info"]["description"]
									})
									embed.setImage("attachment://artguide.png")

									await interaction.editReply({
										embeds: [embed],
										files: [attachment]
									})

								}, 750)
                                setInterval(() => {
                                    commonFunc.del(["./real.png", "./fake.png"])
                                }, 1000)
							} else {
								embed.addFields({
									name: 'Fake difference',
									value: "This artwork is always genuine."
								})

								embed.setImage(["real_info"]["texture_url"])
								await interaction.editReply({
									embeds: [embed]
								})
							}

						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})

			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'furniture')) {

			try {
				https.get(`https://api.nookipedia.com/nh/furniture/${interaction.options.getString('furniture-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);
						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Default"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, )
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})

			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'interior-item')) {

			try {
				https.get(`https://api.nookipedia.com/nh/interior/${interaction.options.getString('item-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);
						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Default"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, )
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})

			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'photo')) {

			try {
				https.get(`https://api.nookipedia.com/nh/photos/${interaction.options.getString('photo-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);
						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Default"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, )
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})

			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		} else if ((interaction.options.getSubcommand() === 'misc-item')) {

			try {
				https.get(`https://api.nookipedia.com/nh/items/${interaction.options.getString('misc-name').toLowerCase()}`, options, (response) => {

					var result = ''
					response.on('data', function(chunk) {
						result += chunk;
					});

					response.on('end', async function() {
						FinalJSON = JSON.parse(result);
						if (!FinalJSON["title"] || !FinalJSON === '') {
							const embed = new EmbedBuilder()
								.setColor(EmbedColours["Default"])
								.setTitle(FinalJSON["name"])
								.setURL(FinalJSON["url"])
								.setThumbnail(FinalJSON["image_url"])
								.addFields({
									name: 'Number',
									value: FinalJSON["number"].toString()
								}, )
                                .setFooter({text: `Source: ${FinalJSON["url"]}`})
							await interaction.editReply({
								embeds: [embed]
							})
						} else {
							await interaction.editReply("An error occured!")
							setTimeout(async function() {
								await interaction.deleteReply();
							}, 3000)
						}
					})
				})

			} catch (err) {
				console.log(err)
				await interaction.editReply("An error occured!")
				setTimeout(async function() {
					await interaction.deleteReply();
				}, 3000)
			}

		}
	}
}
process.on('unhandledRejection', error => {
	console.log(error)
	let s = new Date().toLocaleString();
	const read = fs.readFileSync('./ErrorLog.txt', 'utf8', err => {
		if (err) {
			console.log(err)
		}
	})
	const data = `${read}\n${s}: ${error}`
	//console.log(data)
	fs.writeFileSync('./ErrorLog.txt', data, err => {
		if (err) {
			console.error(err);
		}
		// file written successfully
	});
});