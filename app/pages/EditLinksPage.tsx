import * as React from "react";
import { Link } from "react-router-dom";
import { StyledPage } from "../App";

export default function EditLinksPage(): JSX.Element {
  return (
    <StyledPage>
      <div>
        <Link to="/">LaunchPage</Link>
      </div>
    </StyledPage>
  );
}
