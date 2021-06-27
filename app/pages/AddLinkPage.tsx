import * as React from "react";
import styled, { withTheme } from "styled-components";
import { Link, useHistory } from "react-router-dom";
import { addLinkType, StyledPage } from "../App";
import { ChevronLeft } from "react-feather";

const BackButtonLink = styled(Link)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  margin: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  @media (hover: hover) and (pointer: fine) {
    :hover {
      background-color: ${(props) => props.theme.colors.overlay_15};
    }
  }

  :active {
    background-color: ${(props) => props.theme.colors.overlay_25};
  }
`;

const Title = styled.h1`
  text-align: center;
  margin: 8px;
  font-weight: 400;
  color: ${(props) => props.theme.colors.textColor};
`;

const FlexFormContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  width: 80%;
  padding: 8px;
  margin: 8px;
  font-size: 20px;
  border: ${props => props.theme.borders.input};
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 80%;
  padding: 8px;
  margin: 8px;
  font-size: 20px;
  border: ${props => props.theme.borders.input};
  border-radius: 4px;
`;

const SubmitButton = styled.button`
  padding: 8px 16px;
  margin: 8px;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => props.theme.colors.textColor};
  background-color: ${(props) => props.theme.colors.overlay_10};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;

  @media (hover: hover) and (pointer: fine) {
    :hover {
      background-color: ${(props) => props.theme.colors.overlay_15};
    }
  }

  :active {
    background-color: ${(props) => props.theme.colors.overlay_25};
  }
`;

type AddLinkPageProps = {
  addLink: addLinkType;
  theme;
};
function AddLinkPage({ addLink, theme }: AddLinkPageProps) {
  const [linkName, setLinkName] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");
  const [sectionIndex, setSectionUndex] = React.useState(0);
  const history = useHistory();

  function onSubmit(event) {
    event.preventDefault();
    if (!linkName || !linkUrl) {
      return;
    }
    addLink(linkName, linkUrl, sectionIndex);
    history.push("/");
  }

  return (
    <StyledPage>
      <BackButtonLink to="/">
        <ChevronLeft color={theme.colors.textColor} size={32} />
      </BackButtonLink>
      <Title>Create New Link</Title>
      <FlexFormContainer>
        <Form onSubmit={onSubmit}>
          <Input
            type="text"
            value={linkName}
            onChange={(event) => setLinkName(event.target.value)}
            placeholder="title"
            maxLength={48}
          />
          <TextArea
            value={linkUrl}
            onChange={(event) => setLinkUrl(event.target.value)}
            placeholder="url"
            maxLength={2048}
          />
          <SubmitButton type="submit">Create</SubmitButton>
        </Form>
      </FlexFormContainer>
    </StyledPage>
  );
}

export default withTheme(AddLinkPage);
