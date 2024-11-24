import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [message, setMessage] = useState(null); // Object for message type and text
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setPasswordVisibility] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      console.log(result); // Log the result to check the structure
  
      if (response.ok) {
        const { token } = result;
      
        // Check if token is returned correctly
        if (token) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('user', formData.username); // Store the entire user object
        } else {
          setMessage({ type: 'error', text: 'Authentication token is missing in the response.' });
        }
      
        setMessage({ type: 'success', text: 'Login successful!' });
        // navigate('/');
      }
       else {
        setMessage({ type: 'error', text: result.error || 'Invalid credentials.' });
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
        onSubmit={handleLogin}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg border border-white border-opacity-10 p-8 w-full max-w-md"
      >
        <h3 className="text-white text-3xl font-medium text-center">Login</h3>

        {/* Username Input */}
        <label htmlFor="username" className="block text-white mt-8 font-medium">
          Username or Email
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter your username or email"
          required
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
          {isLoading ? 'Logging In...' : 'Login'}
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

        {/* Link to Signup Page */}
        <div className="mt-6 text-center">
          <p className="text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
