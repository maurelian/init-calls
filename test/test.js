const multisend = require('../index.js'); // eslint-disable-line

const EIP20 = artifacts.require('EIP20');
const DataLogger = artifacts.require('DataLogger');
let SBX;
let JBX;
let GBX;
let NBX;
let MBX;
let DL;


contract('EIP20', (accounts) => {
  before(async () => {
    SBX = await EIP20.new(10000, 'Simon Bucks', 1, 'SBX');
    JBX = await EIP20.new(5000, 'John Bucks', 1, 'JBX');
    GBX = await EIP20.new(200, 'Goncalo Bucks', 1, 'GBX');
    NBX = await EIP20.new(12345, 'Niran Bucks', 1, 'NBX');
    MBX = await EIP20.new(54321, 'Mike Bucks', 1, 'MBX');
    DL = await DataLogger.new();
  });

  it('creation: should create the correct initial balances for the creator', async () => {
    const balanceSBX = await SBX.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceSBX.toNumber(), 10000);
    const balanceJBX = await JBX.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceJBX.toNumber(), 5000);
    const balanceGBX = await GBX.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceGBX.toNumber(), 200);
    const balanceNBX = await NBX.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceNBX.toNumber(), 12345);
    const balanceMBX = await MBX.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceMBX.toNumber(), 54321);
  });

  it('generate data: outputs valid bytecode', () => {
    const transferSBX = {
      to: accounts[1],
      value: web3.toHex(500),
      token: SBX.address,
    };
    const txData = multisend.getTxData([transferSBX]);
    try {
      web3.toAscii(txData);
    } catch (e) {
      assert.fail(e);
    }
  });

  // This test isn't really working, but by ensuring it fails, we can get Truffle to print out the
  // log data, which shows it's sending the right call data
  it('sends call data to a contract', (done) => {
    // send a tansaction to a contract that just logs the data
    const transferSBX = {
      to: accounts[1],
      value: web3.toHex(5001), // error here when hex has an odd number of characters
      token: DL.address,
    };
    // let's make 4 calls
    const txData = multisend.getTxData([transferSBX, transferSBX, transferSBX, transferSBX]);

    // send the transaction
    web3.eth.sendTransaction({ data: txData, from: accounts[0] }, (e, r) => {
      assert.strictEqual(e, null);
      assert.equal(1, 2); // force failure to print logs
      web3.eth.getTransactionReceipt(r, (err, result) => {
        assert(result);
        done();
      });
    });
  });

  // This test fails, because msg.sender is not the account sending the transaction, it is the
  // new address of the contract that would be created by this transaction
  it.skip('transfers a single token\'s balance', async (done) => {
    const balanceSBX0 = await SBX.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceSBX0.toNumber(), 10000);

    const transferSBX = {
      to: accounts[1],
      value: web3.toHex(5001), // error here when hex has an odd number of characters
      token: SBX.address,
    };
    const txData = multisend.getTxData([transferSBX]);

    // send the transaction
    web3.eth.sendTransaction({ data: txData, from: accounts[0] }, async (e, r) => {
      console.log(r);
      assert.strictEqual(e, null);
      const balanceSBX1 = await SBX.balanceOf.call(accounts[1]);
      assert.strictEqual(balanceSBX1.toNumber(), 5001);
      done();
    });
  });
});
