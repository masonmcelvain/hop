import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { LINK_NAME_MAX_LENGTH } from "@config/constants";
import { LinkAction, LinksContext } from "@contexts/Links";
import { getCurrentTab } from "@lib/webextension";
import { LinkData } from "@models/link-state";

function getFormValuesForLink(link: LinkData | null): FormFields {
  return {
    name: link?.name || "",
    nameError: "",
    url: link?.url || "",
    urlError: "",
    imageUrl: link?.imageUrl || "",
    imageUrlError: "",
  };
}

type FormFields = {
  name: string;
  nameError: string;
  url: string;
  urlError: string;
  imageUrl: string;
  imageUrlError: string;
};

type LinkEditModalProps = {
  link: LinkData | null;
  isOpen: boolean;
  onClose: () => void;
};
export default function LinkEditModal({
  link,
  isOpen,
  onClose,
}: LinkEditModalProps): JSX.Element {
  const { dispatch } = React.useContext(LinksContext);
  const [formValues, setFormValues] = React.useState<FormFields>(
    getFormValuesForLink(link)
  );

  const populateFormWithTab = React.useCallback(async () => {
    const tab = await getCurrentTab();
    setFormValues({
      name: tab.title?.slice(0, LINK_NAME_MAX_LENGTH) ?? "",
      nameError: "",
      url: tab?.url ?? "",
      urlError: "",
      imageUrl: tab?.favIconUrl ?? "",
      imageUrlError: "",
    });
  }, [setFormValues]);

  React.useEffect(() => {
    if (link) {
      setFormValues(getFormValuesForLink(link));
    } else if (isOpen) {
      populateFormWithTab();
    }
  }, [isOpen, link, populateFormWithTab]);

  const handleNameChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      event.preventDefault();
      const name = event.target.value ? event.target.value : "";
      const nameError = name ? "" : "Please enter a name for the link";
      setFormValues({ ...formValues, name, nameError });
    },
    [formValues, setFormValues]
  );

  const handleLinkUrlChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      event.preventDefault();
      const url = event.target.value ? event.target.value : "";
      const urlError = url ? "" : "Please enter a URL for the link";
      setFormValues({ ...formValues, url, urlError });
    },
    [formValues, setFormValues]
  );

  const handleImageUrlChange = React.useCallback<
    React.ChangeEventHandler<HTMLInputElement>
  >(
    (event) => {
      event.preventDefault();
      const urlValue = event.target.value ? event.target.value : "";
      let imageUrlError = "";
      try {
        urlValue && new URL(urlValue);
      } catch (e) {
        if (!(e instanceof TypeError)) {
          throw e;
        }
        imageUrlError = "Please enter a valid image URL";
      }
      setFormValues({
        ...formValues,
        imageUrl: urlValue,
        imageUrlError,
      });
    },
    [formValues, setFormValues]
  );

  const handleSubmit = React.useCallback<React.FormEventHandler>(
    (event) => {
      event.preventDefault();
      const payload = {
        name: formValues.name,
        url: formValues.url,
        imageUrl: formValues.imageUrl,
      };
      link
        ? dispatch({
            type: LinkAction.UPDATE_LINK,
            payload: {
              id: link.id,
              ...payload,
            },
          })
        : dispatch({
            type: LinkAction.ADD_LINK,
            payload,
          });
      onClose();
    },
    [dispatch, formValues, link, onClose]
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <form>
        <ModalContent borderRadius="none">
          <ModalHeader>Update Link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack w="full" h="full" spacing={2}>
              <FormControl isRequired>
                <FormLabel>Name</FormLabel>
                <InputGroup>
                  <Input
                    autoFocus
                    value={formValues.name}
                    onChange={handleNameChange}
                    placeholder="Name"
                    maxLength={LINK_NAME_MAX_LENGTH}
                    isInvalid={!!formValues.nameError}
                  />
                  <InputRightElement>
                    <Text fontSize={12}>
                      {formValues.name.length + `/${LINK_NAME_MAX_LENGTH}`}
                    </Text>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText>{formValues.nameError}</FormHelperText>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Link URL</FormLabel>
                <Input
                  value={formValues.url}
                  onChange={handleLinkUrlChange}
                  placeholder="Link URL"
                  maxLength={2048}
                  isInvalid={!!formValues.urlError}
                />
                <FormHelperText>{formValues.urlError}</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  value={formValues.imageUrl}
                  onChange={handleImageUrlChange}
                  placeholder="Image URL"
                  isInvalid={!!formValues.imageUrlError}
                  maxLength={2048}
                />
                <FormHelperText>{formValues.imageUrlError}</FormHelperText>
              </FormControl>
            </VStack>
            <ModalFooter>
              <Button
                type="submit"
                disabled={
                  !formValues.name ||
                  !formValues.url ||
                  !!formValues.nameError ||
                  !!formValues.urlError ||
                  !!formValues.imageUrlError
                }
                onClick={handleSubmit}
                w="full"
                m={0}
              >
                {link ? "Update" : "Create"}
              </Button>
            </ModalFooter>
          </ModalBody>
        </ModalContent>
      </form>
    </Modal>
  );
}
