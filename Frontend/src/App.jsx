 import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ClickSpark from "./common/ClickSpark.jsx";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import FloatingSymbol from './components/FloatingSymbols.jsx';
// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// Lazy load components
const Navbar = lazy(() => import('./components/Navbar'));
const Login = lazy(() => import('./components/Login'));
const Signup = lazy(() => import('./components/Signup'));
const Compiler = lazy(() => import('./components/Compiler'));
const ProblemSet = lazy(() => import('./components/ProblemSet'));
const SolveProblem = lazy(() => import('./components/SolveProblem'));
const CourseLayout = lazy(() => import('./components/CourseLayout'));
const Roadmaps = lazy(() => import('./components/Roadmap'));
const AddQuestion = lazy(() => import('./components/AddQuestion'));
const Profile = lazy(() => import('./components/Profile')); // Import Profile component
const Home = lazy(() => import('./components/Home'));
const Footer = lazy(() => import('./components/Footer'));
// const FloatingSymbols = () => lazy(() => import('./components/FloatingSymbols'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error caught in ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-message">Something went wrong. Please try again later.</div>;
    }
    return this.props.children;
  }
}

export default function App() {
  const textRef = useRef(null);

  // ScrollTrigger Effect for Text
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: textRef.current,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => {
        gsap.to(textRef.current, { opacity: 1, duration: 1, ease: 'power1.inOut' });
      },
      onLeave: () => {
        gsap.to(textRef.current, { opacity: 0, duration: 1, ease: 'power1.inOut' });
      },
    });

    // Cleanup on component unmount
    return () => trigger.kill();
  }, []);

  // Lid State Effect


  return (

      <ClickSpark

          sparkColor='#fff'

          sparkSize={10}

          sparkRadius={15}

          sparkCount={8}

          duration={400}

      >
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen text-white bg-black">
            <p>Loading...</p>
          </div>
        }
      >
        <ErrorBoundary>
          <div className="relative min-h-screen">

            {/* Shader Background */}
            {/* <ShaderBackground /> */}
              <FloatingSymbol />
            {/* Main Content */}
              <div className="flex flex-col min-h-screen">

                  <Navbar />

                  {/* Main content area grows and scrolls */}
                  <div className="flex-grow">
                      <Routes>
                          <Route path="/" element={<Home />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/signup" element={<Signup />} />
                          <Route path="/compiler" element={<Compiler />} />
                          <Route path="/Problems" element={<ProblemSet />} />
                          <Route path="/Problems/:name" element={<SolveProblem />} />
                          <Route path="/Courses" element={<CourseLayout />} />
                          <Route path="/roadmaps" element={<Roadmaps />} />
                          <Route path="/addquestion" element={<AddQuestion />} />
                          <Route path="/profile" element={<Profile />} />
                      </Routes>
                  </div>

                  {/* Footer stays at bottom always */}
                  <Footer />
              </div>

          </div>
        </ErrorBoundary>
      </Suspense>
    </Router>
      </ClickSpark>
  );
}
