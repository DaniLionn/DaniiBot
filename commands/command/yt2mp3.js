const {
    SlashCommandBuilder,
} = require('discord.js');
const fs = require('node:fs');
const youtubeMp3Converter = require('youtube-mp3-converter')
const extractUrls = require("extract-urls");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('youtube-to-mp3')
        .setDescription('downloads a YouTube video as an mp3. Supports up to 10 downloads at once!')
        .addStringOption(option =>
            option.setName('url')
            .setDescription('The youtube url(s).')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('dm')
            .setDescription('whether danibot should dm you the file or not')
            .setRequired(true)
            .addChoices({
                name: 'true',
                value: 'dm'
            }, {
                name: 'false',
                value: 'dontDM'
            }, )),
    
    async execute(interaction) {
        await interaction.reply("Downloading your videos... I'll notify you when they're done.", {
            ephemeral: true
        });
        var text = interaction.options.getString('url')
        var dm = interaction.options.getString('dm')
        var paths = []
        let urls = extractUrls(text)
        
        let total = urls.length
        let completed = 0
        //console.log(text)
        const convertLinkToMp3 = youtubeMp3Converter('./tempYoutubeDownloads')
        
        urls.forEach(async url => {
                

                if (paths.length <= 10) {
                    //console.log(`Started download on video ${url}`)

                    const pathToMp3 = await convertLinkToMp3(url)

                    //console.log("adding path")

                    paths.push(pathToMp3)

                    //console.log(`Downloaded video ${url} as mp3 to path ${pathToMp3}!`)

                    completed += 1
                }
                
                
                
                if (completed === total) {
                    //console.log("Sending mp3s!")
                    
                    //console.log(paths.length)
                    if (paths.length === 1) {
                        if (dm === "dm") {
                            await interaction.user.send({
                                content: `Your mp3 is ready!`,
                                files: paths
                            })
                        } else {
                            await interaction.channel.send({
                                content: `<@${interaction.user.id}> Your mp3 is ready!`,
                                files: paths
                            })
                        }
                    } else {
                        if (dm === "dm") {
                            await interaction.user.send({
                                content: `Your mp3s are ready!`,
                                files: paths
                            })
                        } else {
                            await interaction.channel.send({
                                content: `<@${interaction.user.id}> Your mp3s are ready!`,
                                files: paths
                            })
                        }
                    }
                    
                    await interaction.deleteReply()
                    
                    setTimeout(() => {
                        paths.forEach((path) => {
                            try {
                                fs.unlinkSync(path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }
                        })
                    }, 2000)
                }
                
            }
            
        )
    },
    
};
process.on('unhandledRejection', error => {
    console.log("Error detected! Saving to error log...")
    let s = new Date()
        .toLocaleString();
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
        console.log("Successfully wrote error!")
    });
});
