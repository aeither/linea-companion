import { Bot, Context, InlineKeyboard, InputFile, session } from "grammy";
import { MetaMaskSDK, MetaMaskSDKOptions } from "@metamask/sdk";
import QRCode from "qrcode";
import {
  type Conversation,
  type ConversationFlavor,
  conversations,
  createConversation,
} from "@grammyjs/conversations";
import { Menu } from "@grammyjs/menu";

import dotenv from "dotenv";
import { MaliciousAddressResponse } from "./types";
import { ABI } from "./abi";
import { POINTS_ABI } from "./points-abi";
import { BigNumber, ethers } from "ethers";
dotenv.config();

type MyContext = Context & ConversationFlavor;
type MyConversation = Conversation<MyContext>;

if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN not found");
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Bot<MyContext>(BOT_TOKEN);
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

if (!process.env.INFURA_KEY) throw new Error("INFURA_KEY not found");
const INFURA_KEY = process.env.INFURA_KEY;

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

// Conversation
async function tokenSecurity(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("What is your address?");
  const { message } = await conversation.wait();
  if (!message) return;

  const options = { method: "GET" };

  // "59140" means Linea Testnet;
  const LINEA_TESTNET = 59140;
  let status = 0;

  try {
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/${LINEA_TESTNET}?contract_addresses=${message.text}`,
      options
    );

    const data = await response.json();
    console.log(data);
    status = data.code;
    await ctx.reply(`${status}, The contract is safe`);
  } catch (err) {
    console.error(err);
    await ctx.reply(`The contract is NOT safe`);
  }
}
const TOKEN_SECURITY = "goplus-token-security";
bot.use(createConversation(tokenSecurity, TOKEN_SECURITY));

async function maliciousAddress(conversation: MyConversation, ctx: MyContext) {
  await ctx.reply("What is your address?");
  const { message } = await conversation.wait();
  if (!message) return;

  const options = { method: "GET" };

  // "59140" means Linea Testnet;
  const LINEA_TESTNET = 59140;

  try {
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/address_security/${message.text}`,
      options
    );

    const data: MaliciousAddressResponse = await response.json();
    console.log(data);

    await ctx.reply(
      `cybercrime: ${data.result.cybercrime}\n` +
        `money_laundering: ${data.result.money_laundering}\n` +
        `number_of_malicious_contracts_created: ${data.result.number_of_malicious_contracts_created}\n` +
        `gas_abuse: ${data.result.gas_abuse}\n` +
        `financial_crime: ${data.result.financial_crime}\n` +
        `darkweb_transactions: ${data.result.darkweb_transactions}\n` +
        `reinit: ${data.result.reinit}\n` +
        `phishing_activities: ${data.result.phishing_activities}\n` +
        `fake_kyc: ${data.result.fake_kyc}\n` +
        `blacklist_doubt: ${data.result.blacklist_doubt}\n` +
        `fake_standard_interface: ${data.result.fake_standard_interface}\n` +
        `data_source: ${data.result.data_source}\n` +
        `stealing_attack: ${data.result.stealing_attack}\n` +
        `blackmail_activities: ${data.result.blackmail_activities}\n` +
        `sanctioned: ${data.result.sanctioned}\n` +
        `malicious_mining_activities: ${data.result.malicious_mining_activities}\n` +
        `mixer: ${data.result.mixer}\n` +
        `honeypot_related_address: ${data.result.honeypot_related_address}\n`
    );
  } catch (err) {
    console.error(err);
    await ctx.reply(`The contract is NOT safe`);
  }
}
const MALICIOUS_ADDRESS = "malicious-address";
bot.use(createConversation(maliciousAddress, MALICIOUS_ADDRESS));

// Menu
const MAIN_MENU = "root-menu";
const SETTINGS_SUBMENU = "settings";
const main = new Menu(MAIN_MENU)
  .text("Welcome", (ctx) => ctx.reply("Hi!"))
  .row()
  .submenu("More", SETTINGS_SUBMENU);
bot.use(main);

const settings = new Menu(SETTINGS_SUBMENU)
  .text("Show Balance", (ctx) => ctx.reply("123"))
  .back("<< Go Back");
main.register(settings, MAIN_MENU);

// Handle the /start command.
const connectKeyboard = new InlineKeyboard().text(
  "Open Metamask Mobile",
  "connect:key"
);

const goplusKeyboard = new InlineKeyboard()
  .text("Malicious Address", "goplus:malicious-address")
  .row()
  .text("Token Security", "goplus:token-security")
  .row()
  .text("NFT Security", "goplus:nft-security")
  .row()
  .text("Security Info", "goplus:security-info")
  .row()
  .text("Sig Data", "goplus:signature-data")
  .row()
  .text("Phishing Site", "goplus:phising-site")
  .row();
const menuKeyboard = new InlineKeyboard()
  .text("Balance", "menu:balance")
  .text("Gas", "menu:gas");

/**
 * On callback, voice and text
 */
bot.callbackQuery("menu:balance", async (ctx) => {
  let data;

  if (!sdk) {
    ctx.reply("Please connect first");
    return;
  }
  const ethereum = sdk.getProvider();
  const provider = new ethers.providers.Web3Provider(ethereum as any);
  const signer = provider.getSigner();
  const address = await signer.getAddress();

  const payload = {
    jsonrpc: "2.0",
    method: "eth_getBalance",
    params: [address, "latest"],
    id: "59140",
  };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(
      `https://linea-goerli.infura.io/v3/${INFURA_KEY}`,
      // `https://linea-mainnet.infura.io/v3/${INFURA_KEY}`,
      options
    );
    data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }

  const balance = BigNumber.from(data.result).toString();
  const formattedBalance = ethers.utils.formatUnits(balance, 18);
  ctx.reply(`Your balance is: ${formattedBalance} eth`);
  ctx.answerCallbackQuery(); // remove loading animation
});

bot.callbackQuery("menu:gas", async (ctx) => {
  let data;

  const payload = {
    jsonrpc: "2.0",
    method: "eth_gasPrice",
    params: [],
    id: "1",
  };
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  };

  try {
    const response = await fetch(
      `https://linea-mainnet.infura.io/v3/${INFURA_KEY}`,
      options
    );
    data = await response.json();
    console.log(data);
  } catch (err) {
    console.error(err);
  }

  ctx.reply(`The gas fee is: ${data.result}`);
  ctx.answerCallbackQuery(); // remove loading animation
});

bot.callbackQuery("goplus:malicious-address", async (ctx) => {
  await ctx.conversation.enter(MALICIOUS_ADDRESS);

  // ctx.reply(`Your balance is: `);
  // ctx.answerCallbackQuery(); // remove loading animation
});

bot.callbackQuery("goplus:token-security", async (ctx) => {
  await ctx.conversation.enter(TOKEN_SECURITY);

  // ctx.reply(`Your balance is: `);
  // ctx.answerCallbackQuery(); // remove loading animation
});

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

  if (sdk) {
    ctx.reply("Already connected");
    return;
  }
  sdk = new MetaMaskSDK(options);
  console.debug("connecting...");
  const accounts = await sdk.connect();

  console.debug("Accounts:", accounts);
  ctx.reply(`Connected with ${accounts}`);
});

bot.command("stop", (ctx) => {
  console.log("stop");
  if (!sdk) {
    ctx.reply("Please connect first");
    return;
  }

  // Close previous sessions
  sdk.disconnect();
  sdk.terminate();
  sdk = null;
  ctx.reply("Terminated");
});

bot.command("goplus", async (ctx) => {
  await ctx.reply("Fast, reliable, and convenient security services: ", {
    reply_markup: goplusKeyboard,
  });
});

bot.command("addpoints", async (ctx) => {
  if (!sdk) {
    ctx.reply("Please connect first");
    return;
  }

  // Points Contract
  const contractAddress = "0x5145Dc366F25f96f219850F5aCaD50DF76eE424D";
  const ethereum = sdk.getProvider();
  const provider = new ethers.providers.Web3Provider(ethereum as any);

  const signer = provider.getSigner();

  let contract = new ethers.Contract(contractAddress, POINTS_ABI, signer);
  const tx = await contract.increasePointsBy20();

  console.log("transaction: ", tx);
  // wait for the transaction to actually settle in the blockchain
  await tx.wait();

  await ctx.reply("Fast, reliable, and convenient security services: ", {
    reply_markup: goplusKeyboard,
  });
});

bot.command("mint", async (ctx) => {
  if (!sdk) {
    ctx.reply("Please connect first");
    return;
  }

  const contractAddress = "0xaa3c28B91f40A8ca2e8C8C4835C5Bd92c145e222";
  const ethereum = sdk.getProvider();
  const provider = new ethers.providers.Web3Provider(ethereum as any);

  const signer = provider.getSigner();

  let contract = new ethers.Contract(contractAddress, ABI, signer);
  // Claim (Address, Uint256, Uint256, Address, Uint256, Bytes32[], Uint256, Uint256, Address, Bytes)
  const tx = await contract.claim(
    "0x5052936D3c98d2d045da4995d37B0DaE80C6F07f",
    0,
    1,
    "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    0,
    {
      proof: [],
      quantityLimitPerWallet: "0",
      pricePerToken: "0",
      currency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
    },
    []
  );

  console.log("transaction: ", tx);
  // wait for the transaction to actually settle in the blockchain
  await tx.wait();

  await ctx.reply("Fast, reliable, and convenient security services: ", {
    reply_markup: goplusKeyboard,
  });
});

// Handle other messages.
// bot.on("message:text", async (ctx) => {
//   console.debug(`Start Telegram Bot`);

//   if (!sdk) {
//     ctx.reply("Please connect first");
//     return;
//   }

//   const activeEthereum = sdk?.activeProvider;
//   const ethereum = sdk.getProvider();
//   // ethereum.request({method: "", params: })

//   console.log("activeProvider: ", typeof activeEthereum);
//   console.log("ethereum: ", typeof ethereum);

//   const provider = new ethers.providers.Web3Provider(ethereum as any);
//   const signer = provider.getSigner();
//   const address = await signer.getAddress();
//   console.log("🚀 ~ file: bot.ts:299 ~ bot.on ~ address:", address);

//   const chainId = await ethereum.request<string>({
//     method: "eth_chainId",
//     params: [],
//   });
//   console.debug("chainId: ", chainId);
//   ctx.reply("Got another message!", { reply_markup: menuKeyboard });
// });

bot.command("balance", (ctx) =>
  ctx.reply("Check Balance", { reply_markup: menuKeyboard })
);

bot.command("help", (ctx) => ctx.reply(HELP_MESSAGE));

export const HELP_MESSAGE =
  "Hey, 👋!, \n" +
  "Seamlessly connect your wallet, monitor your balance, \n" +
  "earn valuable points, mint NFTs, and ensure contract address security, all in one place. \n\n" +
  "Get started with Linea experience with our feature-packed bot. \n\n";

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
