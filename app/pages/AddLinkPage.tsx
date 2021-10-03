import * as React from "react";
import { Link as RouterLink, useHistory } from "react-router-dom";
import * as psl from "psl";
import {
  Button,
  Center,
  Heading,
  Input,
  InputRightElement,
  InputGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  Text,
  HStack,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { ChevronLeft } from "react-feather";
import { getCurrentTabUrl } from "../lib/chrome/Tab";
import { LinksContext } from "../contexts/Links";
import { LinkAction } from "../contexts/Links/reducer";
import themes from "../../themes/themes";

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

  const textColor = useColorModeValue(
    themes.light.colors.textColor,
    themes.dark.colors.textColor
  );
  const inputRightTextColor = useColorModeValue("black", "white");
  const iconHoverOverlay = useColorModeValue(
    themes.light.colors.overlay_15,
    themes.dark.colors.overlay_15
  );
  const iconActiveOverlay = useColorModeValue(
    themes.light.colors.overlay_25,
    themes.dark.colors.overlay_25
  );

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

  function onSubmit(event) {
    event.preventDefault();
    if (!formValues.linkName || !formValues.linkUrl) {
      return;
    }
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
      <HStack w="full" p={2} pos="relative" alignItems="center">
        <Center
          pos="absolute"
          left={0}
          w={10}
          h={10}
          m={2}
          borderRadius={8}
          cursor="pointer"
          transition="all 0.2s"
          _hover={{ bg: iconHoverOverlay }}
          _active={{ bg: iconActiveOverlay }}
        >
          <RouterLink to="/">
            <ChevronLeft color={textColor} size={34} />
          </RouterLink>
        </Center>
        <Heading as="h3" size="lg" w="full" textAlign="center">
          Create New Link
        </Heading>
      </HStack>
      <VStack w="full" h="full" px={10} pb={10} spacing={4}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <InputGroup>
            <Input
              autoFocus
              value={formValues.linkName}
              onChange={handleNameChange}
              placeholder="Name Goes Here"
              maxLength={48}
              isInvalid={!!formValues.linkNameError}
            />
            <InputRightElement>
              <Text fontSize={12} color={inputRightTextColor}>
                {formValues.linkName.length + "/48"}
              </Text>
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
          <FormHelperText>Optional image url for your link.</FormHelperText>
          <FormHelperText>{formValues.imageUrlError}</FormHelperText>
        </FormControl>
        <Button
          type="submit"
          disabled={
            !!formValues.linkNameError ||
            !!formValues.linkUrlError ||
            !!formValues.imageUrlError
          }
          onSubmit={onSubmit}
          w="full"
          m={0}
        >
          Create
        </Button>
      </VStack>
    </VStack>
  );
}
