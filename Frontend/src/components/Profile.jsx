import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    dob: '',
    profilePic: '',
  });

  useEffect(() => {
    // Fetch the user profile data when the component loads
    axios
      .get('/api/user/profile')
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => console.error('Error fetching user data:', error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update user data via API
    axios
      .post('/api/user/update', userData)
      .then((response) => {
        console.log('Profile updated successfully:', response.data);
      })
      .catch((error) => console.error('Error updating profile:', error));
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg border border-white border-opacity-10 p-8 w-full max-w-md"
      >
        <h3 className="text-white text-3xl font-medium text-center">Profile</h3>

        {/* Name Field (Read-only) */}
        <label htmlFor="name" className="block text-white mt-8 font-medium">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={userData.name}
          readOnly
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
        />

        {/* Email Field */}
        <label htmlFor="email" className="block text-white mt-8 font-medium">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={userData.email}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter your email"
          required
        />

        {/* Date of Birth Field */}
        <label htmlFor="dob" className="block text-white mt-8 font-medium">
          Date of Birth
        </label>
        <input
          type="date"
          id="dob"
          name="dob"
          value={userData.dob}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
        />

        {/* Profile Picture Upload */}
        <label htmlFor="profilePic" className="block text-white mt-8 font-medium">
          Profile Picture
        </label>
        <input
          type="file"
          id="profilePic"
          name="profilePic"
          onChange={(e) =>
            handleChange({ target: { name: 'profilePic', value: e.target.files[0] } })
          }
          className="block w-full text-white mt-2"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="mt-6 w-full h-[50px] bg-white text-[#080710] rounded-md font-semibold"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
