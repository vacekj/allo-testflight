import { create } from "zustand";
import { Hex, zeroAddress } from "viem";
import { persist } from "zustand/middleware";
import _ from "lodash";
export const useAddressesStore = create<{
  round?: Hex;
  voting?: Hex;
  payout?: Hex;
}>()(() => ({
  round: "0x",
  voting: "0x",
  payout: "0x",
}));

export const useRoundsStore = create<{
  rounds: Hex[];
  setRounds: (rounds: Hex[]) => void;
  addRound: (round: Hex) => void;
}>()(
  persist(
    (set, get) => ({
      rounds: ["0xA2B88f9A352A1db9A70B41145319DC24bfb83C4D"],
      setRounds: (rounds: Hex[]) =>
        set({
          rounds,
        }),
      addRound: (round: Hex) =>
        set({
          rounds: _.uniq([...get().rounds, round]),
        }),
    }),
    {
      name: "rounds",
    }
  )
);
