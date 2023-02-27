// https://github.com/AnIdiotsGuide/guidebot/blob/master/LICENSE
// Modified by shadowsword#0179

if (Number(process.version.slice(1).split(".")[0]) < 16) throw new Error("Node 16.x + required.")

require("dotenv").config();

const fs = require('fs');
const path = require('path')

let Config = process.env;

const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');

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

// For now we're just going to use classical handling.

const commandPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandPath, file);
  const plugin = require(filePath);
  if ('help' in plugin && 'run' in plugin) {
    client.commands.set(plugin.help.name, plugin)
    plugin.conf.aliases.forEach(alias => {
      client.aliases.set(alias, plugin.help.name)
    })
  }
  console.log(`${Config.PREFIX}[${plugin.help.name}] Load OK`);
}
client.login(Config.KEYRING)
