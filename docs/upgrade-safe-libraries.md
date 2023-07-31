# Upgrade-safe libraries

In order to save up some size to deployed contracts bytecode, it is a common practice to make all the functions of a library `public` or `external`.
This leads to the the library being deployed independantly on-chain instead of being included in contracts bytecodes.
Instead the contracts use the `DELEGATECALL` opcode to execute the library functions.

However libraries can lead to self destruct the delegator contract or may rely on the delegator contract state structure.
Because libraries source code is not always available locally and the above dangers are difficult to figure out, the OZ team has currently chosen to disable external library linking in their upgradeables plugins.

The `APRCheckpoint` library doesn't include any self destruct mechanism nor rely on the contract state structure directly.
Instead callers contracts have to pass a state pointers as functions arguments, which means that the library is state structure agnostic.

Therefore, the `APRCheckpoint` library can be considered as upgrade safe.

Hopefully, OpenZeppelin `hardhat-upgrades` plugin provides a way to enable external library linking through explicit allowance.
This is why `LToken` and `LDYStaking` contracts have this line in their Natspec documentation:

```
@custom:oz-upgrades-unsafe-allow external-library-linking
```

See:

- https://forum.openzeppelin.com/t/upgrade-safe-libraries/13832
