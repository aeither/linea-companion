import { Bot } from "grammy";
import { BotCommand } from "grammy/types";
import dotenv from "dotenv";
dotenv.config();

const commands: BotCommand[] = [
  { command: "connect", description: "Connect to your Metamask Mobile" },
  {
    command: "utility",
    description: "Check your address balance and earn points",
  },
  {
    command: "mint",
    description: "Mint your first NFT on Linea",
  },
  {
    command: "stop",
    description: "Disconnect wallet",
  },
  { command: "goplus", description: "Check smart contract security" },
];

/**
 * Update commands
 * Test and Live Bot
 */
if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN not found");
const BOT_TOKEN = process.env.BOT_TOKEN;

async function main() {
  const liveBot = new Bot(BOT_TOKEN);
  await liveBot.api.setMyCommands(commands);
}

main()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e);

    process.exit(1);
  });
