import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ChatState } from "../context/ChatProvider";
import { Alert, Snackbar, Stack, ThemeProvider, createTheme } from "@mui/material";
import SideDrawer from "./SideDrawer";
import MyChats from "./MyChats";
import ChatBox from "./ChatBox";

const Chat = () => {
  const theme = createTheme({
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
    },
  });
  const history = useHistory();
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("info");
  const [snack, openSnack] = useState(false);
  const handleClose = () => {
    setAlert("");
    setSeverity("info");
    openSnack(false);
  };

  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  useEffect(() => {
    if (!user) {
      setAlert("You need to login first");
      setSeverity("warning");
      openSnack(true);
      history.push("/");
    }
    //eslint-disable-next-line
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Stack width="100%">
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snack}
          autoHideDuration={3000}
          onClose={handleClose}
        >
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {alert}
          </Alert>
        </Snackbar>
        {user && <SideDrawer />}
        <Stack
          direction="row"
          justifyContent="center"
          padding={1}
          height="88vh"
          spacing={{ xs: 0, sm: 0, md: 2 }}
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Chat;
