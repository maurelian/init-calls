# Simple token transfer data:

Function: transfer(address _to, uint256 _value)

MethodID: 0xa9059cbb
[0]:00000000000000000000000092cc866f7256d38c228035ee4daa78114494d288
[1]:000000000000000000000000000000000000000000000010d245a22989cd0000

<!-- call contract at address a with input mem[in..(in+insize)) providing g gas and v wei and output area mem[out..(out+outsize)) returning 0 on error (eg. out of gas) and 1 on success
 -->
<!-- call(g, a, v, in, insize, out, outsize)     -->
(delegatecall 0x11 0x1234 0 0x22 0x33 0x44)
$ myth -dc 60446033602260006112346011f4
0 PUSH1 0x44 <!-- outsize -->
2 PUSH1 0x33 <!-- out -->
<!-- input mem[in..(in+insize)) -->
4 PUSH1 0x22 <!-- insize -->
6 PUSH1 0x00 <!-- in -->
8 PUSH2 0x1234 <!-- address -->
11 PUSH1 0x11 <!-- gas -->
13 DELEGATECALL

## Actually do it:

<!-- Load the memory with the txdata -->
63 a9059cbb     # PUSH4 0xa9059cbb 
60 00           #  PUSH1 0x00
52                # MSTORE
73 92cc866f7256d38c228035ee4daa78114494d288   # PUSH20 
60 20           # PUSH1 0x20
52              #       MSTORE
61 270f         #     PUSH2 9999
60 40           # 
52              # MSTORE at the 3rd mem slot

<!-- Below here is just what sets up the call: -->
60 00   # PUSH1 0x00 <!-- out -->
60 01   # PUSH1 0x01 <!-- outsize (just true/false)-->
60 1c   # PUSH1 0x1c <!-- in -->
60 44   # PUSH4 0x44    <!-- insize -->
60 00   # PUSH1 0x0 <!-- value -->
73 92cc866f7256d38c228035ee4daa78114494d288
5a           GAS <!-- gas amount -->
f1           CALL




