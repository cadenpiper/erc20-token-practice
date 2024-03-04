const hre = require("hardhat");

async function main() {

	const TToken = await ethers.getContractFactory('TetraToken')
	const tToken = await TToken.deploy('TetraToken', 'TTRA', '10000')
	await tToken.deployed()

	console.log(`Tetra Token deployed to: ${tToken.address}`)

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
