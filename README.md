# multi-vendor-platform
How to run backend
- Run "npm install" to install the dependencies.
- Run "node server.js"
- Before running backend server. Make sure that mongodb instance is working and your api has been added.

How to run front-end
- Run "npm install" to install the dependencies.
- Run "npm start" to start the project

Make sure to add your own mongo db uri in your .env file.

How to setup the blockchain Solidity project:
- Install Ganche, Ganchi CLI, Truffle and HardHat globally
- Initialize hardhat/solidity project using this command (npx hardhat)
- Write smart contract inside contracts folder
- Deploy it locally using Ganache
- Deploy it on a testnet like Sepolia or Goerli (for real-world testing)
- Integrate it with your backend using web3.js
- Open ganche cli to check if its running or not using this command
"ganache-cli --port 7545"
- Run "truffle migrate --network development" for deployment of smart contracts locally.
- Basically we need to do is to connect Truffle to the Ethereum client 
(Ganche) running on 127.0.0.1:7545 before making deployment
- Also, you can check the connection to Ganache by using a simple curl or ping command
(If it returns a response from Ganache, then the connection is working fine. Otherwise, there may be a firewall issue or some other problem with Ganache or your network configuration.)



1. Truffle
Truffle is a popular development framework for building, testing, and deploying smart contracts on the Ethereum blockchain. It provides tools for compiling contracts, managing deployments, and interacting with Ethereum networks. Truffle helps developers manage their codebase and automates many aspects of smart contract development.

2. Ganache
Ganache is a personal Ethereum blockchain that you can use to develop your applications. It can run either as a GUI application (Ganache GUI) or as a command-line tool (Ganache CLI). Ganache allows you to simulate an Ethereum blockchain locally, making it easier to test smart contracts and interact with the blockchain without spending real Ether or using a public network like Ethereum's mainnet.

Ganache GUI: A desktop application with a graphical interface that allows you to interact with a local Ethereum blockchain.

Ganache CLI: A command-line version of Ganache for advanced users and automation.

3. Ethereum Client
An Ethereum client is software that helps you interact with the Ethereum blockchain. It connects to the Ethereum network, handles transactions, and executes smart contracts. Examples of Ethereum clients are:

Geth: The official Go implementation of the Ethereum protocol.

Besu: A Java-based Ethereum client for enterprise applications.

These clients allow you to run a node on the Ethereum network, either connecting to the mainnet (live network) or running a private blockchain (like with Ganache).

4. Bitcoin
Bitcoin is the first and most well-known cryptocurrency and blockchain network. It was invented by an anonymous person (or group) known as Satoshi Nakamoto in 2008. Bitcoin's main purpose is to provide a decentralized digital currency for peer-to-peer transactions. Unlike traditional currencies, Bitcoin operates on a blockchain to ensure the integrity and security of the transactions. It uses Proof of Work (PoW) to validate and secure transactions.

5. Blockchain Network
A blockchain network is a decentralized digital ledger that stores data across multiple computers (nodes) in a secure, transparent, and tamper-resistant way. Instead of relying on a central authority like a bank, a blockchain allows multiple participants to validate and store data without needing trust between them.

Blockchain for cryptocurrencies: In a blockchain network like Bitcoin, participants can send and receive cryptocurrencies, and the network ensures transactions are valid and immutable.

Blockchain for smart contracts: In networks like Ethereum, smart contracts (self-executing code) can be deployed, and the blockchain ensures they run as intended.

6. Blockchain Technology
Blockchain technology is the underlying system that powers cryptocurrencies like Bitcoin, Ethereum, and other decentralized applications (dApps). It is a distributed ledger that allows for secure and transparent record-keeping. Key features of blockchain technology include:

Decentralization: No single entity controls the network. Data is stored on multiple computers (nodes) across the world.

Immutability: Once data (transactions) is added to the blockchain, it can't be altered or deleted, ensuring transparency and trust.

Security: Blockchain uses cryptographic techniques to ensure data integrity and secure transactions.

Smart Contracts: Self-executing contracts that automatically perform actions when certain conditions are met. They run on blockchain platforms like Ethereum.

In essence, blockchain technology enables the creation of decentralized systems, cryptocurrencies, and applications without the need for intermediaries (like banks or corporations), providing transparency, security, and efficiency.


1. INFURA_URL
INFURA_URL is an RPC endpoint that allows you to interact with the Ethereum blockchain without running your own Ethereum node.

Infura is a third-party service that provides Ethereum node access, enabling developers to connect to Ethereum networks like Mainnet, Goerli, Sepolia, etc.

It is used by Web3.js to send and receive transactions, deploy contracts, and interact with smart contracts.

The escrowAddress is the contract address of your deployed smart contract on Ganache.

After you deploy your contract locally using Truffle, you will get the contract address in the migration output. This is the address you need to use as escrowAddress.

Also, Check in build/contracts/Escrow.json
Open the file build/contracts/Escrow.json.

Find the networks section.

Look for your deployed contract address:

Now, your backend is correctly set up to interact with the Escrow smart contract on your local blockchain (Ganache). 🚀 Let me know if you need more help! 😊

Final Thoughts
✅ Buyers pay in ETH or BTC.
✅ Funds are held in escrow.
✅ Sellers receive payment on delivery.
✅ Disputes can be resolved by an admin.