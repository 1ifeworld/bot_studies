import { Grid, Typography } from '@/design-system'
import { getAllAdds } from '@/gql'
import { ItemCard } from '@/server'

export default async function Home() {
  const { adds } = await getAllAdds()

  if (!adds || !adds.items || adds?.items?.length === 0) {
    return <Typography>No items added yet</Typography>
  }

  return (
    <Grid className="grid-cols-2 md:grid-cols-[repeat(auto-fill,_minmax(255px,_1fr))] gap-5 py-[30px]">
      {adds.items.map((add, index) =>
        add.removed ? null : (
          // @ts-ignore
          <ItemCard key={index} add={add} />
        ),
      )}
    </Grid>
  )
}
