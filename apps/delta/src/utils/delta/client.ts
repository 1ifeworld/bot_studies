import { GraphQLClient } from 'graphql-request'
import { getSdk } from './generated'

const client = new GraphQLClient(
  process.env.PROD_DELTA_GRAPHQL_API as string,
  {
    headers: {
      'Content-Type': 'application/json',
    },
    fetch,
  },
)

const sdk = getSdk(client)

export default sdk
