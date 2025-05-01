import assert from 'node:assert';
import { InitializeAccountInstruction, InitializeAccount2Instruction, InitializeAccount3Instruction, TransferCheckedInstruction, TransferInstruction, CloseAccountInstruction } from '../types/handler-inputs/TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
import { SolanaInstruction, SolanaTransaction } from '@subql/types-solana';
import { TransactionForFullJson } from '@solana/kit';
import { TokenAccount, Transfer } from '../types/models';


function bnReplacer(value: any): any {
  if (typeof value === 'bigint') {
    return `${value.toString()}n`
  }
  return value;
}

function allAccounts(
  transaction: TransactionForFullJson<0>,
) {
  return [
    ...transaction.transaction.message.accountKeys,
    ...(transaction.meta?.loadedAddresses.writable ?? []),
    ...(transaction.meta?.loadedAddresses.readonly ?? []),
  ];
}

const TOKEN_ADDR = 'rndrizKT3MK1iimdxRdWabcF7Zg7AR5T4nud4EkHBof';

export function getAccountByIndex(
  instruction: SolanaInstruction,
  index: number,
): string {
  return allAccounts(instruction.transaction)[index];
}

export async function handleInitAccount(instruction: InitializeAccountInstruction) {
  logger.info('handleInitAccount');

  const mintIdx = instruction.accounts[1];
  const mintToken = getAccountByIndex(instruction, mintIdx);
  assert(mintToken === TOKEN_ADDR, `Expected mint token to be ${TOKEN_ADDR}, got: ${mintToken}`);

  const acct = TokenAccount.create({
    id: getAccountByIndex(instruction, instruction.accounts[0]),
    token: mintToken,
    transactionHash: instruction.transaction.transaction.signatures[0],
    owner: getAccountByIndex(instruction, instruction.accounts[2]),
  });

  await acct.save();
}

export async function handleInitAccount2(instruction: InitializeAccount2Instruction) {
  logger.info('handleInitAccount2');

  const mintIdx = instruction.accounts[1];
  const mintToken = getAccountByIndex(instruction, mintIdx);
  assert(mintToken === TOKEN_ADDR, `Expected mint token to be ${TOKEN_ADDR}, got: ${mintToken}`);

  const acct = TokenAccount.create({
    id: getAccountByIndex(instruction, instruction.accounts[0]),
    token: mintToken,
    transactionHash: instruction.transaction.transaction.signatures[0],
    owner: (await instruction.decodedData)!.data.owner
  });

  await acct.save();
}

export async function handleInitAccount3(instruction: InitializeAccount3Instruction) {
  logger.info('handleInitAccount3');
  const mintIdx = instruction.accounts[1];
  const mintToken = getAccountByIndex(instruction, mintIdx);
  assert(mintToken === TOKEN_ADDR, `Expected mint token to be ${TOKEN_ADDR}, got: ${mintToken}`);

  const acct = TokenAccount.create({
    id: getAccountByIndex(instruction, instruction.accounts[0]),
    token: mintToken,
    transactionHash: instruction.transaction.transaction.signatures[0],
    owner: (await instruction.decodedData)!.data.owner
  });

  await acct.save();
}

export async function handleCloseAccount(instruction: CloseAccountInstruction) {
  logger.info('handleCloseAccount');
  const tokenAccountId = getAccountByIndex(instruction, instruction.accounts[0])
  await TokenAccount.remove(tokenAccountId);
}

export async function handleTransfer(instruction: TransferInstruction) {
  logger.info(`Solana instruction transfer`);
  const source = getAccountByIndex(instruction, instruction.accounts[0]);
  const dest = getAccountByIndex(instruction, instruction.accounts[1]);

  const [sourceTokenAccount, destTokenAccount] = await Promise.all([
    TokenAccount.get(source),
    TokenAccount.get(dest),
  ]);

  if (!(sourceTokenAccount?.token === TOKEN_ADDR || destTokenAccount?.token === TOKEN_ADDR)) {
    // Transfer is not for the specified token
    return;
  }

  const decoded = await instruction.decodedData;
  assert(decoded, "Expected decoded value");

  const transfer = Transfer.create({
    id: `${instruction.transaction.transaction.signatures[0]}-${instruction.index.join('.')}`,
    amount: BigInt(decoded.data.amount),
    from: source,
    to: dest,
    blockNumber: instruction.block.blockHeight,
    transactionHash: instruction.transaction.transaction.signatures[0],
    date: new Date(Number(instruction.block.blockTime) * 1000),
  });

  await transfer.save();
}

export async function handleCheckedTransfer(instruction: TransferCheckedInstruction) {
  logger.info(`Solana instruction checked transfer`);

  const source = getAccountByIndex(instruction, instruction.accounts[0]);
  const mint = getAccountByIndex(instruction, instruction.accounts[1]);
  const dest = getAccountByIndex(instruction, instruction.accounts[2]);

  if (mint !== TOKEN_ADDR) {
    return;
  }

  const decoded = await instruction.decodedData;
  assert(decoded, "Expected decoded value");

  const transfer = Transfer.create({
    id: `${instruction.transaction.transaction.signatures[0]}-${instruction.index.join('.')}`,
    amount: BigInt(decoded.data.amount),
    from: source,
    to: dest,
    blockNumber: instruction.block.blockHeight,
    transactionHash: instruction.transaction.transaction.signatures[0],
    date: new Date(Number(instruction.block.blockTime) * 1000),
  });

  await transfer.save();
}
