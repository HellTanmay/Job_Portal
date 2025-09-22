import { useContext } from "react";
import { Link } from "react-router-dom";
import { LoginContext } from "../Authentication/Auth_context";
import axios from "axios";
const Layout = ({ children }) => {
  const { loginInfo, logout } = useContext(LoginContext);

  return (
    <>
      <div className="w-full bg-blue-100 p-4">
        <nav className="ml-auto space-x-4 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">Job Portal</h1>
          </div>
          <span className="space-x-4">
            {loginInfo.isLoggedIn ? (
              <>
                
                <Link
                  className="bg-blue-400 p-2 rounded-xl text-white"
                  to="/"
                >
                  Job Listings
                </Link>
                {loginInfo.role=="user"?(<Link className="bg-blue-400 p-2 rounded-xl text-white" to="/ur">
                  Profile 
                </Link>):
                (<Link
                  className="bg-blue-400 p-2 rounded-xl text-white"
                  to="/addjob"
                >
                  Add Jobs
                </Link>)}
                <button
                  className="bg-red-400 p-2 rounded-xl text-white"
                  onClick={logout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  className="bg-blue-400 p-2 rounded-xl text-white"
                  to="/register"
                >
                  Register
                </Link>
                <Link
                  className="bg-blue-400 p-2 rounded-xl text-white"
                  to="/login"
                >
                  Login
                </Link>{" "}
              </>
            )}
          </span>
        </nav>
      </div>
      <div className="bg-amber-50 min-h-[90dvh]">{children}</div>
    </>
  );
};

export default Layout;
