module.exports = {
    networks: {
      development: {
        host: "127.0.0.1",     // Localhost
        port: 7545,            // Ganache default port
        network_id: "*",
        networkCheckTimeout: 10000,
        gas: 6721975,          // Gas limit (default: 6721975)
        gasPrice: 20000000000  // Gas price (default: 20000000000)      // Match any network id
      }
    },
    compilers: {
        solc: {
          version: "0.8.28",  // 👈 Set it to match your contract
        }
      }
  };
  