import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearUser, setUser } from '../userSlice';

const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fetch user data from Redux store
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    // Get user data from local storage on mount
    const userFromLocalStorage = localStorage.getItem('user');

    if (userFromLocalStorage) {
      try {
        const parsedUser = JSON.parse(userFromLocalStorage);
        if (parsedUser?.username) {
          dispatch(setUser(parsedUser)); // Set user in Redux store
        }
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }

    const handleScroll = () => setIsSticky(window.scrollY > 50);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(clearUser()); // Clear user from Redux store
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    navigate('/login'); // Navigate to login
  };

  const isActive = (path) => location.pathname === path ? 'text-blue-500' : 'text-white';

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Main Navbar */}
      <nav className="bg-white backdrop-blur-md bg-opacity-30 border-gray-200">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <span
              className="self-center text-4xl font-semibold whitespace-nowrap"
              style={{ color: '#ffffff', fontFamily: "'New Amsterdam', sans-serif", fontWeight: 500 }}
            >
              CheatCode
            </span>
          </Link>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            <Link to="/compiler" className={`text-sm hover:underline ${isActive('/compiler')}`}>
              Compiler
            </Link>

            {/* Conditional Login/Signup or Logout */}
            {user ? (
              <button onClick={handleLogout} className="text-sm text-white">Logout</button>
            ) : (
              <>
                <Link to="/login" className="mr-4">Login</Link>
                <Link to="/signup">Signup</Link>
              </>
            )}
          </div>
          <button onClick={toggleMenu} className="block md:hidden text-white">
            <span className="material-icons">menu</span>
          </button>
        </div>
      </nav>

      {/* Sticky Navbar */}
      <nav className={`bg-gray-50 backdrop-blur-md bg-opacity-30 sticky top-0 z-50 transition-all duration-300 ${isSticky ? 'block' : 'hidden'} shadow-md`}>
        <div className="max-w-screen-xl px-4 py-3 mx-auto">
          <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
            <li>
              <Link to="/problems" className={`hover:underline ${isActive('/problems')}`}>
                Problem Set
              </Link>
            </li>
            <li>
              <Link to="/courses" className={`hover:underline ${isActive('/courses')}`}>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/flow-charts" className={`hover:underline ${isActive('/flow-charts')}`}>
                Flow Charts
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 p-4 md:hidden">
          <Link to="/compiler" className="text-white block py-2">Compiler</Link>
          {user ? (
            <button onClick={handleLogout} className="text-white block py-2">Logout</button>
          ) : (
            <>
              <Link to="/login" className="text-white block py-2">Login</Link>
              <Link to="/signup" className="text-white block py-2">Signup</Link>
            </>
          )}
          <Link to="/problems" className="text-white block py-2">Problem Set</Link>
          <Link to="/courses" className="text-white block py-2">Courses</Link>
          <Link to="/flow-charts" className="text-white block py-2">Flow Charts</Link>
        </div>
      )}
    </>
  );
};

export default Navbar;
