import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { WagmiConfig } from "wagmi";
import { ChakraProvider } from "@chakra-ui/react";
import { App } from "./App";
import { config } from "./wagmi";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ChakraProvider>
      <WagmiConfig config={config}>
        <App />
      </WagmiConfig>
    </ChakraProvider>
  </React.StrictMode>
);
