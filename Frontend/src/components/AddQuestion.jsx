import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate for navigation
// import '../App.css'; // Link to your CSS file

const AddQuestion = () => {
  const [formData, setFormData] = useState({
    Q_name: '',
    Q_explation: '',
    Q_input: '',
    Q_output: '',
    TypeOfQues: '',
    Company_name: '',
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // To redirect after success

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/admin/addquestion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `Question added successfully!` });
        // Redirect after success
        setTimeout(() => {
          navigate('/questions'); // Navigates to the questions list
        }, 1500);
      } else {
        setMessage({ type: 'error', text: result.error || 'Something went wrong' });
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
        onSubmit={handleAddQuestion}
        className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg shadow-lg border border-white border-opacity-10 p-6 w-full max-w-md"
      >
        <h3 className="text-white text-3xl font-medium text-center">Add Question</h3>

        {/* Question Name Input */}
        <label htmlFor="Q_name" className="block text-white mt-6 font-medium">
          Question Name
        </label>
        <input
          type="text"
          id="Q_name"
          name="Q_name"
          value={formData.Q_name}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter the question name"
          required
          aria-required="true"
        />

        {/* Explanation Input */}
        <label htmlFor="Q_explation" className="block text-white mt-4 font-medium">
          Explanation
        </label>
        <textarea
          id="Q_explation"
          name="Q_explation"
          value={formData.Q_explation}
          onChange={handleChange}
          className="block w-full bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Explain the question"
          rows="3"
          required
          aria-required="true"
        />

        {/* Input Format */}
        <label htmlFor="Q_input" className="block text-white mt-4 font-medium">
          Input Format
        </label>
        <textarea
          id="Q_input"
          name="Q_input"
          value={formData.Q_input}
          onChange={handleChange}
          className="block w-full bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Provide input format"
          rows="3"
          required
          aria-required="true"
        />

        {/* Output Format */}
        <label htmlFor="Q_output" className="block text-white mt-4 font-medium">
          Output Format
        </label>
        <textarea
          id="Q_output"
          name="Q_output"
          value={formData.Q_output}
          onChange={handleChange}
          className="block w-full bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Provide output format"
          rows="3"
          required
          aria-required="true"
        />

        {/* Question Type */}
        <label htmlFor="TypeOfQues" className="block text-white mt-4 font-medium">
          Question Type
        </label>
        <input
          type="text"
          id="TypeOfQues"
          name="TypeOfQues"
          value={formData.TypeOfQues}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter the question type"
          required
          aria-required="true"
        />

        {/* Company Name */}
        <label htmlFor="Company_name" className="block text-white mt-4 font-medium">
          Company Name
        </label>
        <input
          type="text"
          id="Company_name"
          name="Company_name"
          value={formData.Company_name}
          onChange={handleChange}
          className="block w-full h-[50px] bg-transparent text-white border-b border-white border-opacity-50 rounded-md p-2 mt-2 placeholder-gray-300 focus:outline-none focus:ring focus:ring-blue-500"
          placeholder="Enter the company name"
          required
          aria-required="true"
        />

        {/* Submit Button */}
        <button
          type="submit"
          className={`mt-6 w-full h-[50px] bg-white text-[#080710] rounded-md font-semibold ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Adding Question...' : 'Add Question'}
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

        {/* Link to Question List */}
        <div className="mt-[30px] text-center">
          <p className="text-gray-400">
            Want to go back?{' '}
            <Link to="/questions" className="text-blue-500 hover:underline">
              View Questions
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default AddQuestion;
