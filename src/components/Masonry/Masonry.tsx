import * as React from "react";
import Masonry from "@mui/lab/Masonry";
import Note from "../Note/Note";
import { INoteData } from "../../interfaces/interface";
import { LIST_NOTE_SYMBOL } from "../../constants/variable";
import {
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  Icon,
  LinearProgress,
  styled,
  DialogProps,
  Box,
} from "@mui/material";
import SymbolNote from "../SymbolNote/SymbolNote";
import { firestore, storage } from "../../services/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  filteredNoteListState,
  filterNoteListState,
  noteListState,
  updateNote,
} from "../../recoil/noteList";
import { doc, updateDoc } from "@firebase/firestore";

const dataSpace: INoteData = {
  image: "",
  note: "",
  title: "",
  id: "",
  owner: "",
};

const DialogNoteCus = styled(Dialog)(({ theme }) => ({
  ...theme.typography.body2,
  "& .MuiPaper-root": {
    width: "100%",
    borderRadius: 10,
  },
  "& .MuiDialogContent-root": {
    padding: "0",
  },
}));

export default function BasicMasonry() {
  const [noteList, setNoteList] = useRecoilState(noteListState);
  const filteredNoteList = useRecoilValue(filteredNoteListState);
  const filterNoteList = useRecoilValue(filterNoteListState);
  const [openDialogNote, setOpenDialogNote] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps["scroll"]>("paper");
  const [dataStore, setDataStore] = React.useState(dataSpace);
  const [imageTemp, setImageTemp] = React.useState<any>("");
  const [process, setProcess] = React.useState(100);
  const refChooseImage = React.useRef(null);

  const handleUploadImage = (image: File) => {
    if (!image) return;

    const storageRef = ref(
      storage,
      `/images/${Date.now()}-gg-keep-${image.type}-${image.size}`
    );
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot: any) => {
        const prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProcess(prog);
      },
      (err: Error) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
          setDataStore({ ...dataStore, image: url });
        });
      }
    );
  };

  const handleChangeImage = (event: any) => {
    if (event.target.files?.length) {
      const imageUrl = URL.createObjectURL(event.target.files[0]);
      const image = new Image();

      image.src = imageUrl;
      setImageTemp(imageUrl);
      handleUploadImage(event.target.files[0]);
    }
  };

  const handleClickSymBol = (type: string, id: string) => {
    switch (type) {
      case "image":
        const image: any = refChooseImage.current;
        image.click();
        break;

      default:
        break;
    }
  };

  const handleClickNote = (id: string) => {
    return () => {
      const note = noteList.filter((item) => item.id === id)[0];

      setDataStore(note);
      setImageTemp(note.image);
      setOpenDialogNote(true);
    };
  };

  const handleCloseDialogNote = () => {
    updateDoc(doc(firestore, "Notes", dataStore.id), { ...dataStore })
      .then(() => {
        const newNoteList = updateNote(noteList, dataStore);

        setNoteList(newNoteList);
        setDataStore(dataSpace);
      })
      .catch((err: Error) => {
        console.log(err);
      });
    setOpenDialogNote(false);
  };

  const handleCloseDialogNoteDeleted = () => {
    setOpenDialogNote(false);
  };

  const handleDeleteImage = (note: INoteData) => {
    return () => {
      if (note) {
        const newNote: INoteData = { ...note, image: "" };

        updateDoc(doc(firestore, "Notes", newNote.id), { ...newNote })
          .then(() => {
            const newNoteList = updateNote(noteList, newNote);

            setDataStore(newNote);
            setNoteList(newNoteList);
          })
          .catch((err: Error) => {
            console.log(err);
          });
        setImageTemp("");
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
    <div>
      <Box
        sx={{
          my: 4,
          mx: "auto",
          width: "100%",
          minHeight: 393,
          maxWidth: "calc(100% - 8%)",
        }}
      >
        {!filteredNoteList.length && filterNoteList && (
          <p
            style={{
              display: "block",
              margin: "16px auto",
              textAlign: "center",
              fontSize: 14,
            }}
          >
            No matching results.
          </p>
        )}
        <Masonry columns={4} spacing={2.5}>
          {filteredNoteList?.map((item: INoteData, index: number) => (
            <Note
              key={index}
              dataItem={item}
              listNoteSymbol={LIST_NOTE_SYMBOL}
              onClickSymbol={handleClickSymBol}
              onClickNote={handleClickNote(item.id)}
            >
              <input
                type="file"
                accept=".png, .jpg, .jpeg"
                style={{ display: "none" }}
                ref={refChooseImage}
                onChange={handleChangeImage}
              />
            </Note>
          ))}
        </Masonry>
      </Box>
      <DialogNoteCus
        open={openDialogNote}
        onClose={handleCloseDialogNote}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogContent dividers={scroll === "paper"}>
          <div
            className="take-note__title"
            style={{
              flexDirection: "column",
            }}
          >
            {imageTemp && (
              <div className="take-note__title__image">
                <img
                  src={imageTemp}
                  alt=""
                  style={{
                    opacity: process === 100 && imageTemp ? 1 : 0.5,
                  }}
                />
                {(process !== 100 || !imageTemp) && (
                  <LinearProgress variant="determinate" value={process} />
                )}
                <div className="take-note__title__image__button">
                  <Tooltip title="Delete">
                    <IconButton
                      disableRipple
                      size="medium"
                      onClick={handleDeleteImage(dataStore)}
                    >
                      <Icon sx={{ fontSize: "18px", color: "#ffffff" }}>
                        delete
                      </Icon>
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            )}

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
            dataItem={dataStore}
            onClickSymbol={handleClickSymBol}
            listNoteSymbol={LIST_NOTE_SYMBOL}
            deletedNote={handleCloseDialogNoteDeleted}
          >
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              style={{ display: "none" }}
              ref={refChooseImage}
              onChange={handleChangeImage}
            />
          </SymbolNote>
          <Button
            onClick={handleCloseDialogNote}
            sx={{ textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </DialogNoteCus>
    </div>
  );
}
