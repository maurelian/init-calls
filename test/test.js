const multisend = require('../index.js'); // eslint-disable-line

const EIP20 = artifacts.require('EIP20');
const DataLogger = artifacts.require('DataLogger');
let SBX;
let JBX;
let GBX;
let NBX;
let MBX;


contract('EIP20', (accounts) => {
  before(async () => {
    SBX = await EIP20.new(10000, 'Simon Bucks', 1, 'SBX');
    JBX = await EIP20.new(5000, 'John Bucks', 1, 'JBX');
    GBX = await EIP20.new(200, 'Goncalo Bucks', 1, 'GBX');
    NBX = await EIP20.new(12345, 'Niran Bucks', 1, 'NBX');
    MBX = await EIP20.new(54321, 'Mike Bucks', 1, 'MBX');
    DL  = await DataLogger.new();
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
    } catch(e){
      assert.fail(e);  
    }
  });

  it('sends call data to a contract', (done) => {
    // send a tansaction to a contract that just logs the data
    const transferSBX = {
      to: accounts[1],
      value: web3.toHex(5001), // error here when hex has an odd number of characters
      token: DL.address,
    };
    const txData = multisend.getTxData([transferSBX]);
    
    console.log(txData);
    // send the transaction
    web3.eth.sendTransaction({data:txData, from:accounts[0]}, (e,r) => {
      assert.strictEqual(e, null);
      assert.equal(1,2); 
      // web3.eth.getTransactionReceipt(r, (err, result) => {
      //   debugger;
      //   console.log(result);
      //   done();
      // })
    });
  })

  
  it('transfers a single token\'s balance', async (done) => {
    const balanceSBX_0 = await SBX.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceSBX_0.toNumber(), 10000);
    
    const transferSBX = {
      to: accounts[1],
      value: web3.toHex(5001), // error here when hex has an odd number of characters
      token: SBX.address,
    };
    const txData = multisend.getTxData([transferSBX]);
    
    // send the transaction
    web3.eth.sendTransaction({data:txData, from:accounts[0]}, async (e,r) => {
      assert.strictEqual(e, null);
      const balanceSBX_1 = await SBX.balanceOf.call(accounts[1]);
      assert.strictEqual(balanceSBX_1.toNumber(), 5001);
      done();
    });
  });

});
