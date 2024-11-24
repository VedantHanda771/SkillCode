import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Added useNavigate

const SolveProblem = () => {
  const { name } = useParams(); // Fetch problem name from URL
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testPassed, setTestPassed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript'); // Default language is JavaScript
  const [error, setError] = useState(''); // State for code errors
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/problems/${encodeURIComponent(name)}`
        );
        const data = await response.json();
        if (response.ok) {
          setQuestion(data);
        } else {
          console.error('Failed to fetch question:', data.message);
        }
      } catch (err) {
        console.error('Failed to fetch question:', err.message);
      }
    };

    fetchQuestion();
  }, [name]);

  const handleInputChange = (e) => setCode(e.target.value);

  const handleLanguageChange = (e) => setLanguage(e.target.value);

  const runCode = async () => {
    setLoading(true);
    setOutput('');
    setError('');
    setTestPassed(null);

    try {
      const response = await fetch('http://localhost:5000/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          input: question.Q_input,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
        const isTestPassed = data.output.trim() === question.Q_output.trim();
        setTestPassed(isTestPassed);
      } else {
        console.error('Error running the code:', data.error);
        setError(data.error); // Set error if available
      }
    } catch (err) {
      console.error('Error:', err.message);
      setError(err.message); // Handle fetch errors
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting the solution...');
    // Add submission logic
  };

  const handleBackToProblemList = () => {
    navigate('/problems'); // Adjust the path to where the problem list is located
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="bg-transparent min-h-screen text-gray-200 flex flex-col items-center"
      style={{
        backgroundImage:
          'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.7))',
      }}
    >
      <header className="bg-gray-800 bg-opacity-60 text-white p-4 sticky top-0 w-full text-center">
        <h1 className="text-2xl font-bold">{question.Q_name}</h1>
        <span className="text-green-500">{question.Difficulty}</span>
      </header>

      <div className="container mx-auto p-4 w-full max-w-6xl">
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg">
          <h2 className="text-2xl mb-4 text-center font-semibold">
            Problem Description
          </h2>
          <p className="text-gray-200">{question.Q_explanation}</p>
        </div>

        <div className="flex mt-8 space-x-6">
          {/* Code Section */}
          <div className="bg-gray-800 bg-opacity-50 w-2/3 p-4 rounded-lg shadow-lg backdrop-blur-lg">
            <textarea
              className="bg-gray-700 bg-opacity-30 w-full h-64 p-4 text-green-200 font-mono rounded-lg"
              value={code}
              onChange={handleInputChange}
              placeholder="Write your code here..."
            />
            <div className="mt-4 flex space-x-4">
              <select
                className="bg-gray-700 bg-opacity-60 text-gray-200 p-2 rounded"
                value={language}
                onChange={handleLanguageChange}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
              </select>
              <button
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 text-white rounded"
                onClick={runCode}
                disabled={loading}
              >
                {loading ? 'Running...' : 'Run'}
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>

          {/* Testcase and Output Section */}
<div className="bg-gray-800 bg-opacity-50 w-1/3 p-4 rounded-lg shadow-lg backdrop-blur-lg">
  <h3 className="text-xl mb-4">Testcase:</h3>
  <div className="bg-gray-700 bg-opacity-30 p-2 rounded">
    {question.Q_input} {/* Dynamically displaying the test case */}
  </div>
  <div className="mt-2 bg-gray-700 bg-opacity-30 p-2 rounded">
    Expected Output: {question.Q_output} {/* Dynamically displaying the expected output */}
  </div>

  {testPassed !== null && (
    <div
      className={`mt-6 p-4 rounded ${
        testPassed ? 'bg-green-500' : 'bg-red-500'
      }`}
    >
      <h3 className="text-white text-lg font-semibold">
        Test Case {testPassed ? 'Passed' : 'Failed'}
      </h3>
      <p className="text-white">Your output:</p>
      <pre>{output}</pre>
      <p className="text-white">Expected output:</p>
      <pre>{question.Q_output}</pre>
    </div>
  )}
</div>

        </div>

        {/* Error Box */}
        {error && (
          <div className="mt-6 bg-red-500 bg-opacity-70 text-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Error</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Back to Problem List Button */}
        <div className="mt-6">
          <button
            className="bg-gray-500 hover:bg-gray-600 px-6 py-3 text-white rounded"
            onClick={handleBackToProblemList}
          >
            Back to Problem List
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolveProblem;
