import * as React from "react";
import * as ReactDOM from "react-dom";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react"
import App from "../app/App";
import "./index.css";
import theme from "../app/theme";

ReactDOM.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </>,
  document.querySelector("#root")
);
