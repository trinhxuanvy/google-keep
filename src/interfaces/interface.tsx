import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

interface IMenu {
  name: string;
  path: string;
  icon: string;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

interface ITakeNote {
  open?: boolean;
  updateOpen?: () => void;
}

interface INoteSymbol {
  name: string;
  icon: string;
  type: string;
}

interface INoteData {
  id: string;
  title: string;
  note: string;
  image: string;
  owner: string;
}

interface IAction {
  type: string;
  payload: any;
}

export type { IMenu, AppBarProps, ITakeNote, INoteSymbol, INoteData, IAction };
