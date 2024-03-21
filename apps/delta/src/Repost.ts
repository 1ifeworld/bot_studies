import { ponder } from '@/generated'
import {
  postGatewayABI,
  decodeCreateAssetMsgBody,
  decodeAddItemMsgBody,
  remove0xPrefix,
  type Post,
  MessageTypes,
  ChannelAccessTypes,
  ChannelDataTypes,
  ItemAccessTypes,
  ItemDataTypes,
  ChannelRoleTypes,
  decodeRemoveItemMsgBody,
  decodeUpdateAssetMsgBody,
  encodeCreateAssetMsgBody,
  generateMessageHash,
  encodeAddItemMsgBody
} from 'scrypt'
import {
  encodeAbiParameters,
  decodeFunctionData,
  getAddress,
  decodeAbiParameters,
  recoverMessageAddress,
  Hex,
  Hash
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { messageToCid, postToCid, USER_ID_ZERO } from './utils'
import { generateReplicateImgae, getItemWithId } from './utils'




function getExpiration() {
  return BigInt(Math.floor(Date.now() / 1000) + 360) // 3 min buffer
}

const ANCHOR_CHANNEL: string = "bafyreiel65bsc6oowv4f3i7vmutho4njze2f3bbq7d54ioe3vjydyqkz7e"
const TARGET_CHANNEL: string = "bafyreig3virwtjbscck3nudthed2zlhv3suii63idsp2ygwos5mjsy3kma"
const botRid: bigint = BigInt(139)
const botPrivateKey: Hash = process.env.BOT_PRIVATE_KEY as Hash

ponder.on('PostGateway:NewPost', async ({ event }) => {
  

  /* ************************************************

                      INTAKE

  ************************************************ */

  const posts: Post[] = []

  const { args } = decodeFunctionData({
    abi: postGatewayABI,
    data: event.transaction.input,
  })

  // console.log('Post args:', args)

  // if decode fails return
  if (!args?.[0]) return

  // Check if args is an array of posts or a batch of posts
  if (Array.isArray(args[0])) {
    for (let i = 0; i < args[0].length; ++i) {
      posts[i] = args[0][i]
    }
  } else {
    const singlePost = args[0] as Post
    posts.push(singlePost)
  }

  // process every post -> associated message
  for (let i = 0; i < posts.length; ++i) {
    switch (posts[i].message.msgType) {
      // message type 5
      case MessageTypes.ADD_ITEM_TO_CHANNEL: {
        console.log('valid message type detected')
        // decode add item details
        const { itemCid: addItemCid, channelCid: addChannelCid } =
          decodeAddItemMsgBody({ msgBody: posts[i].message.msgBody }) || {}          
        // check for proper decode
        if (!addItemCid || !addChannelCid) return
        // check if channel is the one we want
        if (addChannelCid !== ANCHOR_CHANNEL) {
          console.log("NOT ANCHOR CHANNEL")
          return
        }
        console.log("MSG FROM ANCHOR CHANNEL DETECTED")
        // check if item already exists in target channel
        const resp = await getItemWithId({id: addItemCid})
        if (!resp || !resp.item?.id) return
        console.log("ITEM NOT PRESENT IN TARGET CHANNEL. CONTINUING TO PROCESSING")

        /* ************************************************

                        MESSAGING PROCESSING

        ************************************************ */        

        /*
            GENERATE REPLICATE OUTPUT
        */

        /*
            UPLOAD TO W3S
        */            

        /*
            UPLOAD TO METADATA SERVER
        */       
       
        /*
            SUBMIT CREATE/ADD ITEM BATCH POST
        */               
























        // generate mirror add item

        // set up sig + account signer instance
        const sigDeadline = getExpiration()
        const account = privateKeyToAccount(botPrivateKey)

        // generate add item post
        const addItemMsgType: number = 5
        const addItemMsgBody = encodeAddItemMsgBody({
          itemCid: addItemCid,
          channelCid: TARGET_CHANNEL,
        })
        // if (!addItemMsgBody?.msgBody) return false
        const addItemMessageHash = generateMessageHash({
          rid: botRid,
          timestamp: sigDeadline,
          msgType: addItemMsgType as number,
          msgBody: addItemMsgBody?.msgBody as Hex,
        })
        const addItemMsgHashForSig = remove0xPrefix({
          bytes32Hash: addItemMessageHash,
        })
        const addItemSig = (await account.signMessage({message: addItemMsgHashForSig})) as Hash
        const addItemPost: Post = {
          signer: account.address,
          message: {
            rid: botRid,
            timestamp: sigDeadline,
            msgType: addItemMsgType as number,
            msgBody: addItemMsgBody?.msgBody as Hex,
          },
          hashType: 1 as number,
          hash: addItemMessageHash,
          sigType: 1 as number,
          sig: addItemSig,
        }        

        // console.log("add item post: ", addItemPost)

        // submit post to relayer
        const postBatchResponse = await relayPostBatch([
          // createItemPost,
          addItemPost,
        ])
  
        console.log("postBatchResponse", postBatchResponse)
    
        if (postBatchResponse.success) {
          const transactionHash = postBatchResponse.hash
          console.log("transactionHash", transactionHash)
    
        } 
        // return true
      }
    }
  }
})

function stringifyWithBigInt(obj: any): string {
  return JSON.stringify(obj, (_, value) =>
      typeof value === 'bigint' ? value.toString() : value // Convert BigInt to string
  );
}

export async function relayPostBatch(
  postArray: Post[],
   ): Promise<{ success: boolean; hash?: string; rid?: string; error?: string }> {
    console.log("starging post batch relay from delta")

    console.log("incoming string array")
   try {
       const response = await fetch('http://localhost:3000/api/postBatch', {
       method: 'POST',
       body: stringifyWithBigInt(postArray),
       })
       if (!response.ok) throw new Error('Transaction failed')
   
       const data = await response.json()
       if (data.success) {
       return { success: true, hash: data.hash, rid: data.rid }
       } else {
       throw new Error(data.error || 'Transaction not included')
       }
   } catch (error) {
       console.error('relayPostBatchError error:', error)
       return {
       success: false,
       error: error instanceof Error ? error.message : 'Unknown error',
       }
   }
}

        // export async function postBatchBot(privateKey: Hash, rid: bigint, itemUri: string, channelId: string) {
      
          // generate sig
          
          // const client = createWalletClient({
          //     chain: optimism,
          //     transport: http('https://wild-chaotic-meme.optimism.quiknode.pro/58c9d38ed8dd1d795e4b20726866866d595a7cda/')
          //   })      
          
          // const createItemMsgType = 1
          // const createItemMsgBody = encodeCreateAssetMsgBody({
          //   data: {
          //     dataType: 1,
          //     contents: encodeAbiParameters(
          //       [{ name: 'itemUri', type: 'string' }],
          //       [addItemCid],
          //     ),
          //   },
          //   access: {
          //     accessType: 1,
          //     contents: encodeAbiParameters(
          //       [
          //         { name: 'members', type: 'uint256[]' },
          //         { name: 'roles', type: 'uint256[]' },
          //       ],
          //       // Hardcoding in Roles.ADMIN for item creators
          //       [[botRid], [BigInt(2)]],
          //     ),
          //   },
          // })
          // if (!createItemMsgBody?.msgBody) return false
          // // generate hash to include in post
          // const createItemMessageHash = generateMessageHash({
          //   rid: botRid,
          //   timestamp: BigInt(sigDeadline),
          //   msgType: createItemMsgType as number,
          //   msgBody: createItemMsgBody.msgBody,
          // })
          // const createItemMsgHashForSig = remove0xPrefix({
          //   bytes32Hash: createItemMessageHash,
          // })
      
      
          // const createItemSig = await account.signMessage(
          //     {message: createItemMsgHashForSig}
          //   ) as Hash
          //   const createItemPost: Post = {
          //     signer: account.address,
          //     message: {
          //       rid: botRid,
          //       timestamp: BigInt(sigDeadline),
          //       msgType: createItemMsgType as number,
          //       msgBody: createItemMsgBody.msgBody,
          //     },
          //     hashType: 1,
          //     hash: createItemMessageHash,
          //     sigType: 1,
          //     sig: createItemSig,
          //   }
      
          //       // Create itemCid using canonical types
          // const itemCid = (await messageToCid(createItemPost.message)).cid.toString()