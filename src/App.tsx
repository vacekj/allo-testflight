import { useAccount } from "wagmi";

import { Account } from "./components/Account";
import { Connect } from "./components/Connect";
import { NetworkSwitcher } from "./components/NetworkSwitcher";

import { Deployer } from "./components/Deployer";
import { Container, Heading } from "@chakra-ui/react";

export function App() {
  const { isConnected } = useAccount();

  return (
    <Container>
      <Heading>Allo Protocol Testflight</Heading>

      <Connect />

      {isConnected && (
        <>
          <Account />
          <NetworkSwitcher />
          <Deployer />
        </>
      )}
    </Container>
  );
}
