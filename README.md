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
- To test, follow the instructions to run the Telegram Bot locally. Live bot has issues, addressing with Consensys Team on Discord.

## Instruction

Generate a `.env` file and include `INFURA_KEY` from your Infura dashboard's Linea testnet section, as well as `BOT_TOKEN` obtained from Telegram's BotFather.

Execute the subsequent commands in your terminal.

```bash
pnpm install
```

```bash
pnpm run dev
```

Access and initiate the bot on Telegram.

## Summary

Effortlessly link your wallet, track balances, earn points, mint NFTs, and ensure smart contract security, all within a unified platform. Linea Companion simplifies your Linea experience from the beginning.

Why we built it
- Eliminating the risk of sharing private keys with a Telegram bot
- Risky initial smart contracts on emerging blockchains
- Addressing the demand for an enhanced mobile user experience

What we built
- Swift and secure integration with Metamask Mobile, eliminating the need to share private keys
- Assessment of smart contract security
- User-friendly initial onboarding steps for a seamless mobile experience

## Features

### Establish wallet connection using the Metamask SDK within Telegram

<img src="https://github.com/aeither/linea-companion/assets/36173828/a23e80dd-2b53-4bec-a9c0-7b464ed4ddfb" alt="Logo" width="420" >

```jsx
const options: MetaMaskSDKOptions = { ... }
// ...
sdk = new MetaMaskSDK(options);
const accounts = await sdk.connect();
```

### Retrieve wallet statistics such as balance using Infura

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

### Mint inaugural NFT on Linea to encounter the swiftness and cost-efficiency of the blockchain, utilizing ethers and the ThirdWeb contract

```jsx
  const ethereum = sdk.getProvider();
  const provider = new ethers.providers.Web3Provider(ethereum as any);

  const signer = provider.getSigner();

  let contract = new ethers.Contract(contractAddress, ABI, signer);
  // Claim (Address, Uint256, Uint256, Address, Uint256, Bytes32[], Uint256, Uint256, Address, Bytes)
  const tx = await contract.claim(
    userAddress,
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
```

### Acquire points to unlock the future utility of the bot

```jsx
  const ethereum = sdk.getProvider();
  const provider = new ethers.providers.Web3Provider(ethereum as any);
  const signer = provider.getSigner();

  let contract = new ethers.Contract(contractAddress, POINTS_ABI, signer);
  ctx.reply("Approve in your wallet");
  const tx = await contract.increasePointsBy20();

  console.log("transaction: ", tx);
  // wait for the transaction to actually settle in the blockchain
  await tx.wait();

  await ctx.reply("Points successfully claimed");
```

### Ensure the security of protocol contracts using GoPlus

```jsx
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/${LINEA_TESTNET}?contract_addresses=${message.text}`,
      options
    );

    const data = await response.json();
```

## Technology used

- grammyjs
- TypeScript
- ethers
- Solidity
- Metamask SDK
- Infura
- GoPlus
- ThirdWeb

## Deployed contracts

Thirdweb NFT contract on Linea Testnet

https://explorer.goerli.linea.build/address/0xaa3c28B91f40A8ca2e8C8C4835C5Bd92c145e222

Gamified Points smart contract. The source of the smart contract can be found under `/contracts` folder

https://explorer.goerli.linea.build/address/0x2e0bB37BE1987a123e9F4290eB8a3ed377F52664

## Future plans

- Mainnet Deployment
- Incorporation of Bridge Functionality
- Integration of Swap Functionality
- Enable Group Access for Bot
- Portfolio Dashboard

## Screenshots

![go-plus](https://github.com/aeither/linea-companion/assets/36173828/ff41c955-ad17-4171-894c-cb585036cd6e)

![infura](https://github.com/aeither/linea-companion/assets/36173828/8d0b2dd8-6d46-4080-b525-44f86a8b8a0b)
