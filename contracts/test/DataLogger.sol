pragma solidity ^0.4.10;

contract DataLogger {
  // bytes public data;

  event LogData(bytes);
  
  function() {
    // data = msg.data;
    LogData(msg.data);
  }
}