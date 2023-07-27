import { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import { Button, Stack, Typography, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { getSender } from "../config/ChatLogics";
import CreateGroup from "./CreateGroup";
import ChatLoading from "../loader/ChatLoading";

const MyChats = ({ fetchAgain }) => {
  axios.defaults.baseURL = "https://chatsappserver.onrender.com";
  const [loggedUser, setLoggedUser] = useState();
  const [loading, setLoading] = useState(false);
  const {
    user,
    selectedChat,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const fetchChats = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/chat", {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setLoading(false);
      setChats(data);
    } catch (error) {
      setSeverity("error");
      setAlert("Failed to load chats!");
      openSnack(true);
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("User")));
    fetchChats();
    //eslint-disable-next-line
  }, [fetchAgain]);

  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("info");
  const [snack, openSnack] = useState(false);
  const handleClose = () => {
    setAlert("");
    setSeverity("info");
    openSnack(false);
  };

  return (
    <Stack
      display={{
        xs: selectedChat ? "none" : "flex",
        sm: selectedChat ? "none" : "flex",
        md: "flex",
      }}
      backgroundColor="white"
      direction="column"
      padding={2}
      width={{ xs: "100%", sm: "100%", md: "32%" }}
      border="1px solid transparent"
      borderRadius="10px"
      spacing={2}
    >
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snack}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {alert}
        </Alert>
      </Snackbar>
      <Stack
        fontSize="30px"
        justifyContent="space-between"
        alignItems="center"
        direction="row"
      >
        My Chats
        <CreateGroup>
          <Button
            variant="contained"
            endIcon={<AddIcon />}
            style={{
              textTransform: "none",
              backgroundColor: "rgba(0,0,0,0.1)",
              color: "black",
            }}
          >
            New Group Chat
          </Button>
        </CreateGroup>
      </Stack>
      <Stack
        direction="column"
        padding={2}
        backgroundColor="#f7f7f7"
        height="100%"
        borderRadius="10px"
        overflow="hidden"
      >
        {loading && <ChatLoading></ChatLoading>}
        {!loading && chats ? (
          <Stack style={{ overflowY: "scroll" }} spacing={2}>
            {chats?.map((chat) => (
              <Stack
                onClick={() => {
                  if (notification !== null && notification?.length !== 0) {
                    setNotification(
                      notification.filter((n) => n.chat_id === chat._id)
                    );
                  }
                  setSelectedChat(chat);
                }}
                style={{ cursor: "pointer" }}
                backgroundColor={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                padding={1.5}
                borderRadius="10px"
                key={chat?._id}
              >
                <Typography>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Typography>
                {chat.latestMessage && (
                  <Typography fontSize="12px">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Typography>
                )}
              </Stack>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Stack>
    </Stack>
  );
};

export default MyChats;
