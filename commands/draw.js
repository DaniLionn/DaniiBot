const { SlashCommandBuilder } = require('discord.js');

const {
    createCanvas,
} = require('@napi-rs/canvas');

function generateTitle() {

    var name_prefixes = ["Master", "Mr.", "Professor", "Mrs.", "Princess", "Prince", "The Pauper's", "The", "Betsy", "Billy", "Johnny"];
  
    var primary_nouns = ["Crystal", "Bugle", "Dreamer", "Dream", "Castle", "Moss", "Mountain", "Pit", "Bigfoot", "Dream maker", "Oathbreaker", "Bard", "X'arahan'tu", "Magic", "Acorn", "Sun", "Son", "Stump", "Arm"];
  
    var adjectives = ["Lost", "Five", "Faded", "Ancient", "Blackened", "Den of", "Despairing", "Golden", "Many", "Merry", "Clever", "Wonderful", "Sullen", "Angry", "Little", "Cowardly", "Silver", "Lasting", "Heavy", "Festive", "Gleeful", "Enchanted", "Wise", "Wistful", "Dark", "Untold"];
  
    var secondary_nouns = ["Hearts", "Stones", "Diamond Dogs", "Painted Toes", "Songs", "Tales", "Lords", "Promise", "Screams", "Plagues", "Dreams", "Roads", "Curses", "Spells", "Gloam", "Lands", "Marsh", "Hearts", "Rules", "Swamp", "Tale", "Apex", "Beggar"];
  
    var name_prefix = sample(name_prefixes);
  
    var primary_noun = sample(primary_nouns);
  
    var adjective = sample(adjectives);
  
    var secondary_noun = sample(secondary_nouns);
  
    var title = "";
  
    if (Math.random() < 0.5) {
  
      title = `${name_prefix} ${primary_noun} and the ${adjective} ${secondary_noun}`;
  
    } else {
  
      title = `The ${adjective} ${secondary_noun} of ${name_prefix} ${primary_noun}`;
  
    }
  
    return title;
  
  }

module.exports = {
	data: new SlashCommandBuilder()
		.setName('draw')
		.setDescription('creates "art" '),
	async execute(interaction) {
        await interaction.deferReply()

        const title = generateTitle()
        const fileName = `${title}.png`

        const canvas = createCanvas(512, 512)
        const ctx = canvas.getContext('2d')

        for (let i = 0; i < Math.floor(Math.random() * 4) + 1; i++) {

            ctx.fillStyle = Math.floor(Math.random()*16777215).toString(16);;
            ctx.strokeStyle = Math.floor(Math.random()*16777215).toString(16);;

            var x =  Math.floor(Math.random() * 512)

            var y = Math.floor(Math.random() * 512)

            var w = Math.floor(Math.random() * 512)
            
            var h = Math.floor(Math.random() * 512)

            if (w > x) {
                w = w - x
            }

            if (h > y) {
                h = h - y
            }

            ctx.strokeRect(x, y, w, h)
            ctx.fillRect(x, y, w, h)

            
          } 

          const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
            name: fileName
        });
        
            interaction.editReply(`Here's your drawing! I call it "${title}".`,{
                files: [attachment]
            });
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