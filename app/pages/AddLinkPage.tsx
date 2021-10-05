import * as React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as psl from "psl";
import {
  Button,
  Center,
  Heading,
  IconButton,
  Input,
  InputRightElement,
  InputGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChevronLeft } from "react-feather";
import { getCurrentTabUrl } from "../lib/chrome/Tab";
import { LinksContext } from "../contexts/Links";
import { LinkAction } from "../contexts/Links/reducer";

type FormFields = {
  linkName: string;
  linkNameError: string;
  linkUrl: string;
  linkUrlError: string;
  imageUrl: string;
  imageUrlError: string;
  sectionIndex: number;
};
const initialFormValues = {
  linkName: "",
  linkNameError: "",
  linkUrl: "",
  linkUrlError: "",
  imageUrl: "",
  imageUrlError: "",
  sectionIndex: 0,
};

export default function AddLinkPage(): JSX.Element {
  const { dispatch } = React.useContext(LinksContext);
  const [formValues, setFormValues] =
    React.useState<FormFields>(initialFormValues);
  const history = useHistory();

  const initLinkUrl = React.useCallback(async () => {
    const url = await getCurrentTabUrl();
    setFormValues({ ...formValues, linkUrl: url });
  }, []);

  React.useEffect(() => {
    initLinkUrl();
  }, []);

  function handleNameChange(event) {
    event.preventDefault();
    const linkName = event.target.value ? event.target.value : "";
    const linkNameError = linkName ? "" : "Please enter a name for the link";
    setFormValues({ ...formValues, linkName, linkNameError });
  }

  function handleLinkUrlChange(event) {
    event.preventDefault();
    const linkUrl = event.target.value ? event.target.value : "";
    const linkUrlError = linkUrl ? "" : "Please enter a url for the link";
    setFormValues({ ...formValues, linkUrl, linkUrlError });
  }

  function handleImageUrlChange(event) {
    event.preventDefault();
    const urlValue = event.target.value ? event.target.value : "";
    let imageUrlError = "";
    try {
      urlValue && new URL(urlValue);
    } catch (e) {
      if (!(e instanceof TypeError)) {
        throw e;
      }
      imageUrlError = "Please enter a valid image url";
    }
    setFormValues({
      ...formValues,
      imageUrl: urlValue,
      imageUrlError,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    try {
      const url = new URL(formValues.linkUrl);
      if (!psl.isValid(url.hostname)) {
        throw new Error(`Invalid URL Domain: ${url.hostname}`);
      }
      dispatch({
        type: LinkAction.ADD_LINK,
        payload: {
          name: formValues.linkName,
          url: url.toString(),
          sectionIndex: formValues.sectionIndex,
          imageUrl: formValues.imageUrl,
        },
      });
      history.push("/");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <VStack w="full" alignItems="flex-start">
      <Center w="full" mt={2} pos="relative">
        <IconButton
          as={RouterLink}
          to="/"
          pos="absolute"
          left={1}
          aria-label="Go Back"
          variant="ghost"
          icon={<ChevronLeft size={32} />}
        />
        <Heading as="h3" size="lg" textAlign="center">
          Create New Link
        </Heading>
      </Center>
      <VStack w="full" h="full" px={10} pb={10} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <InputGroup>
            <Input
              autoFocus
              value={formValues.linkName}
              onChange={handleNameChange}
              placeholder="Name Goes Here"
              maxLength={32}
              isInvalid={!!formValues.linkNameError}
            />
            <InputRightElement>
              <Text fontSize={12}>{formValues.linkName.length + "/32"}</Text>
            </InputRightElement>
          </InputGroup>
          <FormHelperText>{formValues.linkNameError}</FormHelperText>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Url</FormLabel>
          <Input
            value={formValues.linkUrl}
            onChange={handleLinkUrlChange}
            placeholder="Url Goes Here"
            maxLength={2048}
            isInvalid={!!formValues.linkUrlError}
          />
          <FormHelperText>{formValues.linkUrlError}</FormHelperText>
        </FormControl>
        <FormControl>
          <FormLabel>Image Url</FormLabel>
          <Input
            value={formValues.imageUrl}
            onChange={handleImageUrlChange}
            placeholder="Image Url"
            isInvalid={!!formValues.imageUrlError}
            maxLength={2048}
          />
          <FormHelperText>Optional image url for the link</FormHelperText>
          <FormHelperText>{formValues.imageUrlError}</FormHelperText>
        </FormControl>
        <Button
          type="submit"
          disabled={
            !formValues.linkName ||
            !formValues.linkUrl ||
            !!formValues.linkNameError ||
            !!formValues.linkUrlError ||
            !!formValues.imageUrlError
          }
          onClick={handleSubmit}
          w="full"
          m={0}
        >
          Create
        </Button>
      </VStack>
    </VStack>
  );
}
