import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../ui/HomePage";

function App() {
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    window.addEventListener(
      "message",
      (e) => {
        if (
          e.data?.action === "is_settings_open" ||
          e.data?.action === "isOpened"
        ) {
          e.stopImmediatePropagation();
        }
      },
      true
    );
  }
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
