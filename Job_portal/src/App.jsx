import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import JobProfile from "./Job_Pages/JobProfile";
import JobList from "./Job_Pages/JobList";

import AddJob from "./Job_Pages/AddJobs";
import Register from "./Authentication/Register";
import Login from "./Authentication/Login";
import { LoginProvider } from "./Authentication/Auth_context";

function App() {
  return (
    <>
      <ToastContainer/>

        <LoginProvider>

          <Router>
            <Routes>
              <Route path="/" element={<JobList />} />
              <Route path="/profile" element={<JobProfile />} />
              <Route path="/addjob" element={<AddJob />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Router>
        </LoginProvider>
    </>
  );
}

export default App;
