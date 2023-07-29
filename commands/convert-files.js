const {
    SlashCommandBuilder
} = require('discord.js');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs-extra');
module.exports = {
        data: new SlashCommandBuilder()
            .setName('convert-file')
            .setDescription("uses ffmpeg to convert a file")
            .addAttachmentOption(option =>
                option.setName('file')
                .setDescription('the file to convert')
                .setRequired(true))
            .addStringOption(option =>
                option.setName('extension')
                .setDescription('the file you want to convert to')
                .setRequired(true)
            ),
        async execute(interaction) {
            
            await interaction.deferReply()
            
            const attachment = interaction.options.getAttachment("file")
            
            const extension = interaction.options.getString("extension")
            
            const name = attachment.name
            const url = attachment.url
            const proxyURL = attachment.proxyURL
            
            let path
            
            console.log("downloading file")
            
            const file = fs.createWriteStream(name);
            const request = https.get(url, function (response) {
                    response.pipe(file);
                    
                    // after download completed close filestream
                    file.on("finish", () => {
                        


                        console.log("Download Completed", file.path);

                        fs.move(file.path, `../tempConvert/${file.path}`, err => {
                            if (err) return console.error(err)
                            console.log('success!')
                          })
                        
                        path = file.path
                        file.close(cb); // close() is async, call cb after close completes.
                    });
                })
                .on('error', function (err) { // Handle errors
                    fs.unlink(dest); // Delete the file async. (But we don't check the result)
                    if (cb) cb(err.message);
                });
            
            
    
        }
        
    },
    
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
