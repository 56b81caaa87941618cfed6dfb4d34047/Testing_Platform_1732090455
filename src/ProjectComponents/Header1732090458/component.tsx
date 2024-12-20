
import React from 'react';
import { ethers } from 'ethers';

const UniswapV3FactoryInteraction: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = React.useState<ethers.Signer | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [tokenA, setTokenA] = React.useState('');
  const [tokenB, setTokenB] = React.useState('');
  const [fee, setFee] = React.useState('');
  const [poolResult, setPoolResult] = React.useState('');
  const [feeAmount, setFeeAmount] = React.useState('');
  const [tickSpacing, setTickSpacing] = React.useState('');
  const [getPoolTokenA, setGetPoolTokenA] = React.useState('');
  const [getPoolTokenB, setGetPoolTokenB] = React.useState('');
  const [getPoolFee, setGetPoolFee] = React.useState('');
  const [getPoolResult, setGetPoolResult] = React.useState('');
  const [owner, setOwner] = React.useState('');
  const [enableFeeAmount, setEnableFeeAmount] = React.useState('');
  const [enableTickSpacing, setEnableTickSpacing] = React.useState('');

  const contractAddress = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
  const chainId = 137; // Polygon

  const contractABI = [
    {
      name: "createPool",
      stateMutability: "nonpayable",
      inputs: [
        { name: "tokenA", type: "address" },
        { name: "tokenB", type: "address" },
        { name: "fee", type: "uint24" }
      ],
      outputs: [{ name: "pool", type: "address" }]
    },
    {
      name: "enableFeeAmount",
      stateMutability: "nonpayable",
      inputs: [
        { name: "fee", type: "uint24" },
        { name: "tickSpacing", type: "int24" }
      ],
      outputs: []
    },
    {
      name: "feeAmountTickSpacing",
      stateMutability: "view",
      inputs: [{ name: "", type: "uint24" }],
      outputs: [{ name: "", type: "int24" }]
    },
    {
      name: "getPool",
      stateMutability: "view",
      inputs: [
        { name: "", type: "address" },
        { name: "", type: "address" },
        { name: "", type: "uint24" }
      ],
      outputs: [{ name: "", type: "address" }]
    },
    {
      name: "owner",
      stateMutability: "view",
      inputs: [],
      outputs: [{ name: "", type: "address" }]
    }
  ];

  React.useEffect(() => {
    const init = async () => {
      if (typeof window.ethereum !== 'undefined') {
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
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
      return signer;
    }
    throw new Error("No provider available");
  };

  const checkAndSwitchChain = async () => {
    if (provider) {
      const network = await provider.getNetwork();
      if (network.chainId !== chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${chainId.toString(16)}` }],
          });
        } catch (error: any) {
          if (error.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: `0x${chainId.toString(16)}`,
                chainName: 'Polygon',
                nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                rpcUrls: ['https://polygon-rpc.com/'],
                blockExplorerUrls: ['https://polygonscan.com/'],
              }],
            });
          } else {
            console.error("Failed to switch network:", error);
            throw error;
          }
        }
      }
    }
  };

  const createPool = async () => {
    try {
      await checkAndSwitchChain();
      const connectedSigner = signer || await connectWallet();
      if (contract && connectedSigner) {
        const tx = await contract.connect(connectedSigner).createPool(tokenA, tokenB, fee);
        const receipt = await tx.wait();
        const event = receipt.events?.find((e: any) => e.event === 'PoolCreated');
        setPoolResult(event?.args?.pool || 'Pool created, but address not found in event');
      }
    } catch (error) {
      console.error("Error creating pool:", error);
      setPoolResult('Error creating pool. See console for details.');
    }
  };

  const enableFeeAmountFunction = async () => {
    try {
      await checkAndSwitchChain();
      const connectedSigner = signer || await connectWallet();
      if (contract && connectedSigner) {
        const tx = await contract.connect(connectedSigner).enableFeeAmount(enableFeeAmount, enableTickSpacing);
        await tx.wait();
        setPoolResult('Fee amount enabled successfully');
      }
    } catch (error) {
      console.error("Error enabling fee amount:", error);
      setPoolResult('Error enabling fee amount. See console for details.');
    }
  };

  const getFeeAmountTickSpacing = async () => {
    try {
      if (contract) {
        const result = await contract.feeAmountTickSpacing(feeAmount);
        setTickSpacing(result.toString());
      }
    } catch (error) {
      console.error("Error getting fee amount tick spacing:", error);
      setTickSpacing('Error. See console for details.');
    }
  };

  const getPoolAddress = async () => {
    try {
      if (contract) {
        const result = await contract.getPool(getPoolTokenA, getPoolTokenB, getPoolFee);
        setGetPoolResult(result);
      }
    } catch (error) {
      console.error("Error getting pool address:", error);
      setGetPoolResult('Error. See console for details.');
    }
  };

  const getOwner = async () => {
    try {
      if (contract) {
        const result = await contract.owner();
        setOwner(result);
      }
    } catch (error) {
      console.error("Error getting owner:", error);
      setOwner('Error. See console for details.');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-3xl font-bold mb-5">UniswapV3Factory Interaction on Polygon</h1>

      <div className="mb-5 p-5 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Create Pool</h2>
        <input
          type="text"
          placeholder="Token A Address"
          className="w-full p-2 mb-2 border rounded"
          value={tokenA}
          onChange={(e) => setTokenA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token B Address"
          className="w-full p-2 mb-2 border rounded"
          value={tokenB}
          onChange={(e) => setTokenB(e.target.value)}
        />
        <input
          type="number"
          placeholder="Fee"
          className="w-full p-2 mb-2 border rounded"
          value={fee}
          onChange={(e) => setFee(e.target.value)}
        />
        <button
          onClick={createPool}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Pool
        </button>
        {poolResult && <p className="mt-2">Pool Result: {poolResult}</p>}
      </div>

      <div className="mb-5 p-5 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Enable Fee Amount</h2>
        <input
          type="number"
          placeholder="Fee Amount"
          className="w-full p-2 mb-2 border rounded"
          value={enableFeeAmount}
          onChange={(e) => setEnableFeeAmount(e.target.value)}
        />
        <input
          type="number"
          placeholder="Tick Spacing"
          className="w-full p-2 mb-2 border rounded"
          value={enableTickSpacing}
          onChange={(e) => setEnableTickSpacing(e.target.value)}
        />
        <button
          onClick={enableFeeAmountFunction}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Enable Fee Amount
        </button>
      </div>

      <div className="mb-5 p-5 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Fee Amount Tick Spacing</h2>
        <input
          type="number"
          placeholder="Fee Amount"
          className="w-full p-2 mb-2 border rounded"
          value={feeAmount}
          onChange={(e) => setFeeAmount(e.target.value)}
        />
        <button
          onClick={getFeeAmountTickSpacing}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Tick Spacing
        </button>
        {tickSpacing && <p className="mt-2">Tick Spacing: {tickSpacing}</p>}
      </div>

      <div className="mb-5 p-5 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Get Pool</h2>
        <input
          type="text"
          placeholder="Token A Address"
          className="w-full p-2 mb-2 border rounded"
          value={getPoolTokenA}
          onChange={(e) => setGetPoolTokenA(e.target.value)}
        />
        <input
          type="text"
          placeholder="Token B Address"
          className="w-full p-2 mb-2 border rounded"
          value={getPoolTokenB}
          onChange={(e) => setGetPoolTokenB(e.target.value)}
        />
        <input
          type="number"
          placeholder="Fee"
          className="w-full p-2 mb-2 border rounded"
          value={getPoolFee}
          onChange={(e) => setGetPoolFee(e.target.value)}
        />
        <button
          onClick={getPoolAddress}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Pool Address
        </button>
        {getPoolResult && <p className="mt-2">Pool Address: {getPoolResult}</p>}
      </div>

      <div className="mb-5 p-5 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Owner</h2>
        <button
          onClick={getOwner}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Get Owner
        </button>
        {owner && <p className="mt-2">Owner: {owner}</p>}
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
