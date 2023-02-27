// https://github.com/AnIdiotsGuide/guidebot/blob/master/LICENSE
// Modified by shadowsword#0179

if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x + required.")

require("dotenv").config();

const fs = require('fs');
const path = require('path')
//import * as dotenv from 'dotenv';

//const dotenv = require('dotenv')

let Config = process.env;

//import fs from 'fs';
//import path from 'node:path';

//import { readdirSync } from "fs";
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
//import { Collection } from 'discord.js'
//import { Client, Events, GatewayIntentBits } from "discord.js";

// Build a client with the gateway intents
const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.GuildMembers,
] });

// The new Client Ready status
client.once(Events.ClientReady, c => {
    console.log(`Ready as ${c.user.tag}`);
});

client.on(Events.MessageCreate, async message => {
  console.log(message.content)
})

client.commands = new Collection();
client.aliases = new Collection();

fs.readdirSync('./commands/', (err, files) => {
  if (err) console.log(err);
  console.log(`${files.length} found in commands.`)
  files.forEach(f => {
    let plugin = require(`./commands/${f}`);
    var pluginLoad = new Date();
    console.log(`${plugin.help.name} @ ${pluginLoad} OK`)
    client.commands.set(plugin.help.name, plugin);
    plugin.conf.aliases.forEach(alias => {
      client.aliases.set(alias, plugin.help.name)
    })
  })
})





/*
const commandsPath = '/home/cpi/nas/sabre-ii/commands/'
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  console.log(file)
  const filePath = path.join(commandsPath, file);
  //import * as command from filePath
  const command = require(filePath)
  if ('help' in command && 'run' in command) {
    client.commands.set(command.help.name, command);
  } else {
    console.log(`[WARNING] command ${filePath} missing "data" or "execute".`)
  }
}
*/
/*
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});
*/
client.login(Config.KEYRING)
