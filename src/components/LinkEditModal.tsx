import * as React from "react";
import { LINK_NAME_MAX_LENGTH } from "@config/constants";
import { useLinkStore } from "@hooks/useLinkStore";
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
}: LinkEditModalProps) {
   const [formValues, setFormValues] = React.useState<FormFields>(
      getFormValuesForLink(link),
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
   // Close modal on Escape key
   React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
         if (isOpen && e.key === "Escape") {
            e.preventDefault();
            onClose();
         }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
         document.removeEventListener("keydown", handleKeyDown);
      };
   }, [isOpen, onClose]);

   const handleNameChange = React.useCallback<
      React.ChangeEventHandler<HTMLInputElement>
   >(
      (event) => {
         event.preventDefault();
         const name = event.target.value ? event.target.value : "";
         const nameError = name ? "" : "Please enter a name for the link";
         setFormValues({ ...formValues, name, nameError });
      },
      [formValues, setFormValues],
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
      [formValues, setFormValues],
   );

   const handleImageUrlChange = React.useCallback<
      React.ChangeEventHandler<HTMLInputElement>
   >(
      (event) => {
         event.preventDefault();
         const urlValue = event.target.value ? event.target.value : "";
         let imageUrlError = "";
         try {
            const _ = urlValue && new URL(urlValue);
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
      [formValues, setFormValues],
   );

   const addLink = useLinkStore((state) => state.addLink);
   const updateLink = useLinkStore((state) => state.updateLink);
   const handleSubmit = React.useCallback<React.FormEventHandler>(
      (event) => {
         event.preventDefault();
         const payload = {
            name: formValues.name,
            url: formValues.url,
            imageUrl: formValues.imageUrl,
         };
         if (link) {
            updateLink({
               id: link.id,
               ...payload,
            });
         } else {
            addLink(payload);
         }
         onClose();
      },
      [addLink, formValues, link, onClose, updateLink],
   );

   if (!isOpen) {
      return null;
   }

   return (
      <div className="fixed inset-0 z-50">
         <div
            className="bg-opacity-60 absolute inset-0 bg-black"
            onClick={onClose}
         />
         <form
            className="relative z-50 flex h-full w-full flex-col bg-white p-6"
            onSubmit={(e) => e.preventDefault()}
         >
            <header className="mb-4 flex items-center justify-between">
               <h2 className="text-xl font-semibold text-gray-800">
                  Update Link
               </h2>
               <button
                  type="button"
                  onClick={onClose}
                  title="Close (esc)"
                  className="p-1 text-gray-500 hover:text-gray-700"
               >
                  <span className="text-2xl">&times;</span>
               </button>
            </header>
            <div className="flex-1 space-y-2 overflow-auto">
               {/* Name field */}
               <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                     Name
                  </label>
                  <div className="relative">
                     <input
                        autoFocus
                        value={formValues.name}
                        onChange={handleNameChange}
                        placeholder="Name"
                        maxLength={LINK_NAME_MAX_LENGTH}
                        className={`block w-full border text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                           formValues.nameError
                              ? "border-red-500"
                              : "border-gray-300"
                        } rounded-md pr-10`}
                     />
                     <span className="absolute inset-y-0 right-2 flex items-center text-xs text-gray-500">
                        {`${formValues.name.length}/${LINK_NAME_MAX_LENGTH}`}
                     </span>
                  </div>
                  {formValues.nameError ? (
                     <p className="text-xs text-red-600">
                        {formValues.nameError}
                     </p>
                  ) : (
                     <p className="text-xs text-transparent">&nbsp;</p>
                  )}
               </div>
               {/* URL field */}
               <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                     Link URL
                  </label>
                  <input
                     value={formValues.url}
                     onChange={handleLinkUrlChange}
                     placeholder="Link URL"
                     maxLength={2048}
                     className={`block w-full border text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        formValues.urlError
                           ? "border-red-500"
                           : "border-gray-300"
                     } rounded-md`}
                  />
                  {formValues.urlError ? (
                     <p className="text-xs text-red-600">
                        {formValues.urlError}
                     </p>
                  ) : (
                     <p className="text-xs text-transparent">&nbsp;</p>
                  )}
               </div>
               {/* Image URL field */}
               <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                     Image URL
                  </label>
                  <input
                     value={formValues.imageUrl}
                     onChange={handleImageUrlChange}
                     placeholder="Image URL"
                     maxLength={2048}
                     className={`block w-full border text-sm shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                        formValues.imageUrlError
                           ? "border-red-500"
                           : "border-gray-300"
                     } rounded-md`}
                  />
                  {formValues.imageUrlError ? (
                     <p className="text-xs text-red-600">
                        {formValues.imageUrlError}
                     </p>
                  ) : (
                     <p className="text-xs text-transparent">&nbsp;</p>
                  )}
               </div>
            </div>
            <div className="pt-4">
               <button
                  type="button"
                  disabled={
                     !formValues.name ||
                     !formValues.url ||
                     !!formValues.nameError ||
                     !!formValues.urlError ||
                     !!formValues.imageUrlError
                  }
                  onClick={handleSubmit}
                  className="w-full rounded-md bg-blue-500 py-2 font-medium text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
               >
                  {link ? "Update" : "Create"}
               </button>
            </div>
         </form>
      </div>
   );
}
