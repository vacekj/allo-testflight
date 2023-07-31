import { defineConfig } from "@wagmi/cli";
import {actions, react, foundry} from "@wagmi/cli/plugins";

export default defineConfig({
  out: "src/generated.ts",
  plugins: [
    react(),
    actions(),
    foundry({
      project: "./allo-multi-round-checkout"
    })
  ],
});
