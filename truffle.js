// Allows us to use ES6 in our migrations and tests.
const HDWalletProvider = require("truffle-hdwallet-provider");
const fs = require('fs');

// First read in the secrets.json to get our mnemonic
let secrets;
let mnemonic;
let provider;
let home = process.env.HOME;
if (fs.existsSync(`${home}/Projects/secrets.json`)) {
  secrets = JSON.parse(fs.readFileSync(`${home}/Projects/secrets.json`, 'utf8'))  
  
} else {
  console.log('No secrets.json found. If you are trying to publish EPM ' +
              'this will fail. Otherwise, you can ignore this message!')
  mnemonic = ''
}

// detect the network from command line arguments
const networkFlagIndex = process.argv.indexOf('--network');

// default to "development" (localhost:8545)
const network = (networkFlagIndex > -1) ? process.argv[networkFlagIndex+1] : "development";

const networkUrls = {
  infuranet: "https://infuranet.infura.io:443/iJh65Cf2pKOcrYXWZwm3",
  ropsten: "https://ropsten.infura.io:443/iJh65Cf2pKOcrYXWZwm3",
  rinkeby: "http://127.0.0.1:8454",
  mainnet: "https://mainnet.infura.io:443/iJh65Cf2pKOcrYXWZwm3"
}

let networkUrl = networkUrls[network] ? networkUrls[network] : "http://localhost:8545/"; 

if(network == "mainnet"){
    mnemonic = secrets.mnemonic_mainnet_testing;
    provider = new HDWalletProvider(mnemonic, networkUrl, 0, 10);
} else if (["rinkeby", "ropsten", "infuranet"].indexOf(network) > -1){
    mnemonic = secrets.mnemonic_testnet_testing;
    provider = new HDWalletProvider(mnemonic, networkUrl, 0, 10);
}

console.log(`Connecting to ${network} at ${networkUrl}`);

module.exports = {
  networks: {    
    development: {
      host: "localhost",    
      port: 8545,      
      network_id: "*", // Match any network id 
      gas: 6000000, // wallet contract takes over 2.5 million gas to create,
   },
   coverage: {
       host: "localhost",
       port: 8555,
       network_id: "*", // Match any network id 
       gas: 30000000 // coverage instrumentation makes gas usage very high 
    },   
   mainnet: {
     provider,
     network_id: "1",  
     gas: 2700000
   },
   infuranet: {
     provider,
     network_id: "5810",  
     gas: 2700000
   },
   ropsten: {  
     provider,
     network_id: "3",
     gas: 3000000
   },
   rinkeby: {  
     provider,
     network_id: "4",
     gas: 3000000
   }
  },
  solc: {
    optimizer: {
      enabled: false,
      runs: 200
    }
  },
  config:{
    networkUrl: networkUrl,
    network: network
  }
};
