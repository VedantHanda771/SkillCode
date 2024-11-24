import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Lazy load components
const Laptop = lazy(() => import('./components/Laptop'));
const Navbar = lazy(() => import('./components/Navbar'));
const Text = lazy(() => import('./components/Text'));
const ShaderBackground = lazy(() => import('./components/ShaderBackground'));
const Content = lazy(() => import('./components/Content'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Compiler = lazy(() => import('./components/Compiler'));
const ProblemSet = lazy(() => import('./components/ProblemSet'));
const SolveProblem = lazy(() => import('./components/SolveProblem'));

// Lazy load the CourseLayout component
const CourseLayout = lazy(() => import('./components/CourseLayout'));

export default function App() {
  const textRef = useRef(null);
  const [isLidOpen, setIsLidOpen] = useState(false);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: textRef.current,
      onEnter: () => {
        gsap.to(textRef.current, { opacity: 0, duration: 1, ease: 'power1.inOut' });
      },
      onEnterBack: () => {
        gsap.to(textRef.current, { opacity: 1, duration: 1, ease: 'power1.inOut' });
      },
      onLeave: () => {
        gsap.to(textRef.current, { opacity: 0, duration: 1, ease: 'power1.inOut' });
      },
      onLeaveBack: () => {
        gsap.to(textRef.current, { opacity: 1, duration: 1, ease: 'power1.inOut' });
      },
    });

    return () => trigger.kill(); // Cleanup the specific ScrollTrigger
  }, []);

  useEffect(() => {
    gsap.to(textRef.current, {
      opacity: isLidOpen ? 0 : 1,
      duration: 1,
      ease: 'power1.inOut',
    });
  }, [isLidOpen]);

  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="relative min-h-screen">
          <ShaderBackground />
          <div className="relative z-10">
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Laptop onLidStateChange={setIsLidOpen} />
                    <div ref={textRef} className="text-white relative" style={{ height: '100px' }}>
                      <Text />
                    </div>
                    <Content />
                  </>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/compiler" element={<Compiler />} />
              <Route path="/problems" element={<ProblemSet />} />
              <Route path="/problems/:name" element={<SolveProblem />} />
              
              {/* Add Course Route */}
              <Route path="/courses" element={<CourseLayout />} />
            </Routes>
          </div>
        </div>
      </Suspense>
    </Router>
  );
}
