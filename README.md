## Multiple calls during contract initialization

This is a rough proof of concept of a novel method of making multiple calls from a single transaction. 

It uses pure EVM assembly, to generate a very simple and efficient set of instructions for making a call to a contract. 

The example is of a call to the `transfer()` function of an EIP20 token. Unfortunately, this fails because the token has `msg.sender` as equal to the contract which 