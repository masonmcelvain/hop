import * as React from "react";
import Page from "./Page";
import { useInitializeColorMode } from "@hooks/useInitializeColorMode";
import { useInitializeState } from "@hooks/useInitializeState";

export default function App() {
   useInitializeColorMode();
   useInitializeState();
   return <Page />;
}
