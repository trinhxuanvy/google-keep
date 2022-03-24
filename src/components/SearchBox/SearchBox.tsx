import * as React from "react";
import { styled } from "@mui/material/styles";
import { InputBase, Tooltip, Icon, IconButton } from "@mui/material";
import { useRecoilState } from "recoil";
import { filterNoteListState } from "../../recoil/noteList";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 10,
  padding: "4px 8px",
  backgroundColor: "#f1f3f4",
  marginRight: 72,
  marginLeft: 72,
  width: "100%",
  display: "flex",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: "16px",
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function SearchBox() {
  const [activeInput, setActiveInput] = React.useState(false);
  const [filter, setFilter] = useRecoilState(filterNoteListState);
  const refInputSearch = React.useRef("");

  const handleActiveInput = () => {
    setActiveInput(true);
  };

  const handleUnActiveInput = () => {
    setActiveInput(false);
  };

  const handleClearInputSearch = () => {
    const ref: any = refInputSearch.current;
    ref.value = "";
    setFilter("");
  };

  const handleFilter = (e: any) => {
    if (e.key === "Enter") {
      const ref: any = refInputSearch.current;
      setFilter(ref.value);
    }
  };

  React.useEffect(() => {
    document.addEventListener("click", handleUnActiveInput, true);
    return () => {
      document.removeEventListener("click", handleUnActiveInput, true);
    };
  }, [activeInput]);

  return (
    <Search
      onClick={handleActiveInput}
      sx={
        activeInput && {
          boxShadow:
            "0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%)",
          backgroundColor: " #ffffff",
        }
      }
    >
      <Tooltip title="Search">
        <IconButton>
          <Icon>search</Icon>
        </IconButton>
      </Tooltip>
      <StyledInputBase
        placeholder="Search"
        inputProps={{ "aria-label": "search" }}
        inputRef={refInputSearch}
        onKeyUp={handleFilter}
      />
      <Tooltip title="Clear search">
        <IconButton onClick={handleClearInputSearch}>
          <Icon>close</Icon>
        </IconButton>
      </Tooltip>
    </Search>
  );
}
