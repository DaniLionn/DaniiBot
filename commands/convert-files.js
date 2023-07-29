const {
    SlashCommandBuilder
} = require('discord.js');
const ffmpegStatic = require('ffmpeg-static');
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegStatic);
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs-extra');
const {
    exec
} = require("child_process");

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
            
            await interaction.deferReply("Starting...", {
                ephemeral: true
            })
            
            setTimeout(async () => {
                
                const attachment = interaction.options.getAttachment("file")
                
                const extension = interaction.options.getString("extension")
                
                const newName = undefined
                
                const name = attachment.name
                const url = attachment.url
                const proxyURL = attachment.proxyURL
                
                let path
                let path2
                
                console.log(name, name.split(".")[0])
                
                console.log("downloading file")
                
                await interaction.editReply("Downloading...")
                
                const file = fs.createWriteStream(name);
                const request = https.get(url, function (response) {
                        response.pipe(file);
                        
                        // after download completed close filestream
                        file.on("finish", async () => {
                            
                            path = file.path
                            
                            if (extension.includes(".")) {
                                
                                console.log(".")
                                path2 = `${name.split(".")[0]}${extension}`
                                
                            } else {
                                path2 = `${name.split(".")[0]}.${extension}`
                            }
                            
                            console.log(path2)
                            file.close(); // close() is async, call cb after close completes.
                            
                            await interaction.editReply("Converting...")
                            exec(`ffmpeg -i ${path} ${path2}`, async (error, stdout, stderr) => {
                                    if (error) {
                                        console.log(`error: ${error.message}`);
                                        await interaction.channel.send("An error occured! Try checking what you're trying to convert to. Make sure it's a similar file type (for example, you can do mp3 to wav but not mp3 to txt)")
                                        return;
                                    }
                                    if (stderr) {
                                        console.log(`stderr: ${stderr}`);
                                        return;
                                    }
                                    console.log(`stdout: ${stdout}`);
                                    return
                                    
                                })
                                .on("close", async (code) => {
                                    console.log("done")
                                    console.log(code)
                                    
                                    if (code === 0) {
                                        await interaction.editReply("Finished!")
                                        await interaction.channel.send({
                                            content: `<@${interaction.user.id}> Your file was converted!`,
                                            files: [path2]
                                        })
                                        await interaction.deleteReply()
                                        
                                        setTimeout(() => {
                                            fs.unlink(path);
                                            fs.unlink(path2);
                                        }, 100)
                                    }
                                });;
                            
                        });
                    })
                    .on('error', function (err) { // Handle errors
                        fs.unlink(dest); // Delete the file async. (But we don't check the result)
                        
                    });
                
            }, 1150)
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
