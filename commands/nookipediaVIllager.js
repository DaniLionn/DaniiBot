const {
    SlashCommandBuilder,
    EmbedBuilder
} = require('discord.js');
const fs = require('node:fs');
const https = require('https');
const {
    NookipediaAPIKey
} = require('../configure.json');
const {
    dirname
} = require('path');
//const { abort } = require('node:process');
const appDir = dirname(require.main.filename);

const options = {
    headers: {
        'x-api-key': NookipediaAPIKey
    }
}

const defaultEmbedColour = 0x91EC7D
const fishEmbedColour = 0x4ABBD7
const bugEmbedColour = 0x51D74A
const deepSeaColour = 0x1A2693

function FormatKey(code) {
    
    if (code === "DNM") {
        return "Dōbutsu no Mori"
    } else if (code === "AC") {
        return "Animal Crossing GCN"
    } else if (code === "E_PLUS") {
        return "Dōbutsu no Mori e+"
    } else if (code === "WW") {
        return "Animal Crossing: Wild World"
    } else if (code === "CF") {
        return "Animal Crossing: City Folk"
    } else if (code === "NL") {
        return "Animal Crossing: New Leaf"
    } else if (code === "WA") {
        return "Animal Crossing New Leaf: Welcome amiibo"
    } else if (code === "NH") {
        return "Animal Crossing: New Horizons"
    } else if (code === "FILM") {
        return "Gekijōban Dōbutsu no Mori (Animal Crossing the Movie)"
    } else if (code === "HHD") {
        return "Animal Crossing: Happy Home Designer"
    } else if (code === "PC") {
        return "Animal Crossing: Pocket Camp"
    } else if (code === "1") {
        return "January"
    } else if (code === "2") {
        return "Feburary"
    } else if (code === "3") {
        return "March"
    } else if (code === "4") {
        return "April"
    } else if (code === "5") {
        return "May"
    } else if (code === "6") {
        return "June"
    } else if (code === "7") {
        return "July"
    } else if (code === "8") {
        return "August"
    } else if (code === "9") {
        return "September"
    } else if (code === "10") {
        return "October"
    } else if (code === "11") {
        return "Novmeber"
    } else if (code === "12") {
        return "December"
    } else if (code === "NA") {
        return "Not avaliable"
    }
    
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
    
    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    
    return [year, month, day].join('-');
}
let date = new Date().toLocaleDateString()
console.log(formatDate(date));

//const { compare } = require('libsodium-wrappers');
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
        //give the bot time to think! we need to make sure we get all the data
        //console.log(appDir)
        await interaction.deferReply();
        
        let FinalJSON
        let appearances = ""
        let timesNorth = ""
        let timesSouth = ""
        
        if (interaction.options.getSubcommand() === 'villager') {
            
            try {
                https.get(`https://api.nookipedia.com/villagers?name=${interaction.options.getString('name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        
                        FinalJSON = JSON.parse(result)[0];
                        
                        console.log(FinalJSON, FinalJSON["appearances"])
                        if (FinalJSON) {
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
                            
                            await interaction.editReply({
                                embeds: [embed]
                            })
                        } else {
                            await interaction.editReply("No info for that villager was found!")
                        }
                    });
                    
                });
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'fish')) {
            
            let fishName = interaction.options.getString('fish-name').toLowerCase().replace(" ", "%20")
            
            try {
                https.get(`https://api.nookipedia.com/nh/fish/${fishName}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        
                        console.log(FinalJSON)
                        
                        if (FinalJSON) {
                            const embed = new EmbedBuilder()
                                .setColor(fishEmbedColour)
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
                                    value: `Regular: ${FinalJSON["sell_nook"].toString()}\nC.J.: ${FinalJSON["sell_cj"].toString()}`,
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
                            
                            await interaction.editReply({
                                embeds: [embed]
                            })
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                        
                    })
                })
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'bug')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/bugs/${interaction.options.getString('bug-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        if (FinalJSON) {
                            const embed = new EmbedBuilder()
                                .setColor(bugEmbedColour)
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
                                    value: `Regular: ${FinalJSON["sell_nook"].toString()}\nFlick: ${FinalJSON["sell_flick"].toString()}`,
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
                            
                            await interaction.editReply({
                                embeds: [embed]
                            })
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                        
                    })
                })
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'sea-creature')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/sea/${interaction.options.getString('sea-creature-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        
                        console.log(FinalJSON)
                        
                        if (FinalJSON) {
                            
                            const embed = new EmbedBuilder()
                                .setColor(deepSeaColour)
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
                                    value: `Regular: ${FinalJSON["sell_nook"].toString()}\nFlick: ${FinalJSON["sell_flick"].toString()}`,
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
                            
                            await interaction.editReply({
                                embeds: [embed]
                            })
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                    })
                })
                
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'clothing')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/clothing/${interaction.options.getString('clothing-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        
                        FinalJSON = JSON.parse(result);
                        if (FinalJSON) {
                            
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                    })
                })
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'tool')) {
            try {
                https.get(`https://api.nookipedia.com/nh/tools/${interaction.options.getString('tool-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        if (FinalJSON) {
                            
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                    })
                })
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
        } else if ((interaction.options.getSubcommand() === 'events-today')) {
            // let date = new Date().toLocaleDateString('en-US', {
            //     timeZone: 'America/Edmonton'
            // })
            console.log(formatDate(date));
            
            try {
                https.get(`https://api.nookipedia.com/nh/events?today`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        
                        let total = 0
                        
                        let max = 25
                        
                        console.log(FinalJSON)
                        //mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm wet diaper sludge
                        const embed = new EmbedBuilder()
                            .setColor(defaultEmbedColour)
                            .setTitle(`Events for ${formatDate(date)}`)
                        
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
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'events')) {
            console.log(formatDate(date));
            
            try {
                
                https.get(`https://api.nookipedia.com/nh/events?date=${interaction.options.getString('date')}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        
                        let total = 0
                        
                        let max = 25
                        
                        console.log(FinalJSON)
                        
                        if (FinalJSON) {
                            const embed = new EmbedBuilder()
                                .setColor(defaultEmbedColour)
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
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                        
                    })
                })
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
        } else if ((interaction.options.getSubcommand() === 'artwork')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/art/${interaction.options.getString('artwork-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        if (FinalJSON) {
                            
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                    })
                })
                
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'furniture')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/furniture/${interaction.options.getString('furniture-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        if (FinalJSON) {
                            
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                    })
                })
                
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'interior-item')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/interior/${interaction.options.getString('item-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        if (FinalJSON) {
                            
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                    })
                })
                
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'photo')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/photos/${interaction.options.getString('photo-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        if (FinalJSON) {
                            
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                    })
                })
                
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
                    await interaction.deleteReply();
                }, 3000)
            }
            
        } else if ((interaction.options.getSubcommand() === 'misc-item')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/items/${interaction.options.getString('misc-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        if (FinalJSON) {
                            
                        } else {
                            await interaction.editReply("An error occured!")
                            setTimeout(async function () {
                                await interaction.deleteReply();
                            }, 3000)
                        }
                    })
                })
                
            } catch {
                await interaction.editReply("An error occured!")
                setTimeout(async function () {
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
