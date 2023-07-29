import { Bot } from "grammy";
import dotenv from "dotenv";
dotenv.config()

if (!process.env.BOT_TOKEN) throw new Error('BOT_TOKEN not found')
const BOT_TOKEN = process.env.BOT_TOKEN
const bot = new Bot(BOT_TOKEN); 

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();