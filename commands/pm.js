const { SlashCommandBuilder } = require('discord.js');

const messages = ["hello", "yo", " hey how are you doing", "heyy", "i am dani bot", "😱", "😀", "yo yo waffle stick i really think you smell like wooden flooring with cheese involved", "afosdklfbmdskjlfvkjnmakjwlfsdvnmdjlk;fdvjnm,zjldk;vjnm zdkjlkvnmc,m", "Unfortunately you'd better stop with that popcorn mess of the butter, so that you could have it for a movie theater actually, so that you could drink a soda and then eat a candy and then-- burp Excuse me. Eat popcorn. So- grunt I was in a movie theater and I eat popcorn with a- seasoning cheese- and then, I drink a cherry sprite in the movie theater. And that was ago when I was actually well about that. Plus I would rather- eat chocolate, as well. So, that butter mess; clean it up please. So, I don't wanna cause any more troublemakers.", "hi"]

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pm')
		.setDescription("danibot will send you a private message"),


	async execute(interaction) {
        await interaction.deferReply()
        await interaction.deleteReply()
        await interaction.member.send(messages[Math.floor(Math.random() * messages.length)])
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