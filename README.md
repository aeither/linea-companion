<br />
<div align="center">
  <a href="https://github.com/aeither/azuro-telegram-bot">
    <img src="https://github.com/aeither/linea-companion/assets/36173828/f2a8e5f6-da3c-49d6-908a-2c2706dddc19" alt="Logo" width="120" >
  </a>

<h3 align="center">Linea Companion</h3>
  <p align="center">
    Seamless gamified onboarding to Linea with Metamask Mobile on Telegram
    <br />
  </p>
</div>

# Linea Companion

- [Go to Telegram](https://t.me/LineaCompanionBot)

## Instruction

Create `.env` file and add INFURA_KEY from infura dashboard linea testnet. BOT_TOKEN from Telegram BotFather Bot.

Run the following commands in the terminal.

```bash
pnpm install
```

```bash
pnpm run dev
```

## Summary

Seamlessly connect your wallet, monitor your balance, earn valuable points, mint NFTs, and ensure smart contracts security, all in one place. Linea Companion helps you get started with Linea.

Why we built it
- Share private keys to Telegram bot is risky
- Risky first smart contracts on new blockchains
- Need for better mobile experience

What we built
- Quickly and securely connect with Metamask Mobile without sharing private key
- Check smart contracts safety
- Intuitive first steps to get users onboarded on mobile

## Features

### Connect wallet with Metamask SDK in Telegram

<img src="https://github.com/aeither/linea-companion/assets/36173828/a23e80dd-2b53-4bec-a9c0-7b464ed4ddfb" alt="Logo" width="420" >

```jsx
const options: MetaMaskSDKOptions = { ... }
// ...
sdk = new MetaMaskSDK(options);
const accounts = await sdk.connect();
```

### Get wallet statistics like balance with infura

```jsx
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
      options
    );
    data = await response.json();
    // ...
  }
```

### Mint First NFT on Linea to experience the blockchain speed and low fee

## Technology used

grammyjs, typescript, ethers, solidity, metamask SDK, infura, go-plus, thirdweb

## More

...
