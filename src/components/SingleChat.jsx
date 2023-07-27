import {
  Stack,
  Typography,
  IconButton,
  CircularProgress,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import { useState, useEffect } from "react";
import { ChatState } from "../context/ChatProvider";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getSender, getSenderFull } from "../config/ChatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupModal from "./UpdateGroupModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "https://chatsappserver.onrender.com";
//eslint-disable-next-line
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  axios.defaults.baseURL = "https://chatsappserver.onrender.com";
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  //eslint-disable-next-line
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("info");
  const [snack, openSnack] = useState(false);
  const handleClose = () => {
    setAlert("");
    setSeverity("info");
    openSnack(false);
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  const sendMessage = async (e) => {
    if (e.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        setAlert("Error while sending message");
        setSeverity("error");
        openSnack(true);
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/message/${selectedChat._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMessages(data);
      setLoading(false);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    //eslint-disable-next-line
  }, [selectedChat]);

  return (
    <Stack height="88vh">
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snack}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {alert}
        </Alert>
      </Snackbar>{" "}
      {selectedChat ? (
        <Stack height="100%">
          <Stack
            paddingY={2}
            direction="row"
            width="100%"
            alignItems="center"
            justifyContent="space-between"
          >
            {!selectedChat.isGroupChat ? (
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                width="100%"
                paddingX={1}
              >
                <IconButton onClick={() => setSelectedChat("")}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography fontSize="30px">
                  {getSender(user, selectedChat.users)}
                </Typography>
                <Stack>
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </Stack>
              </Stack>
            ) : (
              <Stack
                width="100%"
                justifyContent="space-between"
                alignItems="center"
                direction="row"
                paddingX={1}
              >
                <IconButton onClick={() => setSelectedChat("")}>
                  <ArrowBackIcon />
                </IconButton>
                <Typography fontSize="30px">
                  {selectedChat?.chatName}
                </Typography>
                <Stack>
                  <UpdateGroupModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </Stack>
              </Stack>
            )}
          </Stack>
          <Stack
            justifyContent="flex-end"
            backgroundColor="#E8E8E8"
            height={{ xs: "86%", sm: "84%", md: "83%" }}
            width={{ xs: "90%", sm: "90%", md: "95%" }}
            margin="0 auto"
            borderRadius="10px"
            style={{
              overflowY: "hidden",
            }}
            padding="0.5rem"
          >
            {loading ? (
              <CircularProgress
                style={{
                  width: "100px",
                  height: "100px",
                  margin: "auto",
                  color: "rgba(0,0,0,0.3)",
                }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "scroll",
                  scrollbarWidth: "none",
                  padding: "0 2rem 1rem",
                }}
              >
                <ScrollableChat messages={messages} />
              </div>
            )}
            {isTyping ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  width={40}
                  style={{ marginLeft: "10px" }}
                />
              </div>
            ) : (
              <></>
            )}
            <TextField
              variant="outlined"
              style={{
                backgroundColor: "#E0E0E0",
                borderRadius: "10px",
                marginTop: "5px",
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& > fieldset": { border: "none" },
                },
              }}
              placeholder="Message..."
              onChange={typingHandler}
              onKeyDown={sendMessage}
              value={newMessage}
            />
          </Stack>
        </Stack>
      ) : (
        <Stack alignItems="center" justifyContent="center" height="100%">
          <Typography variant="h3" padding={3}>
            Click on a user to start chatting
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};

export default SingleChat;
