import { useState } from "react";
import {
  Stack,
  Tooltip,
  Button,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  IconButton,
  Drawer,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { ChatState } from "../context/ChatProvider";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../loader/ChatLoading";
import UserListItem from "../miscellaneous/UserListItem";
import { getSender } from "../config/ChatLogics";
import NotificationBadge, {Effect} from "react-notification-badge";

const SideDrawer = () => {
  axios.defaults.baseURL = "https://chatsappserver.onrender.com";
  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const history = useHistory();

  const [bellAnchor, setBellAnchor] = useState(null);
  const bellOpen = Boolean(bellAnchor);

  const handleNotificationClick = (e) => {
    if (notification === null || notification.length === 0) {
      setAlert("No New Messages...");
      setSeverity("warning");
      openSnack(true);
      return;
    }
    setBellAnchor(e.currentTarget);
  };
  const handleNotificationClose = () => {
    setBellAnchor(null);
  };
  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("info");
  const [snack, openSnack] = useState(false);
  const handleClose = () => {
    setAlert("");
    setSeverity("info");
    openSnack(false);
  };

  const [profileAnchor, setProfileAnchor] = useState(null);
  const profileOpen = Boolean(profileAnchor);

  const handleProfileClick = (e) => {
    setProfileAnchor(e.currentTarget);
  };
  const handleProfileClose = () => {
    setProfileAnchor(null);
  };
  const handleLogout = () => {
    setUser();
    localStorage.removeItem("User");
    history.push("/");
  };

  const [drawer, openDrawer] = useState(false);

  const handleSearch = async () => {
    if (!search) {
      setSeverity("warning");
      setAlert("Please enter either name or email to search");
      openSnack(true);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/user?search=${search}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSearchResult(data);
    } catch (error) {
      setSeverity("error");
      setAlert("Failed to search user!");
      openSnack(true);
    }
    setLoading(false);
  };

  const accessChat = async (userId) => {
    setLoadingChat(true);
    try {
      const { data } = await axios.post(
        "/api/chat",
        { userId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      openDrawer(false);
    } catch (error) {
      setSeverity("error");
      setAlert("Error in accessing the chat");
      openSnack(true);
    }
    setLoadingChat(false);
  };

  return (
    <Stack>
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
        direction="row"
        justifyContent="space-between"
        backgroundColor="white"
        padding="5px 10px 5px 10px"
      >
        <Tooltip title="Search for an User" arrow placement="bottom-end">
          <Button
            variant="text"
            style={{
              width: "fit-content",
              color: "black",
              textTransform: "none",
            }}
            startIcon={<SearchIcon />}
            onClick={() => openDrawer(true)}
          >
            <Typography
              variant="body"
              display={{ xs: "none", sm: "none", md: "flex" }}
              style={{ padding: "0 4px" }}
            >
              Search User
            </Typography>
          </Button>
        </Tooltip>
        <Typography variant="h3" color="rgba(0,0,0,0.65)">
          ChatsApp
        </Typography>
        <Stack direction="row" alignItems="center">
          <Stack>
            <IconButton
              style={{ color: "black", padding: "0", width: "fit-content" }}
              onClick={handleNotificationClick}
            >
              <NotificationsIcon />
              <NotificationBadge
                count={notification?.length}
                effect={Effect.SCALE}
              />
            </IconButton>
            <Menu
              anchorEl={bellAnchor}
              open={bellOpen}
              onClose={handleNotificationClose}
            >
              {notification?.map((n) => (
                <MenuItem
                  key={n._id}
                  onClick={() => {
                    setSelectedChat(n.chat);
                    setNotification(
                      notification.filter((notif) => notif !== n)
                    );
                    setBellAnchor(null);
                  }}
                >
                  {n.chat.isGroupChat
                    ? `New message from ${n.chat.chatName}`
                    : `New message from ${getSender(user, n.chat.users)}`}
                </MenuItem>
              ))}
            </Menu>
          </Stack>
          <Stack>
            <Button
              style={{ color: "black" }}
              endIcon={<ArrowDropDownIcon />}
              onClick={handleProfileClick}
            >
              <Avatar src={user?.pic} />
            </Button>
            <Menu
              anchorEl={profileAnchor}
              open={profileOpen}
              onClose={handleProfileClose}
            >
              <ProfileModal user={user}>
                <MenuItem style={{ width: "150px" }}>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem style={{ width: "150px" }} onClick={handleLogout}>
                Log Out
              </MenuItem>
            </Menu>
          </Stack>
        </Stack>
      </Stack>
      <Drawer
        sx={{
          width: 300,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 300,
            boxSizing: "border-box",
          },
        }}
        anchor="left"
        onClose={() => openDrawer(false)}
        open={drawer}
      >
        <Stack>
          <Typography
            margin="0.5rem 0"
            padding="0 1rem 0.5rem"
            variant="h6"
            borderBottom="4px solid rgba(0,0,0,0.08)"
          >
            Search Users
          </Typography>
          <Stack
            padding="0.2rem 1rem"
            direction="row"
            spacing={2}
            alignItems="center"
          >
            <TextField
              id="search-input"
              label="Search by name or email"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            ></TextField>
            <Button
              variant="contained"
              style={{
                backgroundColor: "rgba(0,0,0,0.08)",
                color: "black",
                textTransform: "none",
                fontSize: "16px",
              }}
              size="small"
              onClick={handleSearch}
            >
              Go
            </Button>
          </Stack>
          <Stack margin="1rem">
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((searched) => (
                <UserListItem
                  key={searched._id}
                  user={searched}
                  handleFunction={() => accessChat(searched._id)}
                />
              ))
            )}
            {loadingChat && <CircularProgress />}
          </Stack>
        </Stack>
      </Drawer>
    </Stack>
  );
};

export default SideDrawer;
