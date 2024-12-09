import React, { useState } from "react";

// Sample roadmaps data with pdfUrl added
const roadmapsData = [
  {
    id: "R101",
    title: "Frontend Developer Roadmap",
    description:
      "Learn how to become a frontend developer, focusing on HTML, CSS, JavaScript, and modern frameworks like React.",
    details:
      "This roadmap includes HTML, CSS, JavaScript, React, responsive design, and performance optimization.",
    badges: [
      { text: "Beginner to Intermediate", color: "bg-green-500" },
      { text: "3 months", color: "bg-blue-500" },
    ],
    pdfUrl: "/frontend.pdf", // Add the PDF URL here
  },
  {
    id: "R102",
    title: "Backend Developer Roadmap",
    description:
      "Learn how to build the backend of applications, including databases, APIs, and server-side technologies.",
    details:
      "Start with Node.js, Express.js, databases like MongoDB, and learn about server-side scripting, API development, and security.",
    badges: [
      { text: "Intermediate to Advanced", color: "bg-red-500" },
      { text: "6 months", color: "bg-blue-500" },
    ],
    pdfUrl: "/backend.pdf", // Add the PDF URL here
  },
  {
    id: "R103",
    title: "Full Stack Developer Roadmap",
    description:
      "Become a full-stack developer by mastering both frontend and backend technologies.",
    details:
      "This roadmap includes HTML, CSS, JavaScript, React for frontend, Node.js, Express.js, and MongoDB for backend.",
    badges: [
      { text: "Beginner to Advanced", color: "bg-yellow-500" },
      { text: "12 months", color: "bg-blue-500" },
    ],
    pdfUrl: "/full-stack.pdf", // Add the PDF URL here
  },
];

const RoadmapCard = ({ title, description, badges, onClick }) => (
  <div
    className="rounded-lg shadow-lg p-6 text-white bg-opacity-30 backdrop-blur-md border border-white border-opacity-30 cursor-pointer hover:scale-105 transform transition"
    onClick={onClick}
  >
    <h3 className="font-bold text-lg">{title}</h3>
    <p className="text-sm mt-2">{description}</p>
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
  </div>
);

const RoadmapLayout = () => {
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);

  const openModal = (roadmap) => {
    setSelectedRoadmap(roadmap);
  };

  const closeModal = () => {
    setSelectedRoadmap(null);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-transparent p-6">
      {/* Header */}
      <div className="flex justify-center mb-6 w-full">
        <h2 className="text-3xl font-bold text-white">Roadmaps</h2>
      </div>

      {/* Roadmaps Section */}
      <section className="bg-transparent rounded-lg shadow-lg p-8 w-full max-w-screen-lg">
        <p className="text-gray-400 mt-2 mb-6">
          Explore various career paths and roadmaps for different roles in technology. From beginner to expert, we've got you covered.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {roadmapsData.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              {...roadmap}
              onClick={() => openModal(roadmap)}
            />
          ))}
        </div>
      </section>

      {/* Modal to display the selected roadmap PDF */}
      {selectedRoadmap && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white bg-opacity-15 backdrop-blur-md p-8 rounded-lg w-11/12 max-w-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-white">{selectedRoadmap.title}</h3>
            <p className="text-white mt-4">{selectedRoadmap.details}</p>
            <div className="flex gap-2 mt-4">
              {selectedRoadmap.badges.map((badge, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-xs text-white ${badge.color}`}
                >
                  {badge.text}
                </span>
              ))}
            </div>

            {/* Embed PDF Viewer */}
            <div className="mt-6">
              <iframe
                src={selectedRoadmap.pdfUrl}
                width="100%"
                height="600px"
                title={selectedRoadmap.title}
                frameBorder="0"
              ></iframe>
            </div>

            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoadmapLayout;
