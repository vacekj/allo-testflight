import { useAccount } from "wagmi";

import { Account } from "./components/Account";
import { Connect } from "./components/Connect";
import { NetworkSwitcher } from "./components/NetworkSwitcher";

import { Deployer } from "./components/Deployer";

export function App() {
  const { isConnected } = useAccount();

  return (
    <>
      <h1>Allo Protocol Testflight</h1>

      <Connect />

      {isConnected && (
        <>
          <Account />
          <NetworkSwitcher />
          <Deployer />
        </>
      )}
    </>
  );
}
