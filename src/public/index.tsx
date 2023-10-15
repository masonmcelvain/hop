import * as React from "react";
import { createRoot } from "react-dom/client";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import "./index.css";
import theme from "@ui/theme";
import App from "@components/App";

const domNode = document.getElementById("root");
if (!domNode) throw new Error("No root element found");
createRoot(domNode).render(
   <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
         <App />
      </ChakraProvider>
   </>,
);
