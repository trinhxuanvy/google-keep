import * as React from "react";
import {
  Icon,
  IconButton,
  Tooltip,
  Button,
  LinearProgress,
  DialogContentText,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
  DialogProps,
  Paper,
  styled,
} from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import "../TakeNote/TakeNote.scss";
import { LIST_NOTE_SYMBOL } from "../../constants/variable";
import { INoteData } from "../../interfaces/interface";
import { storage } from "../../services/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import SymbolNote from "../SymbolNote/SymbolNote";

const dataItem: INoteData = {
  image: "",
  note: "",
  title: "",
  id: "",
  owner: ""
};

const DialogNoteCus = styled(Dialog)(({ theme }) => ({
  ...theme.typography.body2,
  "& .MuiPaper-root": {
    width: "100%",
  },
}));

export default function TakeNote(props: any) {
  const { openDialogNote } = props;
  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [dataStore, setDataStore] = React.useState(dataItem);
  const [imageTemp, setImageTemp] = React.useState("");
  const [process, setProcess] = React.useState(100);
  const ratioImage = 0;

  const handleClickOpen = (scrollType: DialogProps["scroll"]) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickSymBol = () => {};

  const handleDeleteImage = (imageUrl: any) => {
    return () => {
      if (imageUrl) {
      }
    };
  };

  const handleChangeDataStore = (type: string) => {
    return (event: any) => {
      switch (type) {
        case "title":
          setDataStore({ ...dataStore, title: event.target.value });
          break;
        case "note":
          setDataStore({ ...dataStore, note: event.target.value });
          break;
        default:
          break;
      }
    };
  };

  return (
    <DialogNoteCus
      open={openDialogNote}
      onClose={handleClose}
      scroll={scroll}
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
    >
      <DialogContent dividers={scroll === "paper"}>
        <div
          className="take-note__title"
          style={{
            flexDirection: "column",
            overflowY: ratioImage >= 0.9 ? "scroll" : "initial",
          }}
        >
          <div className="take-note__title__image">
            <img
              src={imageTemp}
              alt=""
              style={{
                opacity: process === 100 ? 1 : 0.5,
              }}
            />
            {process !== 100 && !alert && (
              <LinearProgress variant="determinate" value={process} />
            )}
            <div className="take-note__title__image__button">
              <Tooltip title="Delete">
                <IconButton
                  disableRipple
                  size="medium"
                  onClick={handleDeleteImage(dataStore.image)}
                >
                  <Icon sx={{ fontSize: "18px", color: "#ffffff" }}>
                    delete
                  </Icon>
                </IconButton>
              </Tooltip>
            </div>
          </div>
          <input
            placeholder="Title"
            className="take-note__title__head"
            type="text"
            value={dataStore.title}
            onChange={handleChangeDataStore("title")}
          />
          <input
            placeholder="Take a note..."
            className="take-note__title__content"
            type="text"
            value={dataStore.note}
            onChange={handleChangeDataStore("note")}
          />
        </div>
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "space-between", alignItems: "normal" }}
      >
        <SymbolNote
          dataItem={dataItem}
          onClickSymbol={handleClickSymBol}
          listNoteSymbol={LIST_NOTE_SYMBOL}
        ></SymbolNote>
        <Button
          onClick={handleClose}
          sx={{ textTransform: "none", color: "#333333" }}
          style={{ color: "#333333 !important" }}
        >
          Close
        </Button>
      </DialogActions>
    </DialogNoteCus>
  );
}
