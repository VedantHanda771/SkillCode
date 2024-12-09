import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';

const SolveProblem = () => {
  const { name } = useParams();
  const [question, setQuestion] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [testPassed, setTestPassed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('javascript');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch problem details
  useEffect(() => {
    if (!name) return;

    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5000/problems/${encodeURIComponent(name)}`);
        const data = await response.json();
        if (response.ok) {
          setQuestion(data);
        } else {
          setError('Failed to fetch question');
        }
      } catch (err) {
        setError('Error fetching question');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [name]);

  // Run the code
  const runCode = async () => {
    setLoading(true);
    setOutput('');
    setError('');
    setTestPassed(null);

    try {
      const response = await fetch('http://localhost:5000/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Ensure token is always included
        },
        body: JSON.stringify({
          code,
          input: question?.Q_input,
          language,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutput(data.output);
        const isTestPassed = data.output.trim() === question.Q_output.trim();
        setTestPassed(isTestPassed);
      } else {
        setError(data.error || 'Unknown error');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

// const handleSubmit = async () => {
//   setLoading(true);
//   setError('');
//   setOutput('');
//   setTestPassed(null);

//   const user = JSON.parse(localStorage.getItem('user')); // Parse the stored user object
//   const userId = user?._id; // Extract userId or adjust based on your user object structure
//   const questionId = question?.Q_id;

//   console.log("Submitting code with:", { userId, questionId, code }); // Log to check data

//   try {
//     const response = await fetch('http://localhost:5000/submitCode', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Ensure authToken is included
//       },
//       body: JSON.stringify({
//         userId,
//         questionId,
//         code,
//       }),
//     });

//     const data = await response.json();

//     if (response.ok) {
//       alert('Code saved successfully!');
//     } else {
//       console.error('Backend Error:', data); // Log backend error response
//       setError(data.message || 'Error saving the code');
//     }
//   } catch (err) {
//     console.error('Request Error:', err);
//     setError('Error submitting the code');
//   } finally {
//     setLoading(false);
//   }
// };

  
  
  
  // Handle back navigation
  const handleBackToProblemList = () => {
    navigate('/problems');
  };

  if (loading || !question) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-transparent min-h-screen text-gray-200 flex flex-col items-center">
      <header className="bg-gray-800 bg-opacity-60 text-white p-4 sticky top-0 w-full text-center">
        <h1 className="text-2xl font-bold">{question.Q_name}</h1>
        <span className="text-green-500">{question.Difficulty}</span>
      </header>

      <div className="container mx-auto p-4 w-full max-w-6xl">
        <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg shadow-lg backdrop-blur-lg">
          <h2 className="text-2xl mb-4 text-center font-semibold">Problem Description</h2>
          <p className="text-gray-200">{question.Q_explanation}</p>
        </div>

        <div className="flex mt-8 space-x-6">
          <div className="bg-gray-800 bg-opacity-50 w-2/3 p-4 rounded-lg shadow-lg backdrop-blur-lg">
            <Editor
              height="500px"
              language={language}
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                lineNumbers: 'on',
              }}
            />
            <div className="mt-4 flex space-x-4">
              <select
                className="bg-gray-700 bg-opacity-60 text-gray-200 p-2 rounded"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
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
              {/* <button
                className="bg-green-500 hover:bg-green-600 px-4 py-2 text-white rounded"
                onClick={handleSubmit}
                disabled={loading || !code}
              >
                Submit
              </button> */}
            </div>
          </div>

          <div className="bg-gray-800 bg-opacity-50 w-1/3 p-4 rounded-lg shadow-lg backdrop-blur-lg">
            <h3 className="text-xl mb-4">Testcase:</h3>
            <div className="bg-gray-700 bg-opacity-30 p-2 rounded">{question.Q_input}</div>
            <div className="mt-2 bg-gray-700 bg-opacity-30 p-2 rounded">
              Expected Output: <span className="text-green-500">{question.Q_output}</span>
            </div>
            {output && (
              <div className="mt-4">
                <h4 className="text-xl">Output:</h4>
                <pre className="bg-gray-700 p-4 text-white">{output}</pre>
                {testPassed === null ? null : (
                  <p className={`mt-2 ${testPassed ? 'text-green-500' : 'text-red-500'}`}>
                    {testPassed ? 'Test Passed!' : 'Test Failed'}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        <button
          className="mt-8 bg-gray-700 text-white px-6 py-2 rounded-lg"
          onClick={handleBackToProblemList}
        >
          Back to Problems
        </button>
      </div>
    </div>
  );
};

export default SolveProblem;
