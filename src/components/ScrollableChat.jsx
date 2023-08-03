import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider";
import { useState } from "react";
import moment from "moment";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const [profile, openProfile] = useState(false);
  const [senderUser, setSenderUser] = useState("");
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip placement="bottom" title={m.sender.name} arrow>
                <Avatar
                  style={{
                    width: "20px",
                    height: "20px",
                    cursor: "pointer",
                    marginRight: "13px",
                    marginTop: isSameUser(messages, m, i, user._id) ? 7 : 12,
                  }}
                  src={m.sender.pic}
                  onClick={() => {
                    openProfile(true);
                    setSenderUser(m.sender);
                  }}
                >
                  {m.sender.name.charAt(0).toUpperCase()}
                </Avatar>
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 4 : 10,
              }}
            >
              <p>{m.content}</p>
              <p
                style={{
                  fontSize: "10px",
                  color: "rgba(0,0,0,0.4)",
                  marginTop: "5px",
                }}
              >
                {moment(m.createdAt).fromNow()}
              </p>
            </span>
          </div>
        ))}
      <Stack width="100%">
        <Dialog onClose={() => openProfile(false)} open={profile}>
          <DialogTitle
            style={{ margin: "0 auto" }}
            fontSize="40px"
            width={{ xs: "250px", sm: "90%", md: "400px" }}
            textAlign="center"
          >
            {senderUser?.name}
          </DialogTitle>
          <DialogContent width={{ xs: "95%", sm: "90%", md: "400px" }}>
            <Avatar
              style={{
                display: "flex",
                width: "150px",
                height: "150px",
                border: "none",
                borderRadius: "50%",
                margin: "0 auto",
              }}
              src={senderUser?.pic}
              alt="ProfilePic"
            />
            <Typography
              variant="h5"
              marginTop="0.7rem"
              fontWeight="400"
              textAlign="center"
              color="rgba(0,0,0,0.6)"
            >
              Email: {senderUser?.email}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ textTransform: "none", marginRight: "1rem" }}
              onClick={() => openProfile(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </ScrollableFeed>
  );
};

export default ScrollableChat;
