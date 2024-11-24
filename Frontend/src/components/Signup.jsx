import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
// import '../assets/fonts/fonts.css';
import '../App.css'; // Link to your CSS file

const Signup = () => {
  const [formData, setFormData] = useState({
    U_name: '',
    U_email: '',
    U_dob: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Signup successful!` });
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Something went wrong. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      <form
        onSubmit={handleSignup}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg border border-white border-opacity-10 p-8 w-full max-w-md"
      >
        <h3 className="text-white text-3xl font-medium text-center">Sign Up</h3>

        {/* Name Input */}
        <label htmlFor="U_name" className="block text-white mt-8 font-medium">
          Name
        </label>
        <input
          type="text"
          id="U_name"
          name="U_name"
          value={formData.U_name}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter your name"
          required
          aria-required="true"
        />

        {/* Email Input */}
        <label htmlFor="U_email" className="block text-white mt-4 font-medium">
          Email
        </label>
        <input
          type="email"
          id="U_email"
          name="U_email"
          value={formData.U_email}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter your email"
          required
          aria-required="true"
        />

        {/* Date of Birth Input */}
        <label htmlFor="U_dob" className="block text-white mt-4 font-medium">
          Date of Birth
        </label>
        <input
          type="date"
          id="U_dob"
          name="U_dob"
          value={formData.U_dob}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          required
          aria-required="true"
        />

        {/* Password Input */}
        <label htmlFor="password" className="block text-white mt-4 font-medium">
          Password
        </label>
        <div className="relative">
          <input
            type={isPasswordVisible ? 'text' : 'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
            placeholder="Enter your password"
            required
            aria-required="true"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-3 text-gray-500 cursor-pointer"
            onClick={() => setPasswordVisibility(!isPasswordVisible)}
            aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
          >
            {isPasswordVisible ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`mt-6 w-full h-[50px] bg-white text-[#080710] rounded-md font-semibold ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </button>

        {/* Message */}
        {message && (
          <div
            className={`mt-4 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Link to Login Page */}
        <div className="mt-[30px] text-center">
          <p className="text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;
