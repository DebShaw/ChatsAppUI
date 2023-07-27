import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ChatProvider from "./context/ChatProvider"
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
);
