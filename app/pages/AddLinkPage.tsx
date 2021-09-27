import * as React from "react";
import styled, { withTheme } from "styled-components";
import { Link, useHistory } from "react-router-dom";
import * as psl from "psl";
import { Input, Text } from "@chakra-ui/react"
import { addLinkType, StyledPage } from "../App";
import { ChevronLeft } from "react-feather";
import { getCurrentTabUrl } from "../lib/chrome/Tab";

const BackButtonLink = styled(Link)`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  margin: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
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
  margin: 12px 0 0;
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

const StyledInput = styled.input`
  width: 80%;
  padding: 8px;
  margin: 8px;
  font-size: 20px;
  border: ${(props) => props.theme.borders.input};
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 80%;
  padding: 8px;
  margin: 8px;
  font-size: 20px;
  border: ${(props) => props.theme.borders.input};
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
  const [imageUrl, setImageUrl] = React.useState("");
  const [imageUrlError, setImageUrlError] = React.useState("");
  const [sectionIndex, setSectionIndex] = React.useState(0);
  const history = useHistory();

  const initLinkUrl = React.useCallback(async () => {
    const url = await getCurrentTabUrl();
    setLinkUrl(url);
  }, []);

  React.useEffect(() => {
    initLinkUrl();
  }, []);

  function handleImageUrlChange(event) {
    event.preventDefault();
    const urlValue = event.target.value ? event.target.value : "";
    setImageUrl(urlValue);
    try {
      urlValue && new URL(urlValue);
      setImageUrlError("");
    } catch (e) {
      if (!(e instanceof TypeError)) {
        throw e;
      }
      setImageUrlError("Please enter a valid image url");
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!linkName || !linkUrl) {
      return;
    }
    try {
      const url = new URL(linkUrl);
      if (!psl.isValid(url.hostname)) {
        throw new Error(`Invalid URL Domain: ${url.hostname}`);
      }
      addLink(linkName, url.toString(), sectionIndex, imageUrl);
      history.push("/");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <StyledPage>
      <BackButtonLink to="/">
        <ChevronLeft color={theme.colors.textColor} size={34} />
      </BackButtonLink>
      <Title>Create New Link</Title>
      <FlexFormContainer>
        <Form onSubmit={onSubmit}>
          <StyledInput
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
          <Text mb="8px" color={theme.colors.textColor}>{imageUrlError}</Text>
          <Input
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="Optional Custom Image Url"
            isInvalid={!!imageUrlError}
            size="md"
            width={{ base: "80%" }}
            margin="0 8px"
            color={theme.colors.textColor}
          />
          <SubmitButton type="submit" disabled={!!imageUrlError}>
            Create
          </SubmitButton>
        </Form>
      </FlexFormContainer>
    </StyledPage>
  );
}

export default withTheme(AddLinkPage);
