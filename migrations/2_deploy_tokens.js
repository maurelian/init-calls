// const fs = require('fs');
// console.log(fs.readdirSync('../'));
const EIP20 = artifacts.require('EIP20');

module.exports = async (deployer) => {
  await deployer.deploy(EIP20, 10000, 'Simon Bucks', 1, 'SBX');
};
