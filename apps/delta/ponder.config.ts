import type { Config } from '@ponder/core'
import { http } from 'viem'

export const config: Config = {
  networks: [
    {
      // name: 'optimism-goerli',
      // chainId: 420,
      // transport: http(process.env.PONDER_RPC_URL_420),
      name: 'anvil',
      chainId: 31337,
      transport: http(process.env.ANVIL_FORK_URL),      
    },
  ],
  contracts: [
    // {
    //   name: 'IdRegistry',
    //   network: 'optimism-goerli',
    //   abi: './abis/IdRegistry.json',
    //   address: '0xf89a7C9a0517da815dB66CdcAf61F44E01476697',
    //   startBlock: 16474518,
    // },    
    {
      name: 'IdRegistry',
      network: 'anvil',
      abi: './abis/IdRegistry.json',
      address: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    },
    // {
    //   name: 'DelegateRegistry',
    //   network: 'optimism-goerli',
    //   abi: './abis/DelegateRegistry.json',
    //   address: '0x995D4621B4B72cd2805f99972A1313bd9876c613',
    //   startBlock: 16474518,
    // },
    {
      name: 'NodeRegistry',
      network: 'anvil',
      abi: './abis/NodeRegistry.json',
      address: '0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82'
    },    
    // {
    //   name: 'NodeRegistry',
    //   network: 'optimism-goerli',
    //   abi: './abis/NodeRegistry.json',
    //   address: '0xa7E3142140983cc6DBBd27766492C0224CA77587',
    //   startBlock: 13777523,
    // },
    // {
    //   name: 'RiverValidatorV1',
    //   network: 'optimism-goerli',
    //   abi: './abis/RiverValidatorV1.json',
    //   address: '0x3E3522Ac4d89c56c8759F81a86ff94b8c39A45e3',
    //   startBlock: 16474518,
    // },
    // {
    //   name: 'LightAccountFactory',
    //   network: 'optimism-goerli',
    //   abi: './abis/LightAccountFactory.json',
    //   address: '0x000000893A26168158fbeaDD9335Be5bC96592E2',
    //   startBlock: 16474518,
    // },
  ],
}
