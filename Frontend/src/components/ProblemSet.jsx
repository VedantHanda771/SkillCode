import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


function ProblemSet() {
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await fetch('http://localhost:5000/problems');
                const data = await response.json();
                if (response.ok) {
                    setQuestions(data);
                } else {
                    setError(data.message);
                }
            } catch (err) {
                setError('Failed to fetch questions');
            }
        };

        fetchQuestions();
    }, []);

    return (
        <div className="bg-transparent text-gray-200 min-h-screen flex flex-col items-center justify-center">
            {/* Header */}
            <header className="bg-transparent p-4 w-full text-center mt-10">
                <h1
                    className="text-5xl font-bold"
                    style={{
                        color: "#ffffff", 
                        fontFamily: "'New Amsterdam', sans-serif", 
                        fontWeight: 500,
                        fontStyle: "normal"
                    }}
                >
                    Problem Set
                </h1>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex justify-center items-center p-4">
                <div className="bg-white bg-opacity-20 backdrop-blur-lg p-6 rounded-lg shadow-lg w-full max-w-4xl mb-56">
                    {error && <p className="text-red-500">{error}</p>}
                    <div className="overflow-y-auto max-h-96">
                        <table className="w-full text-left border-collapse">
                            <thead className="border-b border-gray-700">
                                <tr>
                                    <th className="p-2">Problem Name</th>
                                    <th className="p-2">Solved</th>
                                    <th className="p-2">Difficulty</th>
                                    <th className="p-2">Types of Question</th>
                                </tr>
                            </thead>
                            <tbody>
                                {questions.length > 0 ? (
                                    questions.map((question) => (
                                        <tr
                                            key={question._id}
                                            className="hover:bg-black transition-all border-b border-gray-700"
                                        >
                                            <td className="p-2">
                                                <Link to={`/problems/${question.Q_name}`} className="text-white hover:underline">
                                                    {question.Q_name}
                                                </Link>
                                            </td>
                                            <td className="p-2 text-center">
                                                {question.Solved === 'YES' ? (
                                                    <span className="text-green-500">✔</span>
                                                ) : (
                                                    <span className="text-gray-500">✖</span>
                                                )}
                                            </td>
                                            <td className="p-2">
                                                {question.Difficulty === 'Easy' && (
                                                    <span className="text-green-500">Easy</span>
                                                )}
                                                {question.Difficulty === 'Medium' && (
                                                    <span className="text-yellow-500">Medium</span>
                                                )}
                                                {question.Difficulty === 'Hard' && (
                                                    <span className="text-red-500">Hard</span>
                                                )}
                                            </td>
                                            <td className="p-2">
                                                {question.TypeOfQues || 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="p-4 text-center">
                                            No questions found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default ProblemSet;
