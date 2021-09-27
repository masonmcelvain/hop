import * as React from "react";
import * as ReactDOM from "react-dom";
import { ChakraProvider } from "@chakra-ui/react"
import App from "../app/App";
import "./index.css";
ReactDOM.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>,
  document.querySelector("#root")
);
