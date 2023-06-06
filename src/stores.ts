import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { Hex } from "viem";

export const useAddressesStore = create<{
  round?: Hex;
  voting?: Hex;
  payout?: Hex;
}>()(() => ({
  round: "0x",
  voting: "0x",
  payout: "0x",
}));
