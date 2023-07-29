import { Bot } from "grammy";

import { MetaMaskSDK, MetaMaskSDKOptions } from "@metamask/sdk";

import dotenv from "dotenv";
dotenv.config();

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN not found");
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot(BOT_TOKEN);

const options: MetaMaskSDKOptions = {
  shouldShimWeb3: false,
  dappMetadata: {
    name: "NodeJS example",
  },
  logging: {
    sdk: false,
  },
  checkInstallationImmediately: false,
  openDeeplink: (link: string) => {
    console.log(link)
  },
  // Optional: customize modal text
  modals: {
    onPendingModalDisconnect() {
      console.log("onPendingModalDisconnect")
    },
    install: ({ link }) => {
      console.log(link);
      // qrcode.generate(link, { small: true }, (qr) => console.log(qr));
      return {};
    },
    otp: () => {
      return {
        mount() {},
        updateOTPValue: (otpValue) => {
          if (otpValue !== "") {
            console.debug(
              `[CUSTOMIZE TEXT] Choose the following value on your metamask mobile wallet: ${otpValue}`
            );
          }
        },
      };
    },
  },
};

const sdk = new MetaMaskSDK(options);

// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", async (ctx) => {
  console.debug(`start NodeJS example`);
  
  // Close previous sessions
  // sdk.terminate()

  const accounts = await sdk.connect();
  console.log("🚀 ~ file: bot.ts:52 ~ bot.on ~ accounts:", accounts);

  // const ulink = sdk.getUniversalLink();
  // console.log("🚀 ~ file: bot.ts:54 ~ bot.on ~ ulink:", ulink);

  // console.log('connect request accounts', accounts);
  // const ethereum = sdk.getProvider();
  ctx.reply("Got another message!");
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
