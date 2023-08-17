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

### Mint First NFT on Linea to experience the blockchain speed and low fee with ethers + thirdweb contract

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

### Claim points to use Linea Companion Bot for future utility

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

### Make sure the contract of protocols are secure with GoPlus

```jsx
    const response = await fetch(
      `https://api.gopluslabs.io/api/v1/token_security/${LINEA_TESTNET}?contract_addresses=${message.text}`,
      options
    );

    const data = await response.json();
```

## Technology used

grammyjs, typescript, ethers, solidity, metamask SDK, infura, GoPlus, thirdweb

## Future plans

- Deploy on mainnet
- Add Bridge functionality
- Add Swap functionality
- Make bot callable from groups
- Portfolio Dashboard

...
