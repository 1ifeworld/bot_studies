import {
  Abi,
  Account,
  Chain,
  Client,
  SimulateContractParameters,
  Transport,
  WriteContractParameters,
  WriteContractReturnType,
  BlockTag,
  Hex  
} from 'viem'
import {
  simulateContract,
  writeContract as viem_writeContract,
} from 'viem/actions'
import pRetry from 'p-retry'
import { parseAccount } from 'viem/accounts'
import { createNonceManager } from '@/lib'
import { globalNonceManager } from '@/config/globalNonceManager'
import PQueue from "p-queue";

type CreateNonceManagerResult = {
  account: Hex;
  hasNonce: () => boolean;
  nextNonce: () => number;
  resetNonce: () => Promise<void>;
  shouldResetNonce: (error: unknown) => boolean;
  mempoolQueue: PQueue;
};

export async function writeContract<
  TChain extends Chain | undefined,
  TAccount extends Account | undefined,
  TAbi extends Abi | readonly unknown[],
  TFunctionName extends string,
  TChainOverride extends Chain | undefined,
>(
  client: Client<Transport, TChain, TAccount>,
  nonceManager: CreateNonceManagerResult,
  request: WriteContractParameters<
    TAbi,
    TFunctionName,
    TChain,
    TAccount,
    TChainOverride
  >,
): Promise<WriteContractReturnType> {
  const account = request.account ?? client.account
  if (!account) {
    // TODO: replace with viem AccountNotFoundError once its exported
    throw new Error('No account provided')
  }

  async function prepareWrite(): Promise<
    WriteContractParameters<
      TAbi,
      TFunctionName,
      TChain,
      TAccount,
      TChainOverride
    >
  > {
    if (request.gas) {
      console.log('gas value provided in txn request, skipping simulation')
      return request
    }

    const result = await simulateContract<
      TChain,
      TAbi,
      TFunctionName,
      TChainOverride
    >(client, {
      ...request,
      blockTag: 'pending',
      account: account
    } as unknown as SimulateContractParameters<
      TAbi,
      TFunctionName,
      TChain,
      TChainOverride
    >)

    return result.request as unknown as WriteContractParameters<
      TAbi,
      TFunctionName,
      TChain,
      TAccount,
      TChainOverride
    >
  }

  const preparedWrite = await prepareWrite()

  return nonceManager.mempoolQueue.add(
    () =>
      pRetry(
        async () => {
          if (!nonceManager.hasNonce()) {
            await nonceManager.resetNonce()
          }

          const nonce = nonceManager.nextNonce()
          return await viem_writeContract(client, {
            nonce,
            ...preparedWrite,
          } as typeof preparedWrite)
        },
        {
          retries: 3,
          onFailedAttempt: async (error) => {
            // On nonce errors, reset the nonce and retry
            if (nonceManager.shouldResetNonce(error)) {
              //   debug("got nonce error, retrying", error.message);
              console.log(
                'error getting nonce – retrying. error: ',
                error.message,
              )
              await nonceManager.resetNonce()
              return
            }
            // TODO: prepareWrite again if there are gas errors?
            throw error
          },
        },
      ),
    { throwOnTimeout: true },
  )
}
