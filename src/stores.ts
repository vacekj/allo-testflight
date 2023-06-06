import { create } from "zustand/esm";
import { Hex, zeroAddress } from "viem";

export const useAddressesStore = create<{
  round: Hex;
  voting: Hex;
  payout: Hex;
}>((set) => ({
  round: zeroAddress,
  voting: zeroAddress,
  payout: zeroAddress,
}));
