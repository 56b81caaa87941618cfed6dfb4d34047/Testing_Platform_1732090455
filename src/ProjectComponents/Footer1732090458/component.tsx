
import React from 'react';
import * as ethers from 'ethers';

const UniswapV3FactoryInteraction: React.FC = () => {
  const [provider, setProvider] = React.useState<ethers.providers.Web3Provider | null>(null);
  const [contract, setContract] = React.useState<ethers.Contract | null>(null);
  const [tokenA, setTokenA] = React.useState('');
  const [tokenB, setTokenB] = React.useState('');
  const [fee, setFee] = React.useState('');
  const [feeForTickSpacing, setFeeForTickSpacing] = React.useState('');
  const [poolTokenA, setPoolTokenA] = React.useState('');
  const [poolTokenB, setPoolTokenB] = React.useState('');
  const [poolFee, setPoolFee] = React.useState('');
  const [result, setResult] = React.useState('');

  const contractAddress = '0x8FdA5a7a8dCA67BBcDd10F02Fa0649A937215422';
  const chainId = 324;

  const contractABI = [
    {
      "name": "createPool",
      "stateMutability": "nonpayable",
      "inputs": [
        { "name": "tokenA", "type": "address" },
        { "name": "tokenB", "type": "address" },
        { "name": "fee", "type": "uint24" }
      ],
      "outputs": [{ "name": "pool", "type": "address" }]
    },
    {
      "name": "feeAmountTickSpacing",
      "stateMutability": "view",
      "inputs": [{ "name": "", "type": "uint24" }],
      "outputs": [{ "name": "", "type": "int24" }]
    },
    {
      "name": "getPool",
      "stateMutability": "view",
      "inputs": [
        { "name": "", "type": "address" },
        { "name": "", "type": "address" },
        { "name": "", "type": "uint24" }
      ],
      "outputs": [{ "name": "", "type": "address" }]
    },
    {
      "name": "parameters",
      "stateMutability": "view",
      "inputs": [],
      "outputs": [
        { "name": "factory", "type": "address" },
        { "name": "token0", "type": "address" },
        { "name": "token1", "type": "address" },
        { "name": "fee", "type": "uint24" },
        { "name": "tickSpacing", "type": "int24" }
      ]
    }
  ];

  React.useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(web3Provider);
        const signer = web3Provider.getSigner();
        const contractInstance = new ethers.Contract(contractAddress, contractABI, signer);
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
              alert("Please add the zkSync Era network to your wallet");
            }
          }
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error);
        setResult("Failed to connect wallet");
      }
    }
  };

  const createPool = async () => {
    if (!contract) {
      await connectWallet();
      if (!contract) return;
    }
    try {
      const tx = await contract.createPool(tokenA, tokenB, fee);
      const receipt = await tx.wait();
      setResult(`Pool created: ${receipt.transactionHash}`);
    } catch (error) {
      console.error("Error creating pool:", error);
      setResult("Error creating pool");
    }
  };

  const getFeeAmountTickSpacing = async () => {
    if (!contract) {
      await connectWallet();
      if (!contract) return;
    }
    try {
      const tickSpacing = await contract.feeAmountTickSpacing(feeForTickSpacing);
      setResult(`Tick spacing for fee ${feeForTickSpacing}: ${tickSpacing}`);
    } catch (error) {
      console.error("Error getting fee amount tick spacing:", error);
      setResult("Error getting fee amount tick spacing");
    }
  };

  const getPoolAddress = async () => {
    if (!contract) {
      await connectWallet();
      if (!contract) return;
    }
    try {
      const pool = await contract.getPool(poolTokenA, poolTokenB, poolFee);
      setResult(`Pool address: ${pool}`);
    } catch (error) {
      console.error("Error getting pool address:", error);
      setResult("Error getting pool address");
    }
  };

  const getParameters = async () => {
    if (!contract) {
      await connectWallet();
      if (!contract) return;
    }
    try {
      const params = await contract.parameters();
      setResult(`Parameters: Factory: ${params.factory}, Token0: ${params.token0}, Token1: ${params.token1}, Fee: ${params.fee}, TickSpacing: ${params.tickSpacing}`);
    } catch (error) {
      console.error("Error getting parameters:", error);
      setResult("Error getting parameters");
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-5">UniswapV3Factory Interaction</h1>

      <div className="mb-5 p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Create Pool</h2>
        <input type="text" placeholder="Token A Address" className="w-full p-2 mb-2 border rounded" value={tokenA} onChange={(e) => setTokenA(e.target.value)} />
        <input type="text" placeholder="Token B Address" className="w-full p-2 mb-2 border rounded" value={tokenB} onChange={(e) => setTokenB(e.target.value)} />
        <input type="text" placeholder="Fee" className="w-full p-2 mb-2 border rounded" value={fee} onChange={(e) => setFee(e.target.value)} />
        <button onClick={createPool} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">Create Pool</button>
      </div>

      <div className="mb-5 p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Get Fee Amount Tick Spacing</h2>
        <input type="text" placeholder="Fee" className="w-full p-2 mb-2 border rounded" value={feeForTickSpacing} onChange={(e) => setFeeForTickSpacing(e.target.value)} />
        <button onClick={getFeeAmountTickSpacing} className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600">Get Tick Spacing</button>
      </div>

      <div className="mb-5 p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Get Pool</h2>
        <input type="text" placeholder="Token A Address" className="w-full p-2 mb-2 border rounded" value={poolTokenA} onChange={(e) => setPoolTokenA(e.target.value)} />
        <input type="text" placeholder="Token B Address" className="w-full p-2 mb-2 border rounded" value={poolTokenB} onChange={(e) => setPoolTokenB(e.target.value)} />
        <input type="text" placeholder="Fee" className="w-full p-2 mb-2 border rounded" value={poolFee} onChange={(e) => setPoolFee(e.target.value)} />
        <button onClick={getPoolAddress} className="w-full p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Get Pool Address</button>
      </div>

      <div className="mb-5 p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Get Parameters</h2>
        <button onClick={getParameters} className="w-full p-2 bg-purple-500 text-white rounded hover:bg-purple-600">Get Parameters</button>
      </div>

      <div className="p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-3">Result</h2>
        <p className="break-all">{result}</p>
      </div>
    </div>
  );
};

export { UniswapV3FactoryInteraction as component };
