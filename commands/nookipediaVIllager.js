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

function GetGameString(code) {
    
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
            .setName('clothing')
            .setDescription('info about an article of clothing ')
            .addStringOption(option => option.setName('clothing-name').setDescription('The clothing you want info about').setRequired(true)))
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
                                appearances = appearances + `\n${GetGameString(FinalJSON["appearances"][i])},`
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
                                    value: GetGameString(FinalJSON["debut"]),
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

                        const embed = new EmbedBuilder()
                                .setColor(defaultEmbedColour)
                                .setTitle(FinalJSON["name"])
                                .setURL(FinalJSON["url"])
                                .setThumbnail(FinalJSON["image_url"])
                                .addFields({
                                    name: 'Number',
                                    value: FinalJSON["number"]
                                }, {
                                    name: 'Location',
                                    value: FinalJSON["location"]
                                }, {
                                    name: 'Shadow Size',
                                    value: FinalJSON["shadow_size"],
                                }, {
                                    name: 'Rarity',
                                    value: FinalJSON["rarity"],
                                }, {
                                    name: 'Catches needed to unlock',
                                    value: FinalJSON["total_catch"],
                                }, {
                                    name: 'Sell Price',
                                    value: `Regular: ${FinalJSON["sell_nook"]}\nC.J.: ${FinalJSON["sell_cj"]}`,
                                }, {
                                    name: '"Catch"phrase',
                                    value: FinalJSON["catchphrases"][0],
                                },)
                            
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
            
        } else if ((interaction.options.getSubcommand() === 'bug')) {
            
            try {
                https.get(`https://api.nookipedia.com/nh/bugs/${interaction.options.getString('bug-name').toLowerCase()}`, options, (response) => {
                    
                    var result = ''
                    response.on('data', function (chunk) {
                        result += chunk;
                    });
                    
                    response.on('end', async function () {
                        FinalJSON = JSON.parse(result);
                        await interaction.editReply("Not implemented yet")
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
                        await interaction.editReply("Not implemented yet")
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
