import {
  SolanaProject,
  SolanaDatasourceKind,
  SolanaHandlerKind,
} from "@subql/types-solana";

// Can expand the Datasource processor types via the generic param
const project: SolanaProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "solana-token-program-starter",
  description:
    "This project can be use as a starting point for developing your new Solana SubQuery project, indexes all transfers for the Trump token from the Token Program on Solana",
  runner: {
    node: {
      name: "@subql/node-solana",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    chainId: "mainnet",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: ["https://solana.rpc.subquery.network/public"],
  },
  dataSources: [
    {
      kind: SolanaDatasourceKind.Runtime,
      startBlock: 314587496,

      // options: {
      //   // Must be a key of assets
      //   abi: "bayc",
      //   address: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D",
      // },
      // assets: new Map([["bayc", { file: "./abis/bayc.abi.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleTransfer",
            filter: {
              programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
            },
          },
        ],
      },
    },
  ],
  repository: "https://github.com/subquery/solana-subql-starter",
};

// Must set default to the project instance
export default project;
