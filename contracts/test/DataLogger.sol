pragma solidity ^0.4.10;

contract DataLogger {
  // bytes public data;

  event LogData(bytes);
  event LogAddress(address);
  
  function() {
    // data = msg.data;
    LogData(msg.data);
    LogAddress(msg.sender); // the address logged is the new contract.
  }
}