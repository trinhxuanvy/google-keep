import { atom, selector } from "recoil";
import { INoteData } from "../interfaces/interface";

export const noteListState = atom({
  key: "noteList",
  default: [],
});

export const filterNoteListState = atom({
  key: "filterNoteList",
  default: "",
});

export const filteredNoteListState = selector({
  key: "filteredNoteList",
  get: ({ get }) => {
    const noteList = get(noteListState);
    const filter = get(filterNoteListState);

    if (filter) {
      return noteList.filter(
        (note) =>
          note.note.toLowerCase().includes(filter.toLowerCase()) ||
          note.title.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return noteList;
  },
});

export const addNote = (noteList: Array<INoteData>, note: INoteData) => {
  const newNoteList: Array<INoteData> = [...noteList];

  newNoteList.push(note);

  return newNoteList;
};

export const deleteNote = (noteList: Array<INoteData>, id: string) => {
  return noteList.filter((note) => note.id !== id);
};

export const updateNote = (noteList: Array<INoteData>, note: INoteData) => {
  const newNoteList: Array<INoteData> = [...noteList];
  const noteIndex: number = noteList.findIndex((item) => item.id === note.id);

  if (noteIndex > -1) {
    newNoteList[noteIndex] = note;
  }

  return newNoteList;
};
