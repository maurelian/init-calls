## Multiple calls during contract initialization

This is a rough proof of concept of a novel method of making multiple calls from a single transaction. 

It uses pure EVM assembly, to generate a very simple and efficient set of instructions for making a call to a contract. You can then send this in the `data` field of a transaction to the empty address, which will run the bytecode as if it were the contract initialization code. 

The example is of a call to the `transfer()` function of an EIP20 token. Unfortunately, this fails because the token has `msg.sender` as equal to the contract which is being created by the transaction. Hence, this will only work on publicly available functions within a contract. You will need to modify the code to work with your contract's ABI. 