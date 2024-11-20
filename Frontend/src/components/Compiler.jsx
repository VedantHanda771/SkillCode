import React, { useState, useEffect } from 'react';

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

    // Update code when the language changes
    useEffect(() => {
        setCode(defaultCode[language]);
    }, [language]);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setOutput('');
        setInputValue('');
    };

    const handleCodeChange = (e) => setCode(e.target.value);
    const handleInputChange = (e) => setInputValue(e.target.value);

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
        <div className="max-w-3xl mx-auto p-4 text-white style={{ backgroundColor: 'transparent' }}">
            <h2 className="text-2xl font-semibold mb-4">Code Compiler</h2>
            <div className="mb-4">
                <select
                    value={language}
                    onChange={handleLanguageChange}
                    className="border border-gray-300 p-2 rounded bg-gray-700 text-white w-full"
                >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="cpp">C++</option>
                    <option value="java">Java</option>
                </select>
            </div>
            <div className="mb-4">
                <textarea
                    value={code}
                    onChange={handleCodeChange}
                    rows="10"
                    className="w-full border border-gray-300 p-2 rounded bg-gray-700 text-white"
                />
            </div>
            <div className="mb-4">
                <textarea
                    value={inputValue}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Enter input here (optional)"
                    className="w-full border border-gray-300 p-2 rounded bg-gray-700 text-white placeholder-gray-400"
                />
            </div>
            <div className="mb-4">
                <button
                    onClick={runCode}
                    disabled={loading}
                    className={`bg-blue-500 text-white p-2 rounded w-full ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Running...' : 'Run Code'}
                </button>
            </div>
            <div className="output-area border border-gray-300 p-4 rounded bg-gray-700">
                <h3 className="text-xl font-semibold">Output:</h3>
                <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
        </div>
    );
};

export default Compiler;
