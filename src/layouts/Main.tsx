import * as React from "react";
import { Routes, Route } from "react-router-dom";
import Notes from "./Notes";

export default function Main() {
  return (
    <Routes>
      <Route path="/" element={<Notes />} />
    </Routes>
  );
}
