import { Avatar, Stack, Typography } from "@mui/material";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Stack
      backgroundColor="#E8E8E8"
      style={{
        cursor: "pointer",
        color: "black",
        transition: "0.4s",
      }}
      sx={{ ":hover": { backgroundColor: "#38B2AC" } }}
      padding="5px 10px"
      borderRadius="5px"
      alignItems="center"
      direction="row"
      width="90%"
      margin="0.2rem auto"
      spacing={2}
      onClick={handleFunction}
    >
      <Avatar margin="2px" alt={user?.name} src={user?.pic} />
      <Stack
        width="100%"
        height="100%"
        style={{
          transition: "0.4s",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        sx={{ ":hover": { color: "white" } }}
      >
        <Typography variant="h6">{user?.name}</Typography>
        <Typography
          overflow="hidden"
          textOverflow="ellipsis"
          variant="subtitle2"
          fontWeight="340"
        >
          {user?.email}
        </Typography>
      </Stack>
    </Stack>
  );
};

export default UserListItem;
