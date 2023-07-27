import { Stack } from "@mui/material";
import { ChatState } from "../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Stack
      display={{
        xs: selectedChat ? "flex" : "none",
        sm: selectedChat ? "flex" : "none",
        md: "flex",
      }}
      width={{ xs: "100%", sm: "100%", md: "68%" }}
      border="1px solid transparent"
      borderRadius="10px"
      backgroundColor="white"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Stack>
  );
};

export default ChatBox;
