"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const sdk_1 = require("@metamask/sdk");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.BOT_TOKEN)
    throw new Error("BOT_TOKEN not found");
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new grammy_1.Bot(BOT_TOKEN);
const options = {
    shouldShimWeb3: false,
    dappMetadata: {
        name: "NodeJS example",
    },
    logging: {
        sdk: false,
    },
    checkInstallationImmediately: false,
    openDeeplink: (link) => {
        console.log(link);
    },
    // Optional: customize modal text
    modals: {
        onPendingModalDisconnect() {
            console.log("onPendingModalDisconnect");
        },
        install: ({ link }) => {
            console.log(link);
            // qrcode.generate(link, { small: true }, (qr) => console.log(qr));
            return {};
        },
        otp: () => {
            return {
                mount() { },
                updateOTPValue: (otpValue) => {
                    if (otpValue !== "") {
                        console.debug(`[CUSTOMIZE TEXT] Choose the following value on your metamask mobile wallet: ${otpValue}`);
                    }
                },
            };
        },
    },
};
const sdk = new sdk_1.MetaMaskSDK(options);
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    console.debug(`start NodeJS example`);
    // Close previous sessions
    // sdk.terminate()
    const accounts = yield sdk.connect();
    console.log("🚀 ~ file: bot.ts:52 ~ bot.on ~ accounts:", accounts);
    // const ulink = sdk.getUniversalLink();
    // console.log("🚀 ~ file: bot.ts:54 ~ bot.on ~ ulink:", ulink);
    // console.log('connect request accounts', accounts);
    // const ethereum = sdk.getProvider();
    ctx.reply("Got another message!");
}));
// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.
// Start the bot.
bot.start();
