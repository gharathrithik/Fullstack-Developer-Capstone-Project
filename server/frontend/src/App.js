import LoginPanel from "./components/Login/Login"
import SubmitPanel from "./components/Register/Register"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/register" element={<SubmitPanel />} />
    </Routes>
  );
}
export default App;
