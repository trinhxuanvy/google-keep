import * as React from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Icon,
  IconButton,
  Tooltip,
  Button,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { useRecoilState, useRecoilValue } from "recoil";
import { collection, addDoc, doc, setDoc } from "@firebase/firestore";
import {
  addNote,
  filterNoteListState,
  noteListState,
} from "../../recoil/noteList";
import { storage, firestore } from "../../services/firebase";
import { LIST_NOTE_SYMBOL } from "../../constants/variable";
import { INoteData } from "../../interfaces/interface";
import "./TakeNote.scss";
import { useAuth } from "../../contexts/AuthContext";

const dataSpace: INoteData = {
  id: "",
  image: "",
  title: "",
  note: "",
  owner: "",
};

export default function TakeNote() {
  const { currentUser } = useAuth();
  const [noteList, setNoteList] = useRecoilState(noteListState);
  const [takeNote, setTakeNote] = React.useState("");
  const [dataStore, setDataStore] = React.useState(dataSpace);
  const [process, setProcess] = React.useState(100);
  const [imageTemp, setImageTemp] = React.useState("");
  const [ratioImage, setRatioImage] = React.useState(0);
  const [alert, setShowAlert] = React.useState(false);
  const filterNoteList = useRecoilValue(filterNoteListState);
  const refTakeNote = React.useRef(null);
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
        setTakeNote("image");
      },
      (err: Error) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url: string) => {
          setDataStore({ ...dataStore, image: url });
        });
      }
    );
  };

  const handleDeleteImage = (imageUrl: string) => {
    const storageRef = ref(storage, imageUrl);
    deleteObject(storageRef)
      .then(() => {
        setDataStore({ ...dataStore, image: "" });
        setShowAlert(true);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  const handleOpenTakeNote = (type: string) => {
    return (event: any) => {
      switch (type) {
        case "normal":
          setTakeNote("normal");
          break;
        case "list":
          console.log("list");
          break;
        case "paint":
          console.log("paint");
          break;
        case "image":
          const ref: any = refChooseImage.current;
          ref.click();
          break;
        default:
          break;
      }
    };
  };

  const handleHideTakeNote = () => {
    handleAddNote();
    setTakeNote("");
    setDataStore(dataSpace);
  };

  const handleClickOutside = (event: any) => {
    if (refTakeNote && refTakeNote.current) {
      const ref: any = refTakeNote.current;
      if (!ref.contains(event.target)) {
        handleHideTakeNote();
      }
    }
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

  const handleAddNote = () => {
    if (
      Object.entries(dataStore).toString() !==
      Object.entries(dataSpace).toString()
    ) {
      const newNote: INoteData = {
        ...dataStore,
        id: uuidv4(),
        owner: currentUser?.email,
      };

      setDoc(doc(firestore, "Notes", newNote.id), newNote)
        .then(() => {
          const newNoteList: Array<INoteData> = addNote(noteList, newNote);

          setNoteList(newNoteList);
        })
        .catch((err: Error) => {
          console.log(err);
        });
    }
  };

  const handleChangeImage = (event: any) => {
    if (dataStore.image) {
      setDataStore({ ...dataStore, image: "" });
    }

    const imageUrl = URL.createObjectURL(event.target.files[0]);
    const image = new Image();

    setImageTemp(imageUrl);
    image.src = imageUrl;
    image.onload = (event: any) => {
      setRatioImage(event?.path[0].height / event?.path[0].width);
    };
    handleUploadImage(event.target.files[0]);
  };

  const handlehandleDeleteImage = (image: string) => {
    return () => {
      if (image) {
        handleDeleteImage(image);
      }
    };
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  });

  React.useEffect(() => {});

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleCloseAlert}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseAlert}
      >
        <Icon fontSize="small">close</Icon>
      </IconButton>
    </React.Fragment>
  );

  return (
    <div style={{ margin: "8px 0" }}>
      {!filterNoteList && (
        <div>
          {takeNote.length === 0 && (
            <section className="take-note">
              <div
                className="take-note__title"
                onClick={handleOpenTakeNote("normal")}
              >
                <div className="take-note__title__head">Take a note...</div>
              </div>
              <div className="take-note__item">
                <IconButton
                  size="large"
                  sx={{ mr: 0.5 }}
                  onClick={handleOpenTakeNote("list")}
                >
                  <Icon>check_box</Icon>
                </IconButton>
                <IconButton
                  size="large"
                  sx={{ mr: 0.5 }}
                  onClick={handleOpenTakeNote("paint")}
                >
                  <Icon>edit</Icon>
                </IconButton>
                <IconButton
                  size="large"
                  sx={{ mr: 0.5 }}
                  onClick={handleOpenTakeNote("image")}
                >
                  <Icon>image</Icon>
                  <input
                    type="file"
                    accept=".png, .jpg, .jpeg"
                    style={{ display: "none" }}
                    ref={refChooseImage}
                    onChange={handleChangeImage}
                  />
                </IconButton>
              </div>
            </section>
          )}

          {takeNote.length !== 0 && (
            <section
              className="take-note"
              ref={refTakeNote}
              style={{ height: "100%" }}
            >
              <div
                className="take-note__title"
                style={{
                  flexDirection: "column",
                  overflowY: ratioImage >= 0.9 ? "scroll" : "initial",
                }}
              >
                {takeNote === "image" && (
                  <div className="take-note__title__image">
                    <img
                      src={imageTemp}
                      alt=""
                      style={{
                        opacity: process === 100 && dataStore.image ? 1 : 0.5,
                      }}
                    />
                    {(process !== 100 || !dataStore.image) && (
                        <LinearProgress variant="determinate" value={process} />
                      ) && (
                        <LinearProgress variant="determinate" value={process} />
                      )}
                    <div className="take-note__title__image__button">
                      <Tooltip title="Delete">
                        <IconButton
                          disableRipple
                          size="medium"
                          onClick={handlehandleDeleteImage(dataStore.image)}
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
              <div className="take-note__button-item">
                <div>
                  {LIST_NOTE_SYMBOL.map((item, index) => (
                    <Tooltip title={item.name} key={index}>
                      <IconButton
                        size="medium"
                        sx={{ mr: 2 }}
                        onClick={handleOpenTakeNote("list")}
                      >
                        <Icon sx={{ fontSize: "18px" }}>{item.icon}</Icon>
                      </IconButton>
                    </Tooltip>
                  ))}
                </div>
                <Button
                  sx={{ textTransform: "none", px: 4, color: "#212121" }}
                  onClick={handleHideTakeNote}
                >
                  Close
                </Button>
              </div>
            </section>
          )}
        </div>
      )}

      <Snackbar
        open={alert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        message="Note archived"
        action={action}
      />
    </div>
  );
}
