import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/redux/store.js";
import Navbar from "./app/_components/Navbar.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Navbar />
    <App />
  </Provider>
);
