### Decentralized Voting App

A simple voting dapp. The smart contract is written in `solidity` and deployed on `Kovan` testnet. It was tested with
`Remix` and on a local blockchain provided by `Ganache` using `Brownie` framework. For the frontend, we used 
`html/javascript` combined with `Moralis` to interact with the smart contract.


#### Launch.
You need to create an account on `https://moralis.io/` and create a new dapp with `Kovan`
testnet enabled. Use the server url and app id of the moralis dapp to create a `.config.json` file with content `{` `"serverUrl" : "YOUR_URL",`
`"appId" : "YOUR_APP_ID"`
`}` inside the frontend folder.
You can now launch the voting dapp with the command `http-server` from frontend folder.



####  Modifications
To deploy a modified version of the Smart Contract with `brownie` you need to: 

 1) Add `.env` file containing 
`export PRIVATE_KEY=YOUR_PRIVATE_KEY`
`export WEB3_INFURA_PROJECT_ID=YOUR_INFURA_PROJECT_ID`;

2) modify the source code `Vote.sol`  in the `contracts` folder;

3) `brownie compile`;

4) `brownie run ./scripts/deploy_scripts.py" --network network_name`;

5) Update `contracts_and_abi.js` in the frontend folder using the new contract address and abi.

#### Testing
You can run unit tests from tests folder on a local blockchain with the command `brownie test`.

