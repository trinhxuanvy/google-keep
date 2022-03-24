import { IMenu, INoteSymbol } from "../interfaces/interface";

const drawerWidth = 280;

const MENU_ITEM: Array<IMenu> = [
  {
    name: "Notes",
    path: "/home",
    icon: "lightbulb_outline",
  },
  {
    name: "Reminders",
    path: "",
    icon: "notifications_none",
  },
  {
    name: "Edit labels",
    path: "a",
    icon: "mode_edit",
  },
  {
    name: "Archive",
    path: "a",
    icon: "archive_none",
  },
  {
    name: "Trash",
    path: "a",
    icon: "delete_outline",
  },
];

const LIST_NOTE_SYMBOL: Array<INoteSymbol> = [
  {
    name: "Remind me",
    icon: "add_alert",
    type: "remind_me",
  },
  {
    name: "Collaborator",
    icon: "person_add_alt",
    type: "collaborator",
  },
  {
    name: "Background options",
    icon: "palette",
    type: "palette",
  },
  {
    name: "Add image",
    icon: "image",
    type: "image",
  },
  {
    name: "Archive",
    icon: "archive",
    type: "archive",
  },
];

export { MENU_ITEM, drawerWidth, LIST_NOTE_SYMBOL };
