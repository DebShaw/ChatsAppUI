import { useState } from "react";
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { ChatState } from "../context/ChatProvider";
import axios from "axios";
import UserListItem from "../miscellaneous/UserListItem";
import UserBadgeItem from "../miscellaneous/UserBadgeItem";

const CreateGroup = ({ children }) => {
  axios.defaults.baseURL = "https://chatsappserver.onrender.com";

  const [groupModal, openGroupModal] = useState(false);

  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, chats, setChats } = ChatState();

  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("info");
  const [snack, openSnack] = useState(false);

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
      setSeverity("error");
      setAlert("Error while searching!");
      openSnack(true);
    }
    setLoading(false);
  };

  const handleGroup = (searchedUser) => {
    if (selectedUsers.includes(searchedUser)) {
      return;
    }
    setSelectedUsers([...selectedUsers, searchedUser]);
    setSearchResult([]);
  };

  const handleDelete = (selectedUser) => {
    setSelectedUsers(
      selectedUsers.filter((selected) => selected._id !== selectedUser._id)
    );
  };

  const createChat = async () => {
    if (groupName === "" || selectedUsers.length === 0) {
      return;
    }
    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setChats([data, ...chats]);
      setGroupName("");
      setSelectedUsers([]);
      setSearchResult([]);
      openGroupModal(false);
      setSeverity("success");
      setAlert("New Group Chat Created!");
      openSnack(true);
    } catch (error) {
      console.log(error);
      setSeverity("error");
      setAlert("Error! Failed to create Group Chat.");
      openSnack(true);
    }
  };

  const handleClose = () => {
    setAlert("");
    setSeverity("info");
    openSnack(false);
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
      <span onClick={() => openGroupModal(true)}>{children}</span>
      <Dialog open={groupModal} onClose={() => openGroupModal(false)}>
        <DialogTitle
          fontSize="40px"
          width={{ xs: "250px", sm: "250px", md: "400px" }}
          textAlign="center"
          style={{ margin: "0 auto" }}
        >
          Create Group Chat
        </DialogTitle>
        <Stack spacing={1}>
          <Stack spacing={2} alignItems="center">
            <TextField
              label="Chat Name"
              style={{ width: "90%" }}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            ></TextField>
            <TextField
              label="Add Users"
              style={{ width: "90%" }}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            ></TextField>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            style={{ width: "90%", margin: "1rem auto 0.5rem" }}
          >
            {selectedUsers?.map((selected) => (
              <UserBadgeItem
                user={selected}
                key={selected?._id}
                handleFunction={() => handleDelete(selected)}
              />
            ))}
          </Stack>
          <Stack justifyContent="center" spacing={1} alignItems="center">
            {loading ? (
              <CircularProgress />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((searched) => (
                  <UserListItem
                    key={searched._id}
                    user={searched}
                    handleFunction={() => handleGroup(searched)}
                  />
                ))
            )}
          </Stack>
        </Stack>
        <DialogActions>
          <Button
            variant="contained"
            style={{
              textTransform: "none",
              marginTop: "1rem",
              marginRight: "1rem",
            }}
            onClick={createChat}
          >
            Create
          </Button>
          <Button
            variant="contained"
            style={{
              textTransform: "none",
              marginTop: "1rem",
              marginRight: "1rem",
            }}
            onClick={() => openGroupModal(false)}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
};

export default CreateGroup;
