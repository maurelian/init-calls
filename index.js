// takes in a set of token addresses, transfer amounts, and a final destination


const oc = {
  PUSH1: 60, 
  PUSH2: 61, 
  PUSH3: 62, 
  PUSH4: 63,
  PUSH20: 73,
  MSTORE: 52,
  GAS: '5a', 
  CALL: 'f1'
}


// This list encodes the EVM instruction set required to make a call to an ERC20 token's 
// transfer function. 
let callArray = [
  // 1. Set up the call data by writing it to memory
  `${oc.PUSH4}a9059cbb`, // 4-byte function ID
  `${oc.PUSH1}00`, 
  `${oc.MSTORE}`,
  `${oc.PUSH20}TO_ADDRESS`, // token address
  `${oc.PUSH1}20`,
  `${oc.MSTORE}`,    
  `${oc.PUSH2}VALUE`, // send value
  `${oc.PUSH1}40`,
  `${oc.MSTORE}`,
  // 2. Set up the stack for the CALL instruction
  `${oc.PUSH1}01`,  // return data outsize
  `${oc.PUSH1}00`,  // return data out 
  `${oc.PUSH1}44`,  // memory insize
  `${oc.PUSH1}1c`,  // memory in
  `${oc.PUSH1}00`,   // value
  `${oc.PUSH20}TOKEN_ADDRESS`, // address
  `${oc.GAS}`, // gas
  `${oc.CALL}` 
];

// Take the array of opcodes, and join into a single byte string
let callAssemblyStub = callArray.join('');

module.exports = {
  /// @param transfers An array of transfer objects, containing token address, to address and value
  /// @param destination The address to transfer all these tokens to
  getTxData: (transfers) => {
    let txData = '';
    for(i=0; i<transfers.length; i++){
      transfer = transfers[i];
      // remove the 0x prefixes
      let to        = transfer.to     .replace('0x','');
      let value     = transfer.value  .replace('0x','');
      let token     = transfer.token  .replace('0x','');

      txData = txData + callAssemblyStub
        .replace('TO_ADDRESS', to)
        .replace('VALUE', value)
        .replace('TOKEN_ADDRESS', token);
    }
    return txData;
  }
}