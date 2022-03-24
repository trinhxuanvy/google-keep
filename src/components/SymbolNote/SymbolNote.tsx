import * as React from "react";
import { Fade, Icon, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { deleteDoc, doc } from "@firebase/firestore";
import { INoteSymbol } from "../../interfaces/interface";
import "./SymbolNote.scss";
import { useRecoilState } from "recoil";
import { deleteNote, noteListState } from "../../recoil/noteList";
import { firestore } from "../../services/firebase";

export default function SymbolNote(props: any) {
  const { dataItem, listNoteSymbol, onClickSymbol, deletedNote } = props;
  const [noteList, setNoteList] = useRecoilState(noteListState);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (type: string = "", id: string = "") => {
    return () => {
      setAnchorEl(null);
      switch (type) {
        case "delete":
          deletedNote();
          deleteDoc(doc(firestore, "Notes", id))
            .then(() => {
              const newNoteList = deleteNote(noteList, id);

              setNoteList(newNoteList);
            })
            .catch((err: Error) => {
              console.log(err);
            });

          break;

        default:
          break;
      }
    };
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClose(), true);

    return () => {
      document.removeEventListener("click", handleClose(), true);
    };
  });

  return (
    <div className="note">
      <div className="note__button-item">
        {listNoteSymbol.map((item: INoteSymbol, index: number) => (
          <Tooltip title={item.name} key={index}>
            <IconButton
              size="medium"
              sx={{ mr: 2 }}
              onClick={() => onClickSymbol(item.type, dataItem.id)}
            >
              <Icon sx={{ fontSize: "18px" }}>{item.icon}</Icon>
            </IconButton>
          </Tooltip>
        ))}
        <div>
          <Tooltip title="More">
            <IconButton size="medium" sx={{ mr: 0 }} onClick={handleClick}>
              <Icon sx={{ fontSize: "18px" }}>more_vert</Icon>
            </IconButton>
          </Tooltip>
          <Menu
            id="fade-menu"
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            anchorEl={anchorEl}
            open={open}
            TransitionComponent={Fade}
          >
            <MenuItem
              onClick={handleClose("delete", dataItem.id)}
              sx={{ fontSize: "14px" }}
            >
              Delete note
            </MenuItem>
          </Menu>
        </div>
      </div>
      {props.children}
    </div>
  );
}
