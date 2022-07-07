const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');

if (process.env.TOKEN !== 'production') {
    require('dotenv').config();
}

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();

// lokasi daftar perintah bot
const commandsPath = path.join(__dirname, 'src/commands/');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
}

// pesan ketika bot online
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

client.login(process.env.TOKEN);