import {
  merklePayoutStrategyFactoryABI,
  quadraticFundingVotingStrategyFactoryABI,
  roundFactoryABI,
  roundImplementationABI,
  useRoundImplementationApplicationsEndTime,
  useRoundImplementationApplicationsStartTime,
  useRoundImplementationRoundEndTime,
  useRoundImplementationRoundStartTime,
  writeMerklePayoutStrategyFactory,
  writeQuadraticFundingVotingStrategyFactory,
  writeRoundFactory,
} from "../generated";
import { useAccount, useWalletClient } from "wagmi";
import { waitForTransaction } from "@wagmi/core";
import {
  decodeEventLog,
  encodeAbiParameters,
  Hex,
  parseAbiParameters,
  zeroAddress,
  isAddress,
} from "viem";
import { useEffect, useState } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Button, Input, Select } from "@chakra-ui/react";
import { useAddressesStore, useRoundsStore } from "../stores";
import { RoundInfo } from "./RoundInfo";

export function Deployer() {
  const { data: walletClient } = useWalletClient();
  const { address } = useAccount();
  const rounds = useRoundsStore();
  const addresses = useAddressesStore();

  return (
    walletClient &&
    address && (
      <div>
        <Select
          onChange={(e) => {
            useAddressesStore.setState({
              round: e.target.value as Hex,
            });
          }}
        >
          {rounds.rounds.map((r) => (
            <option value={r}>{r}</option>
          ))}
        </Select>

        <Input
          placeholder={"existing round address"}
          onChange={(e) => {
            useAddressesStore.setState({
              round: e.target.value as Hex,
            });
          }}
        />
        {addresses.round && isAddress(addresses.round) && (
          <Button
            onClick={() => {
              rounds.addRound(addresses.round!);
            }}
          >
            Add
          </Button>
        )}

        <pre>{addresses && JSON.stringify(addresses, null, 4)}</pre>
        <RoundInfo />

        <Button
          onClick={async () => {
            let { hash } = await writeQuadraticFundingVotingStrategyFactory({
              mode: "prepared",
              account: address,
              functionName: "create",
            });

            let receipt = await waitForTransaction({
              hash,
            });

            let voting: Hex = zeroAddress;
            receipt.logs
              .map((log) =>
                decodeEventLog({
                  ...log,
                  abi: quadraticFundingVotingStrategyFactoryABI,
                })
              )
              .find((log) => {
                if (log.eventName === "VotingContractCreated") {
                  voting = log.args.votingContractAddress as Hex;
                }
              });

            console.log("✅ Voting Contract Transaction hash: ", hash);
            console.log("✅ Voting Contract address: ", voting);

            let { hash: merkleHash } = await writeMerklePayoutStrategyFactory({
              mode: "prepared",
              account: address,
              functionName: "create",
            });

            const data = await waitForTransaction({
              hash: merkleHash,
            });

            let payout: Hex = zeroAddress;
            data.logs.find((log) => {
              const decoded = decodeEventLog({
                abi: merklePayoutStrategyFactoryABI,
                ...log,
              });
              if (decoded.eventName === "PayoutContractCreated") {
                payout = decoded.args.payoutContractAddress as Hex;
              }
            });

            console.log("✅ Merkle Payout Transaction hash: ", merkleHash);
            console.log("✅ Merkle Payout Strategy address: ", payout);

            const round = await deployRound(
              voting as Hex,
              payout as Hex,
              address,
              BigInt(Date.now() * 1000)
            );

            useAddressesStore.setState({
              round,
              payout,
              voting,
            });

            rounds.setRounds([...new Set([...rounds.rounds, round])]);
          }}
        >
          Deploy Round
        </Button>
      </div>
    )
  );
}

const deployRound = async (
  votingContract: Hex,
  payoutContract: Hex,
  adminAddress: Hex,
  _currentTimestamp: bigint
) => {
  const roundMetaPtr = {
    protocol: 1n,
    pointer: "bafybeia4khbew3r2mkflyn7nzlvfzcb3qpfeftz5ivpzfwn77ollj47gqi",
  };

  const applicationMetaPtr = {
    protocol: 1n,
    pointer: "bafkreih3mbwctlrnimkiizqvu3zu3blszn5uylqts22yvsrdh5y2kbxaia",
  };

  const token = zeroAddress;

  const initAddress = [
    votingContract, // votingStrategy
    payoutContract, // payoutStrategy
  ];

  /* This is 12 seconds on mainnet, but 15 on Goerli. On local networks it will be instant */
  const SECONDS_PER_SLOT = 15n;

  /* All timestamps are in seconds*/
  const initRoundTime = [
    _currentTimestamp + 1n, // appStartTime
    _currentTimestamp + SECONDS_PER_SLOT * 4n, // appEndTime
    _currentTimestamp + SECONDS_PER_SLOT * 6n, // roundStartTime
    _currentTimestamp + SECONDS_PER_SLOT * 8n, // roundEndTime
  ];

  const encodedParameters = encodeAbiParameters(
    parseAbiParameters(
      "(address votingStrategy, address payoutStrategy),(uint256 applicationsStartTime, uint256 applicationsEndTime, uint256 roundStartTime, uint256 roundEndTime),uint256,address,uint8,address,((uint256 protocol, string pointer),(uint256 protocol, string pointer)),(address[] adminRoles, address[] roundOperators)"
    ),
    [
      {
        votingStrategy: initAddress[0] as Hex,
        payoutStrategy: initAddress[1] as Hex,
      },
      {
        applicationsStartTime: initRoundTime[0],
        applicationsEndTime: initRoundTime[1],
        roundStartTime: initRoundTime[2],
        roundEndTime: initRoundTime[3],
      },
      10n,
      token,
      0,
      zeroAddress,
      [roundMetaPtr, applicationMetaPtr],
      {
        adminRoles: [adminAddress],
        roundOperators: [adminAddress],
      },
    ]
  );

  // Deploy a new Round contract
  const { hash } = await writeRoundFactory({
    functionName: "create",
    args: [encodedParameters, adminAddress],
    mode: "prepared",
  });

  const receipt = await waitForTransaction({
    hash,
  });

  let roundAddress: Hex = zeroAddress;
  receipt.logs
    .map((log) => {
      try {
        return decodeEventLog({ ...log, abi: roundFactoryABI });
      } catch {
        /* This tx receipt also captures events emitted from the RoundImplementation,
        so we try parsing it using RoundpImplementation */
        return decodeEventLog({ ...log, abi: roundImplementationABI });
      }
    })
    .find((log) => {
      if (log.eventName === "RoundCreated") {
        roundAddress = log.args.roundAddress as Hex;
      }
    });

  return roundAddress;
};
