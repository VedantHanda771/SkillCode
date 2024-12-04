import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const Compiler = () => {
    const [language, setLanguage] = useState('javascript');
    const [code, setCode] = useState('');
    const [output, setOutput] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    // Default code snippets for each language
    const defaultCode = {
        javascript: `console.log("Hello, World!");`,
        python: `# Python Code\nprint("Hello, World!")`,
        cpp: `// C++ Code\n#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}`,
        java: `// Java Code\npublic class code {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
    };

    // Monaco Editor language mapping
    const languageMapping = {
        javascript: 'javascript',
        python: 'python',
        cpp: 'cpp',
        java: 'java',
    };

    // Update code when the language changes
    useEffect(() => {
        setCode(defaultCode[language]);
    }, [language]);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setOutput('');
        setInputValue('');
    };

    const runCode = async () => {
        setLoading(true);
        setOutput('');

        try {
            const response = await fetch('http://localhost:5000/run', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language, code, input: inputValue }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Unknown error occurred.');
            }

            setOutput(data.output);
        } catch (error) {
            setOutput(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-transparent">
            <div className="bg-black bg-opacity-40 p-6 rounded-lg shadow-xl backdrop-blur-md w-full max-w-4xl">
                <h2
                    className="text-4xl font-semibold text-center text-white mb-6"
                    style={{
                        color: '#ffffff',
                        fontFamily: "'New Amsterdam', sans-serif",
                        fontWeight: 500,
                        fontStyle: 'normal',
                    }}
                >
                    Code Compiler
                </h2>

                <div className="mb-6">
                    <select
                        value={language}
                        onChange={handleLanguageChange}
                        className="w-full p-3 rounded-lg border-2 border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-indigo-500"
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>
                </div>

                <div className="mb-6" style={{ height: '400px' }}>
                    <Editor
                        height="100%"
                        language={languageMapping[language]} // Dynamically change language
                        value={code}
                        theme="vs-dark"
                        onChange={(value) => setCode(value)}
                    />
                </div>

                <div className="mb-6">
                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        rows="5"
                        placeholder="Enter input here (optional)"
                        className="w-full p-3 rounded-lg border-2 border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
                    />
                </div>

                <div className="mb-6">
                    <button
                        onClick={runCode}
                        disabled={loading}
                        className={`w-full p-3 rounded-lg text-white ${
                            loading ? 'bg-gray-600' : 'bg-indigo-500 hover:bg-indigo-600'
                        } focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50`}
                    >
                        {loading ? 'Running...' : 'Run Code'}
                    </button>
                </div>

                <div className="mt-8 p-4 border-2 border-gray-700 rounded-lg bg-gray-800 bg-opacity-50 backdrop-blur-md">
                    <h3 className="text-xl font-semibold text-white">Output:</h3>
                    <pre className="whitespace-pre-wrap text-white">{output}</pre>
                </div>
            </div>
        </div>
    );
};

export default Compiler;
