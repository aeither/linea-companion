import { ethers } from "hardhat";

async function main() {
  const points = await ethers.deployContract("Points", []);
  await points.waitForDeployment();

  console.log(
    `Deployed to ${points.target}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
