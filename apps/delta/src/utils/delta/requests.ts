import sdk from './client'

export const getItemWithId = async ({ id }: { id: string }) => {
    const response = await sdk.itemWithId({
        id: id,
    })

    return { item: response.item }
}
