import {
  SolanaProject,
  SolanaDatasourceKind,
  SolanaHandlerKind,
} from "@subql/types-solana";

const TOKEN = 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof';

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
    chainId: "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d",
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: ["https://solana.rpc.subquery.network/public", "https://api.mainnet-beta.solana.com"],
  },
  dataSources: [
    {
      kind: SolanaDatasourceKind.Runtime,
      startBlock: 336382792,

      assets: new Map([["TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA", { file: "./idls/tokenprogram.idl.json" }]]),
      mapping: {
        file: "./dist/index.js",
        handlers: [
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleInitAccount",
            filter: {
              programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              discriminator: "initializeAccount",
              accounts: [
                null,
                [TOKEN],
              ],
            },
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleInitAccount2",
            filter: {
              programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              discriminator: "initializeAccount2",
              accounts: [
                null,
                [TOKEN],
              ],
            },
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleInitAccount3",
            filter: {
              programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              discriminator: "initializeAccount3",
              accounts: [
                null,
                [TOKEN],
              ],
            },
          },
          {
            kind: SolanaHandlerKind.Instruction,
            handler: "handleCheckedTransfer",
            filter: {
              programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
              discriminator: "transferChecked",
              accounts: [
                null,
                [TOKEN],
              ]
            },
          },
          /* The below filters greatly decrease performance because theres no way to filter by token */
          // {
          //   kind: SolanaHandlerKind.Instruction,
          //   handler: "handleCloseAccount",
          //   filter: {
          //     programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          //     discriminator: "closeAccount",
          //   },
          // },
          // {
          //   kind: SolanaHandlerKind.Instruction,
          //   handler: "handleTransfer",
          //   filter: {
          //     programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          //     discriminator: "transfer",
          //   },
          // },
          // {
          //   kind: SolanaHandlerKind.Instruction,
          //   handler: "handleRecoverNestedAssociatedToken",
          //   filter: {
          //     programId: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
          //     discriminator: "recoverNestedAssociatedToken",
          //   },
          // },
        ],
      },
    },
  ],
  repository: "https://github.com/subquery/solana-subql-starter",
};

// Must set default to the project instance
export default project;
