const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const {
    createCanvas,
} = require('@napi-rs/canvas');

const { path } = require('path')

function random(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomHex() {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`
}


function sample(array) {

    const index = Math.floor(Math.random() * array.length);
  
    return array[index];
  
  }



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

  function triangles(ctx) {
     //triangles
     for (let i = 0; i < random(3, 6); i++) {

      let a = Math.floor(Math.random() * 512)
      let b = Math.floor(Math.random() * 512)
      let c = Math.floor(Math.random() * 512)

      ctx.fillStyle = randomHex()
      ctx.strokeStyle = randomHex()

      ctx.beginPath()
      ctx.moveTo(a, b)
      ctx.lineTo(b, c)
      ctx.lineTo(c, a)
      ctx.fill()

      ctx.beginPath()
      ctx.moveTo(a+1, b+1)
      ctx.lineTo(b+1, c+1)
      ctx.lineTo(c+1, a+1)
      ctx.stroke()
      ctx.closePath()

    }
  }

  function rectangles(ctx) {
    //rectangles
    for (let i = 0; i < random(3, 6); i++) {
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

      ctx.fillStyle = randomHex()
      ctx.strokeStyle = randomHex()

      ctx.strokeRect(x, y, w, h)
      ctx.fillRect(x, y, w, h)


    } 
  }

  function circles(ctx) {
    for (let i = 0; i < random(3, 6); i++) {
      var x =  Math.floor(Math.random() * 512)
      var y = Math.floor(Math.random() * 512)
      var s = Math.floor(Math.random() * 100)



      ctx.fillStyle = randomHex()
      ctx.strokeStyle = randomHex()

      ctx.strokeRect(x, y, w, h)
      ctx.fillRect(x, y, w, h)

      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2, true); // Outer circle
      ctx.fill()

      ctx.beginPath();
      ctx.arc(x, y, s + 1, 0, Math.PI * 2, true); // Outer circle
      ctx.stroke()
      ctx.closePath()

    } 
  }
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('draw')
    .setDescription('creates "art" '),
  async execute(interaction) {
        await interaction.deferReply()

        const title = generateTitle()
        const fileName = `${title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_')}.png`
    
        const canvas = createCanvas(512, 512)
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = randomHex()
        ctx.fillRect(0,0,512,512)
        ctx.lineWidth = 3

       

        for (let index = 0; index < 3; index++) {
          
          let pick = Math.floor(Math.random() * 3)

          if (pick === 0) {
            triangles()
          } else if (pick === 1) {
            circles()
          } else if (pick === 2) {
            triangles()
          }
          
        } 



          const pngData = await canvas.encode('png') 

    fs.writeFile(`./DanibotTempFolder/${fileName}`, pngData, async function(err) {
        if(err) {
            return console.log(err);
        }
      
        await interaction.editReply({
          content: `Here's your drawing! I call it "${title}".`,
          files: [`./DanibotTempFolder/${fileName}`] 
        })

      setTimeout(() => {
        fs.unlink(`./DanibotTempFolder/${fileName}`, function (err) {
          if (err) throw err;
        });

      }, 1000)

        
  })



        //   const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        //     name: fileName
        // });
        


    }};

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