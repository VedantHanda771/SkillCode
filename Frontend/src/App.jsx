import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Laptop from './components/Laptop';
import Navbar from './components/Navbar';
import Text from './components/Text';
import ShaderBackground from './components/ShaderBackground';
import Content from './components/Content';
import Login from './components/Login';
import Signup from './components/Signup';
import Compiler from './components/Compiler';
import ProblemSet from './components/ProblemSet';
import SolveProblem from './components/SolveProblem';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const textRef = useRef(null);
  const [isLidOpen, setIsLidOpen] = useState(false);

  // ScrollTrigger animation for Text component
  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      trigger: textRef.current,
      start: 'top top',
      end: 'bottom top',
      onEnter: () => {
        gsap.to(textRef.current, { opacity: 0, duration: 1, ease: 'power1.inOut' });
      },
      onLeaveBack: () => {
        gsap.to(textRef.current, { opacity: 1, duration: 1, ease: 'power1.inOut' });
      },
    });

    // Cleanup on component unmount
    return () => scrollTrigger.kill();
  }, []);

  // GSAP effect for lid open/close animation
  useEffect(() => {
    gsap.to(textRef.current, {
      opacity: isLidOpen ? 0 : 1,
      duration: 1,
      ease: 'power1.inOut',
    });
  }, [isLidOpen]);

  return (
    <Router>
      <div className="relative min-h-screen">
        <ShaderBackground /> {/* Background Shader */}
        <div className="relative z-10">
          <Navbar /> {/* Navigation Bar */}

          <Routes>
            {/* Home Route */}
            <Route
              path="/"
              element={
                <>
                  <Laptop onLidStateChange={setIsLidOpen} />
                  <div ref={textRef} className="text-white relative" style={{ height: '100px' }}>
                    <Text /> {/* Text component */}
                  </div>
                  <Content /> {/* Other content */}
                </>
              }
            />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Compiler Route */}
            <Route path="/compiler" element={<Compiler />} />

            {/* Problem Set Route */}
            <Route path="/problems" element={<ProblemSet />} />

            {/* Solve Problem Route with problem name */}
            <Route path="/problems/:name" element={<SolveProblem />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
