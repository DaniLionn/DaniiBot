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

const VillagerOptions = {
    headers: {
        'x-api-key': NookipediaAPIKey
    }
}

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

//const { compare } = require('libsodium-wrappers');
module.exports = {
        data: new SlashCommandBuilder()
            .setName('nookipedia')
            .setDescription('get various animal crossing related info')
            .addSubcommand(subcommand =>
                subcommand
                .setName('villager')
                .setDescription('info about a villager')
                .addStringOption(option => option.setName('name').setDescription('The villager you want info about'))),
        async execute(interaction) {
            //give the bot time to think! we need to make sure we get all the data
            //console.log(appDir)
            await interaction.deferReply();
            
            let FinalJSON
            let appearances = ""
            
            if (interaction.options.getSubcommand() === 'villager') {
                https.get(`https://api.nookipedia.com/villagers?name=${interaction.options.getString('name').toLowerCase()}`, VillagerOptions, (response) => {
                        
                        var result = ''
                        response.on('data', function (chunk) {
                            result += chunk;
                        });
                        
                        response.on('end', async function () {
                                
                                FinalJSON = JSON.parse(result)[0];
                                
                                console.log(FinalJSON, FinalJSON["appearances"])

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
                                            value: FinalJSON["species"]
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
                                            name: 'Quote',
                                            value: `"${FinalJSON["quote"]}"`,
                                        }, {
                                            name: 'Clothing',
                                            value: FinalJSON["clothing"],
                                        }, {
                                            name: 'Debut Game',
                                            value: GetGameString(FinalJSON["debut"]),
                                        },{
                                            name: 'Appearances',
                                            value: appearances,
                                        })
                                    
                                    await interaction.editReply({
                                        embeds: [embed]
                                    })
                                });
                            
                        });
                    
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
        