import { ponder } from "@/generated";
import { schemaMap } from "./decodingSchema";
import { BigNumberish, Network, Nft, NftMetadata } from "alchemy-sdk";
import getNftMetadata from "./hooks/useGetNFTMetadata";


type OurNftStructure = {

    pieceName?: string,
    pieceCreator?: string,
    pieceDescription?: string,
    pieceImageURL?: string,
    pieceAnimationURL?: string, 
    pieceCreatedDate?: string, 
    pieceContentType?: string

}

function processMetadata(metadata: Nft | NftMetadata  ): OurNftStructure {
  return {
    pieceName: metadata.title,
    pieceCreator: metadata.contract.contractDeployer,
    pieceDescription: metadata.description,
    pieceImageURL: metadata.media[0]?.thumbnail,
    pieceAnimationURL: metadata.contract.raw?.metadata?.animation_url, 
    pieceCreatedDate: metadata.contract.deployedBlockNumber, 
    pieceContentType: metadata.contract.image?.contentType
  };
}


ponder.on("Router:DataSent", async ({ event, context }) => {
  const { Channel, Listing, PieceMetadata } = context.entities;
  const { press, schema, response, ids } = event.params;

  // Decode event response into dynamic array of new listings
  const [newListings] = schemaMap[String(schema)](response);

  // Lookup press in channel table, if it doesnt exist, create it
  let channel = await Channel.findUnique({ id: press });
  if (!channel) {
    channel = await Channel.create({
      id: press,
    });
  }

  // Create a Listing associated with the channel
  for (const [index, newListing] of newListings.entries()) {
    const { chainId, tokenId, listingAddress, hasTokenId } = newListing;
    const listingId = `${chainId}/${press}/${ids[index]}`;

    const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_KEY;
    if (!apiKey) {
      throw new Error("ALCHEMY_KEY is not defined");
    }

    // Fetch the target metadata
    const metadata = await getNftMetadata({
      network: 1,
      address: listingAddress,
      tokenId: tokenId as BigNumberish,
      apiKey: apiKey,
    });

    if (!metadata) {
      console.error("Metadata is undefined for listing:", listingId);
      continue;
    }

    // Process the metadata into your own shape
    const processedMetadata = processMetadata(metadata);

    // Create a Listing entity
    const existingListing = await Listing.findUnique({
      id: listingId,
    });

    if (!existingListing) {
      const listing = await Listing.create({
        id: listingId,
        data: {
          chainId: chainId.toString(),
          tokenId: tokenId.toString(),
          listingAddress: listingAddress,
          hasTokenId: hasTokenId,
          channel: press,
        },
      });
    } else {
      console.log("Listing already exists:", listingId);
    }

    // Check if a PieceMetadata entity with the listingId already exists
    const existingMetadata = await PieceMetadata.findUnique({
      id: listingId,
    });

    // Create a PieceMetadata entity and associate it with the created Listing entity
    if (!existingMetadata) {
      const metadataEntity = await PieceMetadata.create({
        id: listingId,
        data: {
          ...processedMetadata,
          listing: listingId,
        },
      });
    } else {
      console.log("PieceMetadata already exists:", listingId);
    }
  }

  
  ponder.on("Router:DataRemoved", async ({ event, context }) => {
    const { Listing } = context.entities;
    const { press, ids } = event.params;

    // Remove the listings associated with the ids
    for (const id of ids) {
      await Listing.delete({
        id: `${press}-${id}`,
      });
    }
  });

  // setupPress ;; pressRegistered

  ponder.on("Router:PressRegistered", async ({ event, context }) => {
    const { Router } = context.entities;

    const { sender, factory, newPress, newPressData } = event.params;

    await Router.create({
      id: newPress,
      data: {
        sender,
        factory,
        newPress,
        newPressData,
      },
    });
  });
});
