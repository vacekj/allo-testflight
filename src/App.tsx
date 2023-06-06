import { useAccount } from "wagmi";

import { Deployer } from "./components/Deployer";
import { Container, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function App() {
  const { isConnected } = useAccount();

  return (
    <Container maxW={"6xl"}>
      <Heading>Allo Protocol Testflight</Heading>

      <ConnectButton />

      {isConnected && <Deployer />}
    </Container>
  );
}
