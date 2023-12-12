const { SlashCommandBuilder } = require("discord.js");

const farts = [
  "assets/farts/fart1.mp3",
  "assets/farts/fart2.mp3",
  "assets/farts/fart3.mp3",
  "assets/farts/fart4.mp3",
  "assets/farts/fart5.mp3",
  "assets/farts/fart6.mp3",
  "assets/farts/fart7.mp3",
  "assets/farts/fart8.mp3",
  "assets/farts/fart9.mp3",
  "assets/farts/fart10.mp3",
  "assets/farts/fart11.mp3",
  "assets/farts/fart12.mp3",
  "assets/farts/fart13.mp3",
  "assets/farts/fart14.mp3",
  "assets/farts/fart15.mp3",
  "assets/farts/fart16.mp3",
];

const wait = require("node:timers/promises").setTimeout;

module.exports = {
  data: new SlashCommandBuilder().setName("fart").setDescription("fart"),

  async execute(interaction) {
    await interaction.reply({
      files: [farts[Math.floor(Math.random() * farts.length)]],
    });
  },
};
