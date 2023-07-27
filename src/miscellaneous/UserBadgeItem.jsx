import { Stack, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <div>
      <Stack
        padding="2px 5px"
        style={{ cursor: "pointer", border: "1px solid #1983d8" }}
        backgroundColor="azure"
        borderRadius="5px"
        width="fit-content"
        direction="row"
        alignItems="center"
        spacing={0.5}
        onClick={handleFunction}
      >
        <Typography style={{ fontSize: "12px", padding: "0" }}>
          {user?.name}
        </Typography>
        <CloseIcon style={{ fontSize: "12px", padding: "0" }} />
      </Stack>
    </div>
  );
};

export default UserBadgeItem;
