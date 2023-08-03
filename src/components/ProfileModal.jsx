import { useState } from "react";
import {
  Stack,
  Dialog,
  IconButton,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button,
  Avatar,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const ProfileModal = ({ user, children }) => {
  const [profileModal, setProfileModal] = useState(false);
  return (
    <>
      <>
        {children ? (
          <span onClick={() => setProfileModal(true)}>{children}</span>
        ) : (
          <IconButton onClick={() => setProfileModal(true)}>
            <VisibilityIcon />
          </IconButton>
        )}
      </>
      <Stack width="100%">
        <Dialog onClose={() => setProfileModal(false)} open={profileModal}>
          <DialogTitle
            fontSize="40px"
            width={{ xs: "250px", sm: "90%", md: "400px" }}
            textAlign="center"
            style={{ margin: "0 auto" }}
          >
            {user?.name}
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
              src={user?.pic}
              alt="ProfilePic"
            />
            <Typography
              variant="h5"
              marginTop="0.7rem"
              fontWeight="400"
              textAlign="center"
              color="rgba(0,0,0,0.6)"
            >
              Email: {user?.email}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="contained"
              style={{ textTransform: "none", marginRight: "1rem" }}
              onClick={() => setProfileModal(false)}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </>
  );
};

export default ProfileModal;
