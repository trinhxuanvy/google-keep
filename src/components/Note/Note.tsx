import * as React from "react";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Fade, Icon, IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import { useRecoilState } from "recoil";
import { doc, deleteDoc } from "@firebase/firestore";
import { INoteSymbol } from "../../interfaces/interface";
import { deleteNote, noteListState } from "../../recoil/noteList";
import "./Note.scss";
import { firestore } from "../../services/firebase";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  width: "100%",
  maxWidth: "230px",
  boxShadow: "none",
  borderRadius: "10px",
  border: "1px solid #e0e0e0",
  color: theme.palette.text.secondary,
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  "&:hover": {
    boxShadow:
      "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
    ".note__button-item": {
      opacity: "1",
    },
  },
  "& .note__button-item": {
    opacity: "0",
    transition: "0.5s",
  },
}));

export default function Note(props: any) {
  const { dataItem, listNoteSymbol, onClickSymbol, onClickNote } = props;
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
    <Item>
      <div className="note">
        <div
          className="note__title"
          onClick={() => onClickNote(dataItem.id)}
        >
          {dataItem.image && (
            <div
              className="note__title__image"
              style={{
                borderRadius: !(dataItem.note || dataItem.title)
                  ? "10px"
                  : "10px 10px 0 0",
              }}
            >
              <img src={dataItem.image} />
            </div>
          )}
          {dataItem.title && (
            <div className="note__title__header">{dataItem.title}</div>
          )}
          {dataItem.note && (
            <div className="note__title__content">{dataItem.note}</div>
          )}
          {(dataItem.title || dataItem.note) && (
            <div style={{ width: "100%", height: "48px" }}></div>
          )}
        </div>
        <div className="note__button-item">
          {listNoteSymbol.map((item: INoteSymbol, index: number) => (
            <Tooltip title={item.name} key={index}>
              <IconButton
                size="medium"
                sx={{ mr: 0 }}
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
    </Item>
  );
}
