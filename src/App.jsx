import { Route } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";
import { Stack } from "@mui/material";
import "./App.css";

function App() {
  return (
    <Stack className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chat} />
    </Stack>
  );
}

export default App;
