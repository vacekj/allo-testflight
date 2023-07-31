import { Button, Container, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { Hex, hexToNumber, slice } from "viem";
import { useAccount, useContractWrite, useNetwork } from "wagmi";
import { useWalletClient } from "wagmi";
import mrcabi from "./mrcabi";
import { signPermitEIP2612 } from "./permit";

const MRC_IMPL = "0x521bb00da4273e1882d2fb690388cad81bdd5e55";
const groupedVotes: Record<Hex, Hex[]> = {
  "0x894D5d1E65B9C51671e93E2e9a159C90d1a455d1": [
    "0x00000000000000000000000011fe4b6ae13d2a6055c8d9cf65c55bac32b5d8440000000000000000000000000000000000000000000000000de0b6b3a76400000000000000000000000000005f390415db0f7d4d336095f3fd266d6b3b616e7ae280d64d9f7778747f0ff29976a933a73849c759a95cf0e8fd2db18cb495933a0000000000000000000000000000000000000000000000000000000000000000",
    "0x00000000000000000000000011fe4b6ae13d2a6055c8d9cf65c55bac32b5d8440000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000668610ff020ba6326d1f39d58464f2a5892a7cbe2ae9c96f8c81a963d5cc2d52b50f90e7d95e5ddee68c81c84e9d609a0a17f3930000000000000000000000000000000000000000000000000000000000000001",
  ],
};

const groupedAmounts: Record<Hex, bigint> = {
  "0x894D5d1E65B9C51671e93E2e9a159C90d1a455d1": 2n,
};

const rounds = Object.keys(groupedAmounts) as Hex[];

const XPZ = "0xbaa146619512b97216991ba37ae74de213605f8e";
export function App() {
  const [permit, setPermit] = useState<Hex>();
  const [rsv, setRsv] = useState<{ r: Hex; s: Hex; v: number; deadline: bigint }>({
    r: "0x",
    s: "0x",
    v: 0,
    deadline: 0n,
  });
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0x521bb00da4273e1882d2fb690388cad81bdd5e55",
    abi: mrcabi,
    functionName: "voteERC20Permit",
    args: [
      Object.values(groupedVotes),
      rounds,
      Object.values(groupedAmounts),
      2n,
      XPZ,
      rsv.deadline,
      rsv.v,
      rsv.r,
      rsv.s,
    ],
  });
  const { address } = useAccount();
  const {
    chain,
  } = useNetwork();

  const { data: walletClient } = useWalletClient();

  if (!walletClient || !chain?.id || !address) {
    return <ConnectButton />;
  }

  return (
    <Container maxW={"6xl"}>
      <Heading>Allo Protocol Testflight</Heading>
      <Button
        onClick={async () => {
          const rawPermit = await signPermitEIP2612({
            chainId: chain?.id,
            deadline: 1693440000000n,
            walletClient,
            contractAddress: XPZ,
            nonce: 0n,
            erc20Name: "Exprez",
            owner: address,
            spender: MRC_IMPL,
            value: 2n,
          });
          const [r, s, v] = [slice(rawPermit, 0, 32), slice(rawPermit, 32, 64), slice(rawPermit, 64, 65)];
          console.log(r, s, hexToNumber(v));
          setRsv({
            r,
            s,
            v: hexToNumber(v),
            deadline: 1693440000000n,
          });
          setPermit(rawPermit);
        }}
      >
        Sign permit
      </Button>

      <Button
        onClick={async () => {
          await write();
        }}
        disabled={!permit}
      >
        vote
      </Button>
      <ConnectButton />
    </Container>
  );
}
