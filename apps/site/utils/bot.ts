// import {
//     createWalletClient,
//     Hash,
//     http,
//     Hex,
//     encodeAbiParameters
//   } from 'viem'
//   import { privateKeyToAccount } from 'viem/accounts'
//   import { optimism } from 'viem/chains'
//   import { encodeCreateAssetMsgBody, encodeAddItemMsgBody, remove0xPrefix, generateMessageHash, addresses, Post, Message  } from 'scrypt'
// //   import { generateMessageHash, remove0xPrefix} from '../lib'
// //   import { addresses } from '../constants'
// //   import { Post, Message } from '../types'
//   import * as dagCbor from '@ipld/dag-cbor'
// import * as Block from 'multiformats/block'
// import { sha256 } from 'multiformats/hashes/sha2'


//  async function messageToCid(message: Message) {
//   // const dagCbor = await import('@ipld/dag-cbor');
//   // const Block = await import('multiformats/block');
//   // const { sha256 } = await import('multiformats/hashes/sha2');
//   return await Block.encode({ value: message, codec: dagCbor, hasher: sha256 })
// }
  
//   // type User = {
//   //   to: string
//   //   recovery: string
//   //   deadline: number | string | bigint
//   //   sig: string
//   // }  



// function getExpiration() {
//     return BigInt(Math.floor(Date.now() / 1000) + 120) // 2 min buffer
//   }
  
//   export async function postBatchBot(privateKey: Hash, rid: bigint, itemUri: string, channelId: string) {

//     // generate sig
//     const sigDeadline = getExpiration()
//     // const client = createWalletClient({
//     //     chain: optimism,
//     //     transport: http('https://wild-chaotic-meme.optimism.quiknode.pro/58c9d38ed8dd1d795e4b20726866866d595a7cda/')
//     //   })      
//     const account = privateKeyToAccount(privateKey)
//     const createItemMsgType = 1
//     const createItemMsgBody = encodeCreateAssetMsgBody({
//       data: {
//         dataType: 1,
//         contents: encodeAbiParameters(
//           [{ name: 'itemUri', type: 'string' }],
//           [itemUri],
//         ),
//       },
//       access: {
//         accessType: 1,
//         contents: encodeAbiParameters(
//           [
//             { name: 'members', type: 'uint256[]' },
//             { name: 'roles', type: 'uint256[]' },
//           ],
//           // Hardcoding in Roles.ADMIN for item creators
//           [[rid], [BigInt(2)]],
//         ),
//       },
//     })
//     if (!createItemMsgBody?.msgBody) return false
//     // generate hash to include in post
//     const createItemMessageHash = generateMessageHash({
//       rid: BigInt(rid),
//       timestamp: BigInt(sigDeadline),
//       msgType: createItemMsgType as number,
//       msgBody: createItemMsgBody.msgBody,
//     })
//     const createItemMsgHashForSig = remove0xPrefix({
//       bytes32Hash: createItemMessageHash,
//     })


//     const createItemSig = await account.signMessage(
//         {message: createItemMsgHashForSig}
//       ) as Hash
//       const createItemPost: Post = {
//         signer: account.address,
//         message: {
//           rid: BigInt(rid),
//           timestamp: BigInt(sigDeadline),
//           msgType: createItemMsgType as number,
//           msgBody: createItemMsgBody.msgBody,
//         },
//         hashType: 1,
//         hash: createItemMessageHash,
//         sigType: 1,
//         sig: createItemSig,
//       }

//           // Create itemCid using canonical types
//     const itemCid = (await messageToCid(createItemPost.message)).cid.toString()
//     /*
//     ADD ITEM POST
//     */
//     const addItemMsgType: number = 5
//     const addItemMsgBody = encodeAddItemMsgBody({
//       itemCid: itemCid,
//       channelCid: channelId,
//     })
//     if (!addItemMsgBody?.msgBody) return false
//     const addItemMessageHash = generateMessageHash({
//       rid: BigInt(rid),
//       timestamp: BigInt(sigDeadline),
//       msgType: addItemMsgType as number,
//       msgBody: addItemMsgBody.msgBody,
//     })
//     const addItemMsgHashForSig = remove0xPrefix({
//       bytes32Hash: addItemMessageHash,
//     })
//     const addItemSig = (await account.signMessage({message: addItemMsgHashForSig})) as Hash
//     const addItemPost: Post = {
//       signer: account.address,
//       message: {
//         rid: BigInt(rid),
//         timestamp: BigInt(sigDeadline),
//         msgType: addItemMsgType as number,
//         msgBody: addItemMsgBody.msgBody,
//       },
//       hashType: 1 as number,
//       hash: addItemMessageHash,
//       sigType: 1 as number,
//       sig: addItemSig,
//     }
  

//       const postBatchResponse = await relayPostBatch([
//         createItemPost,
//         addItemPost,
//       ])

//       console.log("postBatchResponse", postBatchResponse)
  
//       if (postBatchResponse.success) {
//         const transactionHash = postBatchResponse.hash
//         console.log("transactionHash", transactionHash)
  
//       } 


//      }

    
// export async function relayPostBatch(
//    postArray: Post[],
//     ): Promise<{ success: boolean; hash?: string; rid?: string; error?: string }> {
//     try {
//         const response = await fetch('http://localhost:3000/api/relayPostBatch', {
//         method: 'POST',
//         body: JSON.stringify(postArray),
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
  
// postBatchBot("pk", BigInt(139), 'bafybeibccw64emy47zn7ryhbygv4eoy3ffix2exobsp346wkdw2ddadtcy', 'bafyreibpakg7tqwpgcfehulsu4baj3ztkszky3ugpaaw7uk7o3fjpmra7i' )  
