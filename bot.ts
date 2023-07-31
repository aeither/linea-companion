import { Bot, InlineKeyboard, InputFile } from "grammy";

import { MetaMaskSDK, MetaMaskSDKOptions } from "@metamask/sdk";
import QRCode from "qrcode";

import dotenv from "dotenv";
dotenv.config();

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN not found");
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot(BOT_TOKEN);

let sdk: MetaMaskSDK | undefined | null;

// Utility functions
function extractBase64Data(dataUrl: string) {
  const prefix = "data:image/png;base64,";
  const startIndex = dataUrl.indexOf(prefix);

  if (startIndex !== -1) {
    return dataUrl.substring(startIndex + prefix.length);
  } else {
    // If the prefix is not found, return null or handle the error as needed.
    return null;
  }
}

// Handle the /start command.
const connectKeyboard = new InlineKeyboard().text(
  "Open Metamask Mobile",
  "connect:key"
);

// Handle the /start command.
bot.command("connect", async (ctx) => {
  const options: MetaMaskSDKOptions = {
    shouldShimWeb3: false,
    dappMetadata: {
      name: "NodeJS example",
    },
    logging: {
      sdk: false,
    },
    checkInstallationImmediately: false,
    // openDeeplink: (link: string) => {
    //   console.log("modals:opendeeplink:", link)
    // },
    // useDeeplink: true,
    // Optional: customize modal text
    modals: {
      onPendingModalDisconnect() {
        console.log("onPendingModalDisconnect");
      },
      install: ({ link }) => {
        // console.log("modals:install:", link);

        QRCode.toDataURL(link)
          .then((url) => {
            // console.log(url);
            const base64Data = extractBase64Data(url);
            if (!base64Data) return;

            var imgbase = Buffer.from(base64Data, "base64");
            ctx.replyWithPhoto(new InputFile(imgbase, "filename"));
            ctx.reply(
              "Connect with QR from PC or use the button to connect from mobile",
              {
                reply_markup: connectKeyboard,
              }
            );
          })
          .catch((err) => {
            console.error(err);
          });

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

  sdk = new MetaMaskSDK(options);
  console.debug("connecting...");
  const accounts = await sdk.connect();

  console.debug("Accounts:", accounts);
  ctx.reply(`Connected with ${accounts}`);
});

bot.command("stop", (ctx) => {
  console.log("stop");
  if (!sdk) {
    ctx.reply("Start connection first");
    return;
  }

  // Close previous sessions
  //
  sdk.disconnect();
  sdk.terminate();
  sdk = null
  ctx.reply("Terminated");
});

// Handle other messages.
bot.on("message:text", async (ctx) => {
  console.debug(`start NodeJS example`);

  if (!sdk) {
    ctx.reply("Start connection first");
    return;
  }

  const ulink = sdk.getUniversalLink();
  sdk.disconnect;
  console.log("🚀 ~ file: bot.ts:54 ~ bot.on ~ ulink:", ulink);
  const activeEthereum  = sdk?.activeProvider
  const ethereum = sdk.getProvider();

  console.log('activeProvider: ', typeof activeEthereum)
  console.log('ethereum: ', typeof ethereum)

  const chainId = await ethereum.request<string>({
    method: "eth_chainId",
    params: [],
  });
  console.debug("chainId: ", chainId);
  ctx.reply("Got another message!");
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
