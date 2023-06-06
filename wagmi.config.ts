import { defineConfig } from "@wagmi/cli";
import { actions, hardhat, react } from "@wagmi/cli/plugins";
import * as chains from "wagmi/chains";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    hardhat({
      project: "./contracts",
      deployments: {
        QuadraticFundingVotingStrategyFactory: {
          5: "0x06A6Cc566c5A88E77B1353Cdc3110C2e6c828e38",
        },
        MerklePayoutStrategyFactory: {
          5: "0xE2Bf906f7d10F059cE65769F53fe50D8E0cC7cBe",
        },
        RoundFactory: {
          5: "0x24F9EBFAdf095e0afe3d98635ee83CD72e49B5B0",
        },
        ProgramFactory: {
          5: "0x24F9EBFAdf095e0afe3d98635ee83CD72e49B5B0",
        },
        ProjectRegistry: {
          5: "0xa71864fAd36439C50924359ECfF23Bb185FFDf21",
        },
      },
    }),
    react(),
    actions(),
  ],
});
