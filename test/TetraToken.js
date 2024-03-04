const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let tToken, accounts, deployer

	beforeEach(async () => {
		const TToken = await ethers.getContractFactory('TetraToken')
		tToken = await TToken.deploy('TetraToken', 'TTRA', '10000')
		await tToken.deployed()

		accounts = await ethers.getSigners()
		deployer = accounts[0]
	})

	describe('Deployment', () => {
		const name = 'TetraToken'
		const symbol = 'TTRA'
		const decimals = '18'
		const totalSupply = tokens('10000')

		it('has the correct name', async () => {
			expect(await tToken.name()).to.equal(name)
		})

		it('has the correct symbol', async () => {
			expect(await tToken.symbol()).to.equal(symbol)
		})

		it('has the correct decimals', async () => {
			expect(await tToken.decimals()).to.equal(decimals)
		})

		it('has the correct total supply', async () => {
			expect(await tToken.totalSupply()).to.equal(totalSupply)
		})

		it('assigns the total supply to the deployer', async () => {
			expect(await tToken.balanceOf(deployer.address)).to.equal(totalSupply)
		})

	})
})