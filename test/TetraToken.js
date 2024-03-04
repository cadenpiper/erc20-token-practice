const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let tToken, accounts, deployer, receiver, exchange

	beforeEach(async () => {
		const TToken = await ethers.getContractFactory('TetraToken')
		tToken = await TToken.deploy('TetraToken', 'TTRA', '10000')
		await tToken.deployed()

		accounts = await ethers.getSigners()
		deployer = accounts[0]
		receiver = accounts[1]
		exchange = accounts[2]
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

	describe('Sending Tokens', () => {
		let amount, transaction, result

		beforeEach(async () => {
			amount = tokens(100)
			transaction = await tToken.connect(deployer).transfer(receiver.address, amount)
			result = await transaction.wait()
		})

		describe('Success', () => {
			it('transfers token balances', async () => {
				expect(await tToken.balanceOf(deployer.address)).to.equal(tokens(9900))
				expect(await tToken.balanceOf(receiver.address)).to.equal(amount)
			})

			it('emits a transfer event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Transfer')

				const args = event.args
				expect(args.from).to.equal(deployer.address)
				expect(args.to).to.equal(receiver.address)
				expect(args.value).to.equal(amount)
			})
		})

		describe('Failure', () => {
			it('rejects insufficient balances', async () => {
				const invalidAmount = tokens(100000)
				expect(await tToken.connect(deployer).transfer(receiver.address, amount)).to.be.reverted
			})

			it('rejects invalid recipient', async () => {
				const amount = tokens(100)
				expect(await tToken.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})
	})

	describe('Approving Tokens', () => {
		let amount, transaction, result

		beforeEach(async () => {
			amount = tokens(100)
			transaction = await tToken.connect(deployer).approve(exchange.address, amount)
			result = await transaction.wait()
		})

		describe('Success', () => {
			it('allocates an allowance for delegated token spending', async () => {
				expect(await tToken.allowance(deployer.address, exchange.address)).to.equal(amount)
			})

			it('emits an approval event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Approval')

				const args = event.args
				expect(args.owner).to.equal(deployer.address)
				expect(args.spender).to.equal(exchange.address)
				expect(args.value).to.equal(amount)
			})
		})

		describe('Failure', () => {
			it('rejects invalis spenders', async () => {
				await expect(tToken.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})
	})
})














