/* MEDIA SERVICE */

export async function w3sUpload(body: FormData, secret: string | null) {
    try {
      const res = await fetch('https://river-media-service.up.railway.app/w3s', {
        method: 'POST',
        headers: process.env.MEDIA_SERVICE_SECRET ? { secret: `Bearer ${secret}` } : undefined,
        body,
      })
  
      if (res.status === 413) {
        console.error('File too large')
        throw new Error('File too large. Please try a smaller file.')
      } else if (!res.ok) {
        const errorText = await res.text()
        console.error('Could not upload file', errorText)
        throw new Error(
          `Could not upload file: ${res.status} ${res.statusText} - ${errorText}`,
        )
      }
  
      return res.json()
    } catch (error) {
      console.error('Upload failed', error)
      throw error
    }
  }






// import { CarReader } from '@ipld/car'
// import { importDAG } from '@ucanto/core/delegation'
// import { parse } from '@ucanto/principal/ed25519'
// import { StoreMemory } from '@web3-storage/access'
// import { create, type Client } from '@web3-storage/w3up-client'
// import { formidable } from 'formidable'
// import { filesFromPaths } from 'files-from-path'
// import { AnyLink } from '@web3-storage/w3up-client/dist/src/types'

// let client: Client

// (async () => {
//   const principal = parse(process.env.KEY)
//   client = await create({ principal, store: new StoreMemory() })
//   const proof = await parseProof(process.env.PROOF as string)
//   const space = await client.addSpace(proof)
//   await client.setCurrentSpace(space.did())
// })()

// /** @param {string} data Base64 encoded CAR file */
// async function parseProof(replicateImage: string) {
//   const blocks = []
//   const reader = await CarReader.fromBytes(Buffer.from(replicateImage, 'base64'))
//   for await (const block of reader.blocks()) {
//     blocks.push(block)
//   }
//   return importDAG(blocks)
// }

// async function uploadw3s(body: string) {
//       const filePath = body.file[0].filepath
//       const files = await filesFromPaths([filePath])
//       if (body) {
//       let cid = await client.uploadFile(files[0])
//     } else {
//       cid = await client.uploadFile(
//         new Blob([JSON.stringify(body)], { type: 'application/json' }),
//       )
//     }
//     if (!cid) {
//       console.error('Upload to Web3 Storage failed: CID is undefined')
//       throw new Error('Upload to Web3 Storage failed.')
//     }

//     console.log(`https://${cid}.ipfs.w3s.link`)
//     return new Response(JSON.stringify({ cid: cid.toString() }), {
//       status: 200,
//       headers: { 'Content-Type': 'application/json' }
//     })
//   } catch (error) {
//     console.error('Error handling request:', error.message)

//     if (error.message.includes('File size limit exceeded')) {
//       return new Response(JSON.stringify({ error: error.message }), {
//         status: 413, 
//         headers: { 'Content-Type': 'application/json' }
//       })
//     }
//     return new Response(JSON.stringify({ error: error.message }), {
//       status: 500,
//       headers: { 'Content-Type': 'application/json' }
//     })
//   }
// }) 


// function watchData(req: any) {
//   return new Promise((resolve, reject) => {
//     const form = formidable({
//       multiples: true,
//       maxFileSize: 200 * 1024 * 1024,
//     })
//     form.parse(req, (error, fields, files) => {
//       if (error) {
//         if (error.message.includes('maxFileSize exceeded')) {
//           console.error('File size limit exceeded:', error.message)
//           reject(new Error('File size limit exceeded. Max size is 200MB.'))
//         } else {
//           console.error('Form parsing failed:', error.message)
//           reject(new Error('Failed to process form data.'))
//         }
//         return
//       }
//       const nonArrayFields = {}
//       for (const key in fields) {
//         nonArrayFields[key] = Array.isArray(fields[key])
//           ? fields[key][0]
//           : fields[key]
//       }
//       resolve({ ...nonArrayFields, ...files })
//     })
//   })
// }
