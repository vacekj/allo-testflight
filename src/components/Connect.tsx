import { BaseError } from "viem";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Button } from "@chakra-ui/react";

export function Connect() {
  const { connector, isConnected } = useAccount();
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div>
      <div>
        {isConnected && (
          <Button onClick={() => disconnect()}>
            Disconnect from {connector?.name}
          </Button>
        )}

        {connectors
          .filter((x) => x.ready && x.id !== connector?.id)
          .map((x) => (
            <Button key={x.id} onClick={() => connect({ connector: x })}>
              {x.name}
              {isLoading && x.id === pendingConnector?.id && " (connecting)"}
            </Button>
          ))}
      </div>

      {error && <div>{(error as BaseError).shortMessage}</div>}
    </div>
  );
}
