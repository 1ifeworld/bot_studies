// import {
//     createWalletClient,
//     Hash,
//     http,
//   } from 'viem'
//   import { privateKeyToAccount } from 'viem/accounts'
//   import { optimism } from 'viem/chains'
//   import { addresses } from '../constants'

//   type User = {
//     to: string
//     recovery: string
//     deadline: number | string | bigint
//     sig: string
//   }  

// function getExpiration() {
//     return BigInt(Math.floor(Date.now() / 1000) + 120) // 2 min buffer
//   }
  
//   export async function registerForBot(privateKey: Hash) {

//     // generate sig
//     const sigDeadline = getExpiration()
//     // const client = createWalletClient({
//     //     chain: optimism,
//     //     transport: http('https://wild-chaotic-meme.optimism.quiknode.pro/58c9d38ed8dd1d795e4b20726866866d595a7cda/')
//     //   })      
//     const account = privateKeyToAccount(privateKey)
//     const ID_REGISTRY_EIP_712_DOMAIN = {
//         name: 'River IdRegistry',
//         version: '1',
//         chainId: 10,
//         verifyingContract: addresses.idRegistry.optimism,
//     } as const
//     const REGISTER_TYPE = [
//         { name: 'to', type: 'address' },
//         { name: 'recovery', type: 'address' },
//         { name: 'nonce', type: 'uint256' },
//         { name: 'deadline', type: 'uint256' },
//     ] as const

//     const sig = await account.signTypedData({
//         // account: account.address,
//         domain: ID_REGISTRY_EIP_712_DOMAIN,
//         types: { Register: REGISTER_TYPE },
//         primaryType: 'Register',
//         message: {
//             to: account.address,
//             recovery: addresses.riverRecovery.optimism,
//             // assumes all wallets calling this have 0 previous transactions
//             // CURRENTLY this is fine because username db sig will not be rejected
//             // if the nonce is off (since its still a valid recoverable message)
//             nonce: BigInt(0),
//             deadline: sigDeadline,
//         },
//     })      
//     console.log({sig})

//     const resp = await relayRegisterFor({
//         to: account.address,
//         recovery: addresses.riverRecovery.optimism,
//         deadline: sigDeadline.toString(),
//         sig: sig as Hash
//     })

//     console.log("resp: ", resp)

//     return resp
//   }

    
// export async function relayRegisterFor(
//     user: User,
//     ): Promise<{ success: boolean; hash?: string; rid?: string; error?: string }> {
//     try {
//         const response = await fetch('http://localhost:3000/api/registerFor', {
//         method: 'POST',
//         body: JSON.stringify(user),
//         })
//         if (!response.ok) throw new Error('Transaction failed')
    
//         const data = await response.json()
//         if (data.success) {
//         return { success: true, hash: data.hash, rid: data.rid }
//         } else {
//         throw new Error(data.error || 'Transaction not included')
//         }
//     } catch (error) {
//         console.error('relayRegisterFor error:', error)
//         return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error',
//         }
//     }
// }

// registerForBot("pk")