'use server'

import { type Hash } from 'viem'
import {
  addresses,
  channelSchema,
  encodeAccess101,
  encodeChannel301,
  nodeRegistryABI,
} from 'scrypt'
import { publicClient } from '@/config/publicClient'
import { walletClient } from '@/config/walletClient'

interface CreateChannelProps {
  userId: bigint
  adminIds: bigint[]
  memberIds: bigint[]
  channelUri: string
}

export async function createChannel({
  userId,
  adminIds,
  memberIds,
  channelUri,
}: CreateChannelProps) {
  const accessControlMessage = encodeAccess101({ adminIds, memberIds })

  const channelUriMessage = encodeChannel301({ channelUri })

  const { request } = await publicClient.simulateContract({
    address: addresses.nodeRegistry.opGoerli,
    abi: nodeRegistryABI,
    functionName: 'register',
    args: [
      userId,
      channelSchema,
      [
        accessControlMessage?.message as Hash,
        channelUriMessage?.message as Hash,
      ],
    ],
  })

  const registerHash = await walletClient.writeContract(request)

  console.log('Register hash:', registerHash)
}
