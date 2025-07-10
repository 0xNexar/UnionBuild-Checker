import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient("https://graphql.union.build/v1/graphql");

const query = gql`
  query TransferListPage($limit: Int!, $sortOrder: String, $comparison: String, $addresses: jsonb) {
    v2_transfers(args: {
      p_limit: $limit,
      p_sort_order: $sortOrder,
      p_comparison: $comparison,
      p_addresses_canonical: $addresses
    }) {
      sort_order
    }
  }
`;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const wallet = req.query.wallet;

  if (!wallet) {
    return res.status(400).json({ error: "Wallet address is required" });
  }

  try {
    const totalCount = await countTotalTxs(wallet.toLowerCase());
    res.status(200).json({ totalTxCount: totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Error fetching transactions" });
  }
}

async function countTotalTxs(userAddress) {
  const limit = 100;
  let sortOrder = null;
  let totalCount = 0;
  let hasMore = true;

  while (hasMore) {
    const variables = {
      limit,
      sortOrder,
      comparison: "lt",
      addresses: [userAddress],
    };

    try {
      const response = await client.request(query, variables);
      const transfers = response.v2_transfers;

      // Handle case if no transfers are returned
      if (!transfers || transfers.length === 0) {
        hasMore = false;
        continue;  // Skip to next iteration if no transfers are found
      }

      totalCount += transfers.length;

      if (transfers.length < limit) {
        hasMore = false; // Stop fetching more if we have less than the limit
      } else {
        sortOrder = transfers[transfers.length - 1].sort_order;
      }
    } catch (error) {
      throw new Error("Error during GraphQL request: " + error.message);
    }
  }

  return totalCount;
}
