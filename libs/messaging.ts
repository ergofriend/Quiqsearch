import { defineExtensionMessaging } from "@webext-core/messaging";

type SearchMessaging = {
  searchOnTab: (data: { url: string }) => void;
};
export const searchMessaging = defineExtensionMessaging<SearchMessaging>();
