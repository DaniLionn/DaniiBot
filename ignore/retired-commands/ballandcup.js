const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');
var current = ""

const roleID = "1071943136760307743"

var canUse = true

const row = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('1')
					.setLabel('1')
					.setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
					.setCustomId('2')
					.setLabel('2')
					.setStyle(ButtonStyle.Primary),

                    new ButtonBuilder()
					.setCustomId('3')
					.setLabel('3')
					.setStyle(ButtonStyle.Primary),
			);

const gameStart = "⬛⬛⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛⬛⬛\n⬛🥤⬛🥤⬛🥤⬛\n⬛⬛⬛⬛⬛⬛⬛\n Guess which cup has the ball!\nYou have 10 seconds"

const opt1 = "⬛⬛⬛⬛⬛⬛⬛\n⬛🥤⬛⬛⬛⬛⬛\n⬛⚪⬛🥤⬛🥤⬛\n⬛⬛⬛⬛⬛⬛⬛"
const opt2 = "⬛⬛⬛⬛⬛⬛⬛\n⬛⬛⬛🥤⬛⬛⬛\n⬛🥤⬛⚪⬛🥤⬛\n⬛⬛⬛⬛⬛⬛⬛"
const opt3 = "⬛⬛⬛⬛⬛⬛⬛\n⬛⬛⬛⬛⬛🥤⬛\n⬛🥤⬛🥤⬛⚪⬛\n⬛⬛⬛⬛⬛⬛⬛"
module.exports = {
	data: new SlashCommandBuilder()
		.setName('ball-and-cup')
		.setDescription('a little guessing game'),
	async execute(interaction) {
        if (canUse === true) {
            canUse = false

            current = `${1 + Math.floor(Math.random() * 3)}`

            console.log(current)

		    await interaction.reply({ content: gameStart, components: [row] });

            const collector = interaction.channel.createMessageComponentCollector({ time: 10000 });

            collector.on('collect', async i => {

            const buttonId = i.customId

            if (buttonId === current) {

                if (current === "1") {

                    if (interaction.member.roles.cache.some(role => role.name === '🏅')) {
                        await i.update({ content: `${opt1}\nYou win! You've been given a medal. Check your roles!`, components: [] });
                      
                        const member = interaction.member
                      
                        member.roles.add(roleID);
                    } else {
                        await i.update({ content: `${opt1}\nYou win!`, components: [] });
                    }

                };

                if (current === "2") {
                    if (interaction.member.roles.cache.some(role => role.name === '🏅')) {
                        await i.update({ content: `${opt2}\nYou win! You've been given a medal. Check your roles!`, components: [] });
                        const member = interaction.member
                        member.roles.add(roleID);
                    } else {
                        await i.update({ content: `${opt2}\nYou win!`, components: [] });
                       
                    }


                };

                if (current === "3") {
                    if (interaction.member.roles.cache.some(role => role.name === '🏅')) {
                        await i.update({ content: `${opt3}\nYou win! You've been given a medal. Check your roles!`, components: [] });
                        const member = interaction.member
                        member.roles.add(roleID);
                    } else {
                        await i.update({ content: `${opt3}\nYou win!`, components: [] });
                       
                    }


                };

            } else {
                if (current === "1") {
                    await i.update({ content: `${opt1}\nYou lost...`, components: [] });
                    const member = interaction.member
                    member.roles.add(roleID);

                }

                if (current === "2") {
                    await i.update({ content: `${opt2}\nYou lost...`, components: [] });
                    const member = interaction.member
                    member.roles.add(roleID);

                }

                if (current === "3") {
                    await i.update({ content: `${opt3}\nYou lost...`, components: [] });
                    const member = interaction.member
                    member.roles.add(roleID);

                }
            };



	        
        });

       collector.on('end', collected => { console.log(`Collected ${collected.size} items`); canUse = true; interaction.deleteReply() });

	} else {
        await interaction.reply("Command cooldown still active!")
    }

}};
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