import React from 'react';
import '../assets/fonts/fonts.css'; // Import the font CSS

const Login = () => {
  return (
    <div className="box min-h-screen flex justify-center items-center bg-transparent font-new-amsterdam">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-gray-900 text-3xl mb-6">Login</h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="username">
            Username or Email
          </label>
          <input
            type="text"
            id="username"
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your username or email"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>
        <button className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
