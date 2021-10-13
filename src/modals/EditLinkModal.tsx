import * as React from "react";
import * as psl from "psl";
import {
  Button,
  Input,
  InputRightElement,
  InputGroup,
  FormControl,
  FormLabel,
  FormHelperText,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { LinksContext } from "../contexts/Links";
import { LinkAction, LinkData } from "../contexts/Links/reducer";

function getFormValuesForLink(link: null | LinkData): FormFields {
  return {
    linkName: link?.name || "",
    linkNameError: "",
    linkUrl: link?.url || "",
    linkUrlError: "",
    imageUrl: link?.imageUrl || "",
    imageUrlError: "",
  };
}

type FormFields = {
  linkName: string;
  linkNameError: string;
  linkUrl: string;
  linkUrlError: string;
  imageUrl: string;
  imageUrlError: string;
};

type EditLinkModalProps = {
  link: LinkData;
  isOpen: boolean;
  onClose: () => void;
};
export default function EditLinkModal({
  link,
  isOpen,
  onClose,
}: EditLinkModalProps): JSX.Element {
  const { dispatch } = React.useContext(LinksContext);
  const [formValues, setFormValues] = React.useState<FormFields>(
    getFormValuesForLink(link)
  );

  React.useEffect(() => {
    setFormValues(getFormValuesForLink(link));
  }, [link]);

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
        type: LinkAction.UPDATE_LINK,
        payload: {
          id: link.id,
          name: formValues.linkName,
          url: url.toString(),
          imageUrl: formValues.imageUrl,
        },
      });
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Update Link</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack w="full" h="full" spacing={2}>
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
                  <Text fontSize={12}>
                    {formValues.linkName.length + "/32"}
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
              <FormHelperText>Optional image url for the link</FormHelperText>
              <FormHelperText>{formValues.imageUrlError}</FormHelperText>
            </FormControl>
          </VStack>
          <ModalFooter>
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
              Update
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
