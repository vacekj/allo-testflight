import { BaseError } from "viem";
import { useAccount, useNetwork, useSwitchNetwork } from "wagmi";
import { Button } from "@chakra-ui/react";

export function NetworkSwitcher() {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  if (!chain) return null;

  return (
    <div>
      <div>
        Connected to {chain?.name ?? chain?.id}
        {chain?.unsupported && " (unsupported)"}
      </div>

      {switchNetwork && (
        <div>
          {chains.map((x) =>
            x.id === chain?.id ? null : (
              <Button key={x.id} onClick={() => switchNetwork(x.id)}>
                {x.name}
                {isLoading && x.id === pendingChainId && " (switching)"}
              </Button>
            )
          )}
        </div>
      )}

      <div>{error && (error as BaseError).shortMessage}</div>
    </div>
  );
}
