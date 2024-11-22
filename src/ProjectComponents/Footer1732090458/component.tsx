
import React from 'react';
import * as ethers from 'ethers';

const LidoLocatorInteraction: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [results, setResults] = React.useState<{ [key: string]: string }>({});

  const contractAddress = '0x3abc4764f0237923d52056cfba7e9aebf87113d3';
  const chainId = 1; // Ethereum Mainnet

  const contractABI = [
    { "name": "accountingOracle", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "burner", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "coreComponents", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }] },
    { "name": "depositSecurityModule", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "elRewardsVault", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "legacyOracle", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "lido", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "oracleDaemonConfig", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "oracleReportComponentsForLido", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }, { "name": "", "type": "address" }] },
    { "name": "oracleReportSanityChecker", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "postTokenRebaseReceiver", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "stakingRouter", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "treasury", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "validatorsExitBusOracle", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "withdrawalQueue", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] },
    { "name": "withdrawalVault", "stateMutability": "view", "inputs": [], "outputs": [{ "name": "", "type": "address" }] }
  ];

  React.useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        const contractInstance = new ethers.Contract(contractAddress, contractABI, web3Provider);
        setContract(contractInstance);
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (provider) {
      try {
        await provider.send("eth_requestAccounts", []);
        const network = await provider.getNetwork();
        if (network.chainId !== chainId) {
          try {
            await provider.send("wallet_switchEthereumChain", [{ chainId: ethers.utils.hexValue(chainId) }]);
          } catch (switchError: any) {
            if (switchError.code === 4902) {
              setResults({ error: "Please add the Ethereum Mainnet to your wallet" });
            }
          }
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setResults({ error: "Failed to connect wallet" });
      }
    }
  };

  const callContractMethod = async (methodName: string) => {
    if (!contract) {
      await connectWallet();
      if (!contract) return;
    }
    try {
      const result = await contract[methodName]();
      if (Array.isArray(result)) {
        setResults(prevResults => ({ ...prevResults, [methodName]: result.join(', ') }));
      } else {
        setResults(prevResults => ({ ...prevResults, [methodName]: result }));
      }
    } catch (error) {
      console.error(`Error calling ${methodName}:`, error);
      setResults(prevResults => ({ ...prevResults, [methodName]: `Error calling ${methodName}` }));
    }
  };

  const renderMethodButton = (methodName: string) => (
    <div key={methodName} className="mb-5 p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-3">{methodName}</h2>
      <button onClick={() => callContractMethod(methodName)} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Call {methodName}
      </button>
      {results[methodName] && (
        <p className="mt-2 break-all">Result: {results[methodName]}</p>
      )}
    </div>
  );

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Lido Locator Interaction</h1>
      {contractABI.map(method => renderMethodButton(method.name))}
    </div>
  );
};

export { LidoLocatorInteraction as component };
