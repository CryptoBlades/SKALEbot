// require('dotenv').config();
const fs = require ("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { Client, Intents, Collection } = require ("discord.js");
const Discord = require('discord.js')
// const wait = require('node:timers/promises').setTimeout;
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES
	]
});
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));

const commands = [];
client.commands = new Collection();

for (const file of commandFiles){
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
	client.commands.set(command.data.name, command);
}

// Runs when client connects to Discord.
client.on('ready', async () => {
	console.log('Logged in as', client.user.tag)
	const CLIENT_ID = client.user.id;
	const rest = new REST({
		version: "9"	
	}).setToken(process.env.DISCORD_TOKEN);
	(async() => {
		try{
			if (process.env.ENV === "production"){
				await rest.put(Routes.applicationCommands(CLIENT_ID), {
					body: commands
				});
				console.log("Success fully registered commands globally.")
			}
			else{
				await rest.put(Routes.applicationGuildCommands(CLIENT_ID,process.env.SERVER_ID), {
					body: commands
				});
				console.log("Success fully registered commands locally.")
			}
		}
		catch(err){
			console.log(err);
		}
	})();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try{
		await command.execute(interaction);
	}
	catch(err){
		console.log(err);
		try{
			await interaction.editReply("An error occured while executing that command. Please contact Dev");
		}
		catch(err){
			console.log(err)
			await interaction.editReply({
			content: "An error occured while executing that command. Please contact a Dev",
			emphemeral: true
			});
		}
	}
});

client.login(process.env.DISCORD_TOKEN)
