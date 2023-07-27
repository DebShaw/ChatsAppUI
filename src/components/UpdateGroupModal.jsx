import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { ChatState } from "../context/ChatProvider";
import UserBadgeItem from "../miscellaneous/UserBadgeItem";
import axios from "axios";
import UserListItem from "../miscellaneous/UserListItem";

const UpdateGroupModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  axios.defaults.baseURL = "https://chatsappserver.onrender.com";

  const { selectedChat, setSelectedChat, user } = ChatState();

  const [groupModal, openGroupModal] = useState(false);

  const [chatName, setChatName] = useState(selectedChat?.chatName);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);

  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("info");
  const [snack, openSnack] = useState(false);

  const handleClose = () => {
    setAlert("");
    setSeverity("info");
    openSnack(false);
  };

  const handleRemove = async (removedUser) => {
    if (
      selectedChat.groupAdmin._id !== user._id &&
      removedUser._id !== user._id
    ) {
      setAlert("Only admins can remove someone!");
      setSeverity("error");
      openSnack(true);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.patch(
        "/api/chat/remove-from-group",
        { chatId: selectedChat._id, userId: removedUser._id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      user._id === removedUser._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setAlert(`${removedUser.name} successfully removed`);
      setSeverity("success");
      openSnack(true);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setAlert("Error while removing the user!");
      setSeverity("error");
      openSnack(true);
    }
  };

  const handleRename = async () => {
    if (chatName === "") {
      setAlert("Please enter new chat name before updating!");
      setSeverity("error");
      openSnack(true);
      return;
    }
    try {
      setRenameLoading(true);
      const { data } = await axios.patch(
        "/api/chat/rename-group",
        {
          chatId: selectedChat._id,
          chatName,
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setSelectedChat(data);
      setAlert("Group renamed successfully!");
      setSeverity("success");
      openSnack(true);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      setAlert("Error while renaming the group!");
      setSeverity("error");
      openSnack(true);
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (query === "") {
      setSearchResult([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`/api/user?search=${query}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSearchResult(data);
    } catch (error) {
      setAlert("Error while searching the user!");
      setSeverity("error");
      openSnack(true);
      console.log(error);
    }
    setLoading(false);
  };

  const handleAddUser = async (searchedUser) => {
    if (selectedChat?.users.find((u) => u._id === searchedUser._id)) {
      setAlert("User already exists in the group!");
      setSeverity("error");
      openSnack(true);
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      setAlert("Only admins can add a user!");
      setSeverity("error");
      openSnack(true);
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.patch(
        "/api/chat/add-to-group",
        { chatId: selectedChat._id, userId: searchedUser._id },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setSelectedChat(data);
      setAlert(`${searchedUser.name} successfully added`);
      setSeverity("success");
      openSnack(true);
      setFetchAgain(!fetchAgain);
      setSearch("");
      setSearchResult([]);
      setLoading(false);
    } catch (error) {
      setAlert("Error while adding the user!");
      setSeverity("error");
      openSnack(true);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <>
      <IconButton onClick={() => openGroupModal(true)}>
        <VisibilityIcon />
      </IconButton>
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
        <Dialog onClose={() => openGroupModal(false)} open={groupModal}>
          <DialogTitle fontSize="35px" width="400px" textAlign="center">
            {selectedChat?.chatName}
          </DialogTitle>
          <DialogContent width="400px">
            <Stack spacing={2} alignItems="center" width="100%">
              <Stack
                direction="row"
                spacing={1}
                style={{ width: "100%", margin: "1rem auto 0.5rem" }}
              >
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </Stack>
              <Stack
                width="90%"
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <TextField
                  style={{ width: "80%" }}
                  label="Chat Name"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
                <LoadingButton
                  variant="contained"
                  style={{
                    backgroundColor: "teal",
                    textTransform: "none",
                    fontSize: "12px",
                  }}
                  size="medium"
                  loading={renameLoading}
                  onClick={handleRename}
                >
                  Update
                </LoadingButton>
              </Stack>
              <Stack width="100%" spacing={2} alignItems="center">
                <TextField
                  label="Add user to group"
                  style={{ width: "90%" }}
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <Stack
                  width="95%"
                  justifyContent="center"
                  spacing={1}
                  alignItems="center"
                >
                  {loading ? (
                    <CircularProgress />
                  ) : (
                    searchResult
                      ?.slice(0, 4)
                      .map((searched) => (
                        <UserListItem
                          key={searched._id}
                          user={searched}
                          handleFunction={() => handleAddUser(searched)}
                        />
                      ))
                  )}
                </Stack>
              </Stack>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              color="error"
              size="small"
              style={{
                textTransform: "none",
                fontSize: "12px",
                marginRight: "1rem",
                marginBottom: "0.5rem",
              }}
              onClick={() => handleRemove(user)}
            >
              Exit Group
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
};

export default UpdateGroupModal;
