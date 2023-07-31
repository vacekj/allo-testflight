import { Hex } from "viem";
import { WalletClient } from "wagmi";

type SignPermitProps = {
  walletClient: WalletClient;
  contractAddress: Hex;
  erc20Name: string;
  owner: Hex;
  spender: Hex;
  value: bigint;
  nonce: bigint;
  deadline: bigint;
  chainId: number;
};

/*64, 64, 2 r, s, v, remove 0x*/
export const signPermitEIP2612 = async (
  { walletClient, contractAddress, erc20Name, owner, spender, value, nonce, deadline, chainId }: SignPermitProps,
) => {
  const types = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ],
  };

  const domainData = {
    name: erc20Name,
    version: "1",
    chainId: chainId,
    verifyingContract: contractAddress,
  };

  const message = {
    owner,
    spender,
    value,
    nonce,
    deadline,
  };

  return walletClient.signTypedData({
    account: owner,
    message,
    domain: domainData,
    primaryType: "Permit",
    types,
  });
};
