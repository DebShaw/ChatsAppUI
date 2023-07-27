import {
  Stack,
  TextField,
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  ThemeProvider,
  createTheme
} from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../context/ChatProvider";

const Home = () => {
  const theme = createTheme({
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
    },
  });
  axios.defaults.baseURL = "https://chatsappserver.onrender.com";
  const { setUser } = ChatState();
  const [value, setValue] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState("");
  const [severity, setSeverity] = useState("info");
  const [snack, openSnack] = useState(false);
  const handleClose = () => {
    setAlert("");
    setSeverity("info");
    openSnack(false);
  };

  const history = useHistory();

  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("User"));
    if (User) {
      history.push("/chats");
    }
  }, [history]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (value === "signup") {
      if (!name || !email || !password || !cnfPassword) {
        setSeverity("warning");
        setAlert("Please fill all the fields");
        openSnack(true);
      } else if (password !== cnfPassword) {
        setSeverity("error");
        setAlert("Passwords Mismatched");
        openSnack(true);
        setCnfPassword("");
      } else {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/user/signup",
            {
              name,
              email,
              password,
              pic,
            },
            config
          );
          setSeverity("success");
          setAlert("Successful Sign Up!");
          openSnack(true);
          setUser(data);
          localStorage.setItem("User", JSON.stringify(data));
          setLoading(false);
          history.push("/chats");
        } catch (error) {
          setSeverity("error");
          setAlert(error.response.data.message);
          openSnack(true);
          setLoading(false);
        }
      }
    } else {
      if (!email || !password) {
        setSeverity("warning");
        setAlert("Please fill all the fields");
        openSnack(true);
      } else {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            "/api/user/login",
            {
              email,
              password,
            },
            config
          );
          setSeverity("success");
          setAlert("Successful Log In!");
          openSnack(true);
          setUser(data);
          localStorage.setItem("User", JSON.stringify(data));
          setLoading(false);
          history.push("/chats");
        } catch (error) {
          setSeverity("error");
          setAlert(error.response.data.message);
          openSnack(true);
          setLoading(false);
        }
      }
    }
    setLoading(false);
  };

  const postPic = (pics) => {
    setLoading(true);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "ChatsApp");
      data.append("cloud_name", "deb-shaw");
      fetch("https://api.cloudinary.com/v1_1/deb-shaw/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Stack padding="5%" justifyContent="center">
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
        <Stack
          padding="1rem"
          width={{ xs: "90%", sm: "90%", md: "40%" }}
          margin="0 auto"
          borderRadius="1rem"
          boxShadow="1px 1px 15px rgba(0,0,0,0.2)"
          sx={{ backgroundColor: "#f6f6f6" }}
        >
          <Typography textAlign="center" variant="h4">
            ChatsApp
          </Typography>
        </Stack>
        <Stack
          padding="1rem"
          width={{ xs: "90%", sm: "90%", md: "40%" }}
          margin="2rem auto"
          borderRadius="1rem"
          boxShadow="1px 1px 15px rgba(0,0,0,0.2)"
          sx={{ backgroundColor: "#f6f6f6" }}
        >
          <Stack justifyContent="center" spacing={2}>
            <Stack sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs variant="fullWidth" value={value} onChange={handleChange}>
                <Tab label="Log In" value="login" />
                <Tab label="Sign Up" value="signup" />
              </Tabs>
            </Stack>
            {value === "login" ? (
              <Stack padding="0 2.5%" spacing={2}>
                <TextField
                  type="email"
                  variant="outlined"
                  label="Enter Your Email Id"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                ></TextField>
                <TextField
                  type="password"
                  variant="outlined"
                  label="Enter Your password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                ></TextField>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Log In
                </LoadingButton>
              </Stack>
            ) : (
              <Stack padding="0 2.5%" spacing={2}>
                <TextField
                  type="text"
                  variant="outlined"
                  label="Enter Your Name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                ></TextField>
                <TextField
                  type="email"
                  variant="outlined"
                  label="Enter Your Email Id"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                ></TextField>
                <TextField
                  type="password"
                  variant="outlined"
                  label="Enter Your password"
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                ></TextField>
                <TextField
                  type="password"
                  variant="outlined"
                  label="Enter Confirmed Password"
                  value={cnfPassword}
                  required
                  onChange={(e) => setCnfPassword(e.target.value)}
                ></TextField>
                <TextField
                  type="file"
                  accept="image/*"
                  label="Upload Your Profile Picture"
                  onChange={(e) => postPic(e.target.files[0])}
                  InputLabelProps={{
                    shrink: true,
                  }}
                ></TextField>
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  onClick={handleSubmit}
                >
                  Sign Up
                </LoadingButton>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
    </ThemeProvider>
  );
};

export default Home;
