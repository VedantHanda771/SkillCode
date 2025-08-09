import React, { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugin
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
const CourseLayout = lazy(() => import('./components/CourseLayout'));
const Roadmaps = lazy(() => import('./components/Roadmap'));
const AddQuestion = lazy(() => import('./components/AddQuestion'));
const Profile = lazy(() => import('./components/Profile')); // Import Profile component
const Home = lazy(() => import('./components/Home'));

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
  const [isLidOpen, setIsLidOpen] = useState(false);

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
  useEffect(() => {
    gsap.to(textRef.current, {
      opacity: isLidOpen ? 0 : 1,
      duration: 1,
      ease: 'power1.inOut',
    });
  }, [isLidOpen]);

  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen text-white bg-black">
            <p>Loading...</p>
          </div>
        }
      >
        <ErrorBoundary>
          <div className="relative min-h-screen"
     style={{ 
        background: '#03001e',  /* fallback for old browsers */
background: '-webkit-linear-gradient(to left, #fdeff9, #ec38bc, #7303c0, #03001e)',  /* Chrome 10-25, Safari 5.1-6 */
background: 'linear-gradient(to left, #fdeff9, #ec38bc, #7303c0, #03001e)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
     }}>
            {/* Shader Background */}
            {/* <ShaderBackground /> */}

            {/* Main Content */}
            <div className="relative z-10">
              <Navbar />
              <Routes>
                {/* Home Route */}
                <Route
                  path="/"
                  element={
                    // <>
                    //   <Laptop onLidStateChange={setIsLidOpen} />
                    //   <div
                    //     ref={textRef}
                    //     className="text-white text-center p-4"
                    //     style={{ opacity: 1, transition: 'opacity 0.5s ease' }}
                    //   >
                    //     <Text />
                    //   </div>
                    //   <Content />
                    
                    // </>
  
                    
                    <Home />
                    
                    
                    
                  }
                />

                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />

                {/* Compiler & Problems Routes */}
                <Route path="/compiler" element={<Compiler />} />
                <Route path="/Problems" element={<ProblemSet />} />
                <Route path="/Problems/:name" element={<SolveProblem />} />

                {/* Additional Features */}
                <Route path="/Courses" element={<CourseLayout />} />
                <Route path="/roadmaps" element={<Roadmaps />} />
                <Route path="/addquestion" element={<AddQuestion />} />

                {/* Profile Route */}
                <Route path="/profile" element={<Profile />} /> {/* Add profile route */}
              </Routes>
            </div>
          </div>
        </ErrorBoundary>
      </Suspense>
    </Router>
  );
}
