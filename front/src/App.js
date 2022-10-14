import Register from "./components/Register";
import "./App.css";
import Login from "./components/Login";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import RequireAuth from "./api/RequireAuth";
import Layout from "./components/Layout";
import Users from "./components/Users";
import PersistLogin from "./api/PersistLogin";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<RequireAuth />}>
            {/* <Route element={<PersistLogin />}> */}
            <Route path="/" element={<Home />} />
            <Route paht="/Users" element={<Users />} />
          </Route>
          {/* </Route> */}
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
