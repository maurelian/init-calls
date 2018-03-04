// takes in a set of token addresses, transfer amounts, and a final destination


const opcodes = {
  PUSH1: 60, 
  PUSH2: 61, 
  PUSH3: 62, 
  PUSH4: 63,
  PUSH20: 73,
  MSTORE: 52,
  GAS: '5a', 
  CALL: 'f1'
}

let callArray = [
// setting up the 
  `${opcodes.PUSH4}a9059cbb`,
  `${opcodes.PUSH1}00`, 
  `${opcodes.MSTORE}`,
  `${opcodes.PUSH20}TO_ADDRESS`,
  `${opcodes.PUSH1}20`,
  `${opcodes.MSTORE}`,    
  `${opcodes.PUSH2}VALUE`, // send value
  `${opcodes.PUSH1}40`,
  `${opcodes.MSTORE}`,
  // setting up the call values
  `${opcodes.PUSH1}01`,  // return data outsize
  `${opcodes.PUSH1}00`,  // return data out 
  `${opcodes.PUSH1}44`,  // memory insize
  `${opcodes.PUSH1}1c`,  // memory in
  `${opcodes.PUSH1}00`,   // value
  `${opcodes.PUSH20}TOKEN_ADDRESS`, // address
  `${opcodes.GAS}`, // gas
  `${opcodes.CALL}` 
];

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