import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
    const [isSticky, setIsSticky] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsSticky(true);
            } else {
                setIsSticky(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Function to determine if the link is active
    const isActive = (path) => {
        return location.pathname === path ? 'text-blue-500' : 'text-white';
    };

    return (
        <>
            {/* First Navbar */}
            <nav className="bg-white backdrop-blur-md bg-opacity-30 border-gray-200">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <span className="self-center text-4xl font-semibold whitespace-nowrap text-white"
                        style={{
                            color: "#ffffff", 
                            fontFamily: "'New Amsterdam', sans-serif", 
                            fontWeight:500,
                            fontStyle: "normal"
                        }}>CheatCode</span>
                    </a>
                    <div className="flex items-center space-x-6 rtl:space-x-reverse">
                        <Link to="/compiler" className={`text-sm hover:underline ${isActive('/compiler')}`}>Compiler</Link>
                        <Link to="/login" className={`text-sm hover:underline ${isActive('/login')}`}>Login</Link>
                        <Link to="/signup" className={`text-sm hover:underline ${isActive('/signup')}`}>Signup</Link>
                    </div>
                </div>
            </nav>

            {/* Second Navbar */}
            <nav className={`bg-gray-50 backdrop-blur-md bg-opacity-30 sticky top-0 z-50 transition-all duration-300 ${isSticky ? 'block' : 'hidden'} shadow-md`}>
                <div className="max-w-screen-xl px-4 py-3 mx-auto">
                    <div className="flex items-center justify-between">
                        <ul className="flex flex-row font-medium mt-0 space-x-8 rtl:space-x-reverse text-sm">
                            <li>
                                <Link to="/problems" className={`hover:underline ${isActive('/problems')}`}>Problem Set</Link>
                            </li>
                            <li>
                                <Link to="/courses" className={`hover:underline ${isActive('/courses')}`}>Courses</Link>
                            </li>
                            <li>
                                <Link to="/flow-charts" className={`hover:underline ${isActive('/flow-charts')}`}>Flow Charts</Link>
                            </li>
                        </ul>
                        {/* Mobile Menu */}
                        <button className="block md:hidden text-white">
                            <span className="material-icons">menu</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
