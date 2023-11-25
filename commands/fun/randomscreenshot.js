const { SlashCommandBuilder } = require("discord.js");

const imageURLs = [
  "https://rb.gy/dkkgpf",
  "https://rb.gy/ceuptp",
  "https://rb.gy/onluxg",
  "https://rb.gy/hxeftj",
  "https://rb.gy/9vvztj",
  "https://rebrand.ly/yb93zc9",
  "https://rebrand.ly/0efezmo",
  "https://rebrand.ly/6gn32ub",
  "https://rebrand.ly/igu2xhd",
  "https://rebrand.ly/n8f7iue",
  "https://rebrand.ly/02hvwum",
  "https://rebrand.ly/qvs58nc",
  "https://rebrand.ly/qvs58nc",
  "https://rebrand.ly/qvs58nc",
  "https://rebrand.ly/bb379aq",
  "https://rebrand.ly/bb379aq",
  "https://rebrand.ly/u8rra5w",
  "https://rebrand.ly/vd32kw3",
  "https://rebrand.ly/2xvwstd",
  "https://rebrand.ly/goui8zp",
  "https://rebrand.ly/4rs9oth",
  "https://rebrand.ly/l25zo68",
  "https://rebrand.ly/03j43uv",
  "https://rebrand.ly/7sd84br",
  "https://rebrand.ly/zl7m4qr",
  "https://rebrand.ly/69ewtkc",
  "https://rebrand.ly/elnscsa",
  "https://rebrand.ly/jz4oy5l",
  "https://rebrand.ly/xhwh54w",
  "https://rebrand.ly/0b20kz3",
  "https://rebrand.ly/3z5d0ok",
  "https://rebrand.ly/xis6m6d",
  "https://rebrand.ly/oi6igb5",
  "https://rebrand.ly/dah1rhj",
  "https://rebrand.ly/skoijjb",
  "https://rebrand.ly/u8ebyxn",
  "https://rebrand.ly/wp2a375",
  "https://rebrand.ly/b7al3or",
  "https://rebrand.ly/nrd9j10",
  "https://rebrand.ly/9fux5he",
  "https://rebrand.ly/7zc9nj9",
  "https://rebrand.ly/siw8z7w",
  "https://rebrand.ly/8n84fc7",
  "https://rebrand.ly/qk6jrs9",
  "https://rebrand.ly/yltu9pk",
  "https://rebrand.ly/o8cpryo",
  "https://rebrand.ly/99pwf6o",
  "https://rebrand.ly/y1pcs9u",
  "https://rebrand.ly/2wgiaf9",
  "https://rebrand.ly/7ttfe7g",
  "https://rebrand.ly/wop7khn",
  "https://rebrand.ly/e94eyhe",
  "https://rebrand.ly/1x746z2",
  "https://rebrand.ly/xc9zfo6",
  "https://rebrand.ly/nmw0suc",
  "https://rebrand.ly/z8722ch",
  "https://rebrand.ly/oxlt3oo",
  "https://rebrand.ly/oxlt3oo",
  "https://rebrand.ly/8ydpkpb",
  "https://rebrand.ly/itffs4q",
  "https://rebrand.ly/iqo13ft",
  "https://rebrand.ly/4oigchf",
  "https://i.imgur.com/CkPVEct.jpg",
  "https://i.imgur.com/m6MiLky.jpg",
  "https://i.imgur.com/RuIwY31.jpg",
  "https://rebrand.ly/j2r3bfu",
  "https://rebrand.ly/iid7yml",
  "https://rebrand.ly/l4b406u",
  "https://rebrand.ly/ek0oz11",
  "https://rebrand.ly/yd72glx",
  "https://rebrand.ly/7389q6f",
];
const imageURLs2 = [
  "https://rebrand.ly/gbk4p6d",
  "https://rebrand.ly/6ch2zcl",
  "https://rebrand.ly/coetb5m",
  "https://rebrand.ly/1ba67cl",
  "https://rebrand.ly/ovh7byw",
  "https://rebrand.ly/13wmee5",
  "https://rebrand.ly/j3h5mbo",
  "https://rebrand.ly/o6jt8sf",
  "https://rebrand.ly/ehqva98",
  "https://rebrand.ly/qcz80xn",
  "https://rebrand.ly/n6z9fm0",
  "https://rebrand.ly/42676b8",
  "https://rebrand.ly/gocx3qf",
  "https://rebrand.ly/50mg685",
  "https://rebrand.ly/bpzmnzv",
  "https://rebrand.ly/79kxcph",
  "https://rebrand.ly/fihb7ts",
  "https://rebrand.ly/9ho3oet",
  "https://rebrand.ly/9cb6fll",
  "https://rebrand.ly/us31c0d",
  "https://rebrand.ly/omfg3bc",
  "https://rebrand.ly/cs30iwb",
  "https://rebrand.ly/98jy6yp",
  "https://rebrand.ly/n1ljfv6",
  "https://rebrand.ly/opul0b1",
  "https://rebrand.ly/q15kce5",
  "https://rebrand.ly/kfbxf04",
  "https://rebrand.ly/c22thrn",
  "https://rebrand.ly/1iqbsve",
  "https://rebrand.ly/zkvwus7",
  "https://rebrand.ly/91xi3xg",
];

const imageAmount = imageURLs.length + imageURLs2.length;
module.exports = {
  data: new SlashCommandBuilder()
    .setName("random-image")
    .setDescription(
      `sends a random screenshot or image. quite a few are questionable. (currently ${imageAmount} images)`,
    ),

  async execute(interaction) {
    interaction.reply(imageURLs[Math.floor(Math.random() * imageURLs.length)]);
  },
};

const fs = require("node:fs");
process.on("unhandledRejection", (error) => {
  console.log("Error detected! Saving to error log...");
  let s = new Date().toLocaleString();
  const read = fs.readFileSync("./ErrorLog.txt", "utf8", (err) => {
    if (err) {
      console.log(err);
    }
  });
  const data = `${read}\n${s}: ${error}`;
  //console.log(data)
  fs.writeFileSync("./ErrorLog.txt", data, (err) => {
    if (err) {
      console.error(err);
    }
    // file written successfully
    console.log("Successfully wrote error!");
  });
});
