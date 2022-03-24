import Drawer from "./layouts/Drawer";
import { useAuth } from "./contexts/AuthContext";
import { Box, LinearProgress } from "@mui/material";

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      {currentUser && <Drawer />}
      {!currentUser && (
        <Box sx={{ width: "100%", position: "fixed", top: 0, left: 0 }}>
          <LinearProgress />
        </Box>
      )}
    </div>
  );
}

export default App;
