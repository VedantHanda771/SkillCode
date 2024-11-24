import React from "react";

// Sample courses data from your MongoDB collection
const coursesData = [
  {
    Course_id: "C101",
    Course_name: "Introduction to Algorithms",
    Course_price: 500,
    Course_description:
      "Learn about algorithm design, complexity analysis, and problem-solving techniques. This course covers essential concepts like sorting, searching, and graph algorithms.",
    badges: [
      { text: "25 hours", color: "bg-blue-500" },
      { text: "Medium", color: "bg-yellow-500" },
    ],
  },
  {
    Course_id: "C102",
    Course_name: "Machine Learning Basics",
    Course_price: 800,
    Course_description:
      "Understand the basics of machine learning, including supervised and unsupervised learning, neural networks, and model evaluation techniques.",
    badges: [
      { text: "25 hours", color: "bg-blue-500" },
      { text: "Hard", color: "bg-red-500" },
    ],
  },
  {
    Course_id: "C103",
    Course_name: "Web Development Fundamentals",
    Course_price: 600,
    Course_description:
      "Learn how to create responsive websites using HTML, CSS, and JavaScript. Build interactive and visually appealing web pages.",
    badges: [
      { text: "20 hours", color: "bg-blue-500" },
      { text: "Beginner", color: "bg-green-500" },
    ],
  },
  {
    Course_id: "C104",
    Course_name: "Database Management Systems",
    Course_price: 700,
    Course_description:
      "Explore relational databases, SQL, and database design. Understand how to store, retrieve, and manage data efficiently.",
    badges: [
      { text: "30 hours", color: "bg-blue-500" },
      { text: "Medium", color: "bg-yellow-500" },
    ],
  },
  {
    Course_id: "C105",
    Course_name: "Introduction to Cloud Computing",
    Course_price: 750,
    Course_description:
      "Gain an understanding of cloud computing concepts, deployment models, and services such as AWS, Azure, and Google Cloud.",
    badges: [
      { text: "40 hours", color: "bg-blue-500" },
      { text: "Advanced", color: "bg-red-500" },
    ],
  },
];

const CourseCard = ({ Course_name, Course_description, badges, Course_price }) => (
  <div className="rounded-lg shadow-lg p-6 text-white bg-opacity-10 backdrop-blur-md border border-white border-opacity-20">
    <h3 className="font-bold text-lg">{Course_name}</h3>
    <p className="text-sm mt-2">{Course_description}</p>
    <div className="flex gap-2 mt-4">
      {badges &&
        badges.map((badge, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded text-xs text-white ${badge.color}`}
          >
            {badge.text}
          </span>
        ))}
    </div>
    <div className="mt-4 flex justify-between items-center">
      <span className="text-lg font-semibold">${Course_price}</span>
      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
        Buy Now
      </button>
    </div>
  </div>
);

const CourseLayout = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-transparent p-6">
      {/* Header */}
      <div className="flex justify-center mb-6 w-full">
        <button className="bg-white text-black font-semibold py-2 px-4 rounded-l">
          Courses
        </button>
      </div>

      {/* Courses Section */}
      <section className="bg-transparent rounded-lg shadow-lg p-8 w-full max-w-screen-lg">
        <h2 className="text-2xl font-bold text-white">Courses</h2>
        <p className="text-gray-400 mt-2">
          Explore our diverse courses ranging from beginner to advanced topics in programming, cloud computing, and more.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {coursesData.map((course, index) => (
            <CourseCard key={index} {...course} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default CourseLayout;
