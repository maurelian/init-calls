## Multiple calls during contract initialization

This is a rough proof of concept of a novel method of making multiple calls from a single transaction. 

It uses pure EVM assembly, to generate a very simple and efficient set of instructions for making a call to a contract. You can then send this in the `data` field of a transaction to the empty address, which will run the bytecode as if it were the contract initialization code. 

The code in the `index.js` file would make a call to the `transfer()` function of an EIP20 token. Unfortunately, this fails because of the next bit

## Who is the sender?

When using this method, the `msg.sender` address will be that of the contract which would be created by the transaction. **Hence, this will only work on publicly available functions within a contract.** You will need to modify the code to work with your contract's ABI. 

## If this were Solidity

The equivalent in solidity would be something like: 

```
contract Foo {
    function bar(){}
}

contract InitCaller {
    function InitCaller(Foo _foo){
        _foo.bar();
        _foo.bar();
        _foo.bar();
        _foo.bar();
        _foo.bar();
        _foo.bar();
    }
}
