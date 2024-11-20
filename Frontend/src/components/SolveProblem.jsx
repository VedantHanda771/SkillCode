import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const SolveProblem = () => {
  const { name } = useParams();  // Fetch problem name from URL
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testPassed, setTestPassed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');  // Default language is JavaScript

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        // Fetch question data by name (modify as needed based on your API)
        const response = await fetch(`http://localhost:5000/problems/${encodeURIComponent(name)}`);
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

  const handleLanguageChange = (e) => setLanguage(e.target.value);  // Handle language change

  const runCode = async () => {
    setLoading(true);
    setOutput('');
    setTestPassed(null);
    console.log('Running code...'); // Debugging: ensure the runCode function is called

    try {
      // Send the code to the backend compiler
      const response = await fetch('http://localhost:5000/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,          // Code to run
          input: question.Q_input,  // Use the question's input as test case input
          language: language  // Pass the selected language to the backend
        }),
      });

      const data = await response.json();
      console.log('Response data:', data); // Debugging: log the response from backend

      if (response.ok) {
        setOutput(data.output);  // The output from the compiler
        const isTestPassed = data.output.trim() === question.Q_output.trim(); // Check if output matches expected
        setTestPassed(isTestPassed);  // Set test case result (passed/failed)
      } else {
        console.error('Error running the code:', data.error);
        setOutput(`Error: ${data.error}`); // Show error in output
      }
    } catch (error) {
      console.error('Error:', error.message);
      setOutput(`Error: ${error.message}`); // Show error in output
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    console.log('Submitting the solution...');
    // Add logic for submitting the solution if needed
  };

  if (!question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-gray-200">
      <header className="bg-gray-800 text-white p-4 sticky top-0">
        <h1 className="text-xl font-bold">{question.Q_name}</h1>
        <span className="text-green-500">{question.Difficulty}</span>
      </header>

      <div className="container mx-auto p-4">
        <div className="bg-gray-800 p-4 rounded-lg shadow-md">
          <h2 className="text-2xl mb-4">Problem Description:</h2>
          <p className="text-gray-200">{question.Q_explanation}</p>

          <h3 className="text-xl mt-6">Example 1:</h3>
          <pre className="bg-gray-700 p-2 rounded">Input: nums = [2,7,11,15], target = 9</pre>
          <pre className="bg-gray-700 p-2 rounded">Output: [0,1]</pre>
        </div>

        <div className="flex mt-8">
          {/* Code Section */}
          <div className="bg-gray-800 w-2/3 p-4 rounded-lg shadow-md">
            <textarea
              className="bg-gray-700 w-full h-64 p-4 text-green-200 font-mono"
              value={code}
              onChange={handleInputChange}
              placeholder="Write your code here..."
            />
            <div className="mt-4 flex space-x-4">
              {/* Language Dropdown */}
              <select
                className="bg-gray-700 text-gray-200 p-2 rounded"
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

          {/* Testcase Section */}
          <div className="bg-gray-800 w-1/3 p-4 rounded-lg shadow-md ml-4">
            <h3 className="text-xl mb-4">Testcase:</h3>
            <div className="bg-gray-700 p-2 rounded">nums = [2, 7, 11, 15], target = 9</div>
            <div className="mt-2 bg-gray-700 p-2 rounded">Expected Output: [0, 1]</div>

            {/* Test Result */}
            {testPassed !== null && (
              <div
                className={`mt-6 p-4 rounded ${testPassed ? 'bg-green-500' : 'bg-red-500'}`}
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
      </div>
    </div>
  );
};

export default SolveProblem;
