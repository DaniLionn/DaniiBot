const { AttachmentBuilder, SlashCommandBuilder } = require('discord.js');
const fs = require('node:fs');
const {
    createCanvas,
} = require('@napi-rs/canvas');

const { path } = require('path')

let canvasX, canvasY

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

       let a 
       let b
       let c 

       let r = Math.random()

       if (r > 0.5) {
         a = Math.floor(Math.random() * canvasX)
       } else {
         a = Math.floor(Math.random() * canvasY)
       }

       r = Math.random()

       if (r > 0.5) {
         b = Math.floor(Math.random() * canvasX)
       } else {
         b = Math.floor(Math.random() * canvasY)
       }

       r = Math.random()

       if (r > 0.5) {
         c = Math.floor(Math.random() * canvasX)
       } else {
         c = Math.floor(Math.random() * canvasY)
       }

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
      var x =  Math.floor(Math.random() * canvasX)
      var y = Math.floor(Math.random() * canvasY)
      var w = Math.floor(Math.random() * canvasX)
      var h = Math.floor(Math.random() * canvasY)

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
      var x =  Math.floor(Math.random() * canvasX)
      var y = Math.floor(Math.random() * canvasY)
      var s = Math.floor(Math.random() * 100)



      ctx.fillStyle = randomHex()
      ctx.strokeStyle = randomHex()

      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2, true); 
      ctx.fill()

      ctx.beginPath();
      ctx.arc(x, y, s + 1, 0, Math.PI * 2, true); 
      ctx.stroke()
      ctx.closePath()

    } 
  }
 
module.exports = {
  data: new SlashCommandBuilder()
    .setName('draw')
    .setDescription('creates "art" ')
    .addBooleanOption(option =>
      option.setName('random-size')
          .setDescription('if the canvas will be a random size')
          .setRequired(true)),
  async execute(interaction) {
        await interaction.deferReply()

        const title = generateTitle()
        const fileName = `${title.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '_')}.png`
    
        let useRandom = interaction.options.getBoolean('random-size')

    console.log(useRandom)

        if (useRandom === true) {
          canvasX = random(256, 768)
          canvasY = random(256, 768)
        } else {
          canvasX = 512
          canvasY = 512
        }

        const canvas = createCanvas(canvasX, canvasY)
        const ctx = canvas.getContext('2d')

        ctx.fillStyle = randomHex()
        ctx.fillRect(0,0,canvasX, canvasX)
        ctx.lineWidth = 3

        triangles(ctx)

        rectangles(ctx)

        circles(ctx)


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