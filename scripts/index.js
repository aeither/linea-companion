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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const commands = [
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
    { command: "help", description: "Help" },
];
/**
 * Update commands
 * Test and Live Bot
 */
if (!process.env.BOT_TOKEN)
    throw new Error("BOT_TOKEN not found");
const BOT_TOKEN = process.env.BOT_TOKEN;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const liveBot = new grammy_1.Bot(BOT_TOKEN);
        yield liveBot.api.setMyCommands(commands);
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () { }))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    process.exit(1);
}));
