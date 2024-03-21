import * as dagCbor from '@ipld/dag-cbor'
import * as Block from 'multiformats/block'
import { sha256 } from 'multiformats/hashes/sha2'
import type { Message, Post } from 'scrypt'

export async function messageToCid(message: Message) {
  return await Block.encode({ value: message, codec: dagCbor, hasher: sha256 })
}

export async function postToCid(post: Post) {
  return await Block.encode({ value: post, codec: dagCbor, hasher: sha256 })
}

export function w3sUrlFromCid({ cid }: { cid: string }) {
  return `https://ipfs.w3s.link/ipfs/${cid}`
}

export function ipfsUrlToCid({ ipfsUrl }: { ipfsUrl: string }) {
  if (!ipfsUrl) return ''
  return ipfsUrl.replace('ipfs://', '')
}
