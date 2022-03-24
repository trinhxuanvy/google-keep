import React, { useContext } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { collection, getDocs } from "@firebase/firestore";
import { useSetRecoilState } from "recoil";
import { INoteData } from "../interfaces/interface";
import { noteListState } from "../recoil/noteList";
import { auth, signInWithGoogle, firestore } from "../services/firebase";

export const AuthContext = React.createContext<any>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export function AuthProvider(props: any) {
  const [currentUser, setCurrentUser] = React.useState(null);
  const setNoteList = useSetRecoilState(noteListState);

  const signOutAccount = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
      })
      .catch((err: Error) => {
        console.log(err);
      });
  };

  onAuthStateChanged(auth, (user: any) => {
    if (user) {
      setCurrentUser(user);
      getDocs(collection(firestore, "Notes"))
        .then((snapshot: any) => {
          let noteList: Array<INoteData> = [];
          snapshot.docs?.forEach((doc) => {
            if (doc.data()?.owner === user?.email) {
              noteList.push(doc.data());
            }
          });

          setNoteList(noteList);
        })
        .catch((err: Error) => {
          console.log(err);
        });
    } else {
      signInWithGoogle();
    }
  });

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser,
        signOutAccount: signOutAccount,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
