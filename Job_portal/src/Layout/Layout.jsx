import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Bars3Icon, 
  XMarkIcon,
  UserIcon,
  BuildingOfficeIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'; // Assuming Heroicons are installed
import { LoginContext } from "../Authentication/Auth_context";

const Layout = ({ children }) => {
  const { loginInfo, logout } = useContext(LoginContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home after logout
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Navigation */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-white mr-2" />
              <Link to="/" className="text-2xl font-bold text-white hover:text-blue-100 transition duration-200">
                Job Portal
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-6">
              {loginInfo.isLoggedIn ? (
                <>
                  <Link
                    to="/"
                    className="flex items-center space-x-2 px-4 py-2 text-white bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition duration-200"
                  >
                    <BriefcaseIcon className="h-5 w-5" />
                    <span>Job Listings</span>
                  </Link>
                  {loginInfo.role === "user" ? (
                    <Link
                      to="/profile" // Assuming "/profile" instead of "/ur"; adjust as needed
                      className="flex items-center space-x-2 px-4 py-2 text-white bg-green-500/20 rounded-xl hover:bg-green-500/30 transition duration-200"
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>Profile</span>
                    </Link>
                  ) : (
                    <Link
                      to="/addjob"
                      className="flex items-center space-x-2 px-4 py-2 text-white bg-purple-500/20 rounded-xl hover:bg-purple-500/30 transition duration-200"
                    >
                      <BuildingOfficeIcon className="h-5 w-5" />
                      <span>Add Jobs</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-xl transition duration-200"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-white bg-green-500/20 hover:bg-green-500/30 rounded-xl transition duration-200"
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-white bg-blue-500/20 hover:bg-blue-500/30 rounded-xl transition duration-200"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition duration-200"
              >
                {isMobileMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white/10 backdrop-blur-sm rounded-xl p-4 space-y-2">
              {loginInfo.isLoggedIn ? (
                <>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Job Listings
                  </Link>
                  {loginInfo.role === "user" ? (
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                  ) : (
                    <Link
                      to="/addjob"
                      className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Add Jobs
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-red-500/20 rounded-lg transition duration-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-white hover:bg-white/20 rounded-lg transition duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main className="bg-gray-50 min-h-[90dvh]">{children}</main>
    </>
  );
};

export default Layout;
