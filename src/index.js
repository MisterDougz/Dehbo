const Discord = require('discord.js')
const fs = require('fs')
const path = require('path')

const config = require('../config.json')

const bot = new Discord.Client()
bot.commands = new Discord.Collection()
bot.queues = new Map()

const commandFiles = fs
  .readdirSync(path.join(__dirname, '/commands'))
  .filter((filename) => filename.endsWith('.js'))

for (let filename of commandFiles) {
  const command = require(`./commands/${filename}`)

  for (name of command.names) {
    bot.commands.set(name, command)
  }
}

bot.login(config.token)

bot.on('ready', () => {
  bot.user.setPresence({
    activity: {
      type: 'LISTENING',
      name: 'Rainy Day - MrDougz (avaible on SoundCloud)',
    },
    status: 'idle',
  })
})

bot.on('message', (msg) => {
  if (!msg.content.startsWith(config.prefix) || msg.author.bot) return

  const args = msg.content.slice(config.prefix.length).split(' ')
  const command = args.shift().toLowerCase()
  try {
    bot.commands.get(command).execute(bot, msg, args)
  } catch (err) {
    return
  }
})