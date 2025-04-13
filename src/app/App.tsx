import { Provider } from "react-redux";
import { store } from "../store/store";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../ui/HomePage";

function App() {
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
