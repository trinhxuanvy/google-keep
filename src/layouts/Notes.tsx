import * as React from "react";
import Masonry from "../components/Masonry/Masonry";
import TakeNote from "../components/TakeNote/TakeNote";

export default function Main() {
  return (
    <div className="main">
      <TakeNote></TakeNote>
      <Masonry></Masonry>
    </div>
  );
}
