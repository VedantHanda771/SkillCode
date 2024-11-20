import React, { useState } from 'react';
import '../assets/fonts/fonts.css'; // Import the font CSS

const Signup = () => {
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const runCode = async () => {
    try {
      const response = await fetch('http://localhost:5000/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code, input }),
      });

      const result = await response.json();
      if (response.ok) {
        setOutput(result.output);
      } else {
        setOutput(result.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-transparent font-new-amsterdam">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-gray-900 text-3xl mb-6">Sign Up and Run Code</h2>

        {/* Language Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="language">
            Programming Language
          </label>
          <select
            id="language"
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="">Select Language</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
        </div>

        {/* Code Input */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="code">
            Code
          </label>
          <textarea
            id="code"
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your code"
            rows="5"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        {/* Input for Code */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="input">
            Input
          </label>
          <textarea
            id="input"
            className="w-full p-3 rounded-lg bg-gray-100 text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter input for the code"
            rows="3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        {/* Run Code Button */}
        <button
          type="button"
          className="w-full p-3 bg-black text-white rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={runCode}
        >
          Run Code
        </button>

        {/* Output */}
        <div className="mt-4">
          <h3 className="text-gray-700 text-xl">Output:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg">{output}</pre>
        </div>
      </form>
    </div>
  );
};

export default Signup;
