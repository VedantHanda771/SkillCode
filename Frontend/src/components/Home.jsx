import React from "react";
import { Parallax, ParallaxLayer } from '@react-spring/parallax';

const Home = () => {
  const alignCenter = { display: 'flex', alignItems: 'center' };

  return (
    <div style={{
      position: 'absolute',
      width: '100%',
      height: '100vh',
      paddingTop: '10px',
      
      
      // overflow: 'hidden'
    }}>

      <Parallax pages={3} style={{ top: 0, left: 0 }}>
        {/* Welcome Heading */}
        <ParallaxLayer offset={0} speed={0.5} style={{ ...alignCenter, justifyContent: 'center' , flexDirection: 'column',
         }}>
          <img src="https://i.ibb.co/QB0rB2X/pngaaa-com-1523782.png" alt="" />
          <h1 style={{
            fontFamily: "'New Amsterdam', sans-serif",
            fontSize: "5.2rem",
            color: "white"
          }}>Welcome to SkillCode</h1>
          <h3 style={{ color: "black" , fontFamily: "'New Amsterdam', sans-serif", fontSize: "2rem" }}>Your journey to mastering coding starts here</h3>
        </ParallaxLayer>

        {/* Sticky Card */}
        <ParallaxLayer sticky={{ start: .7, end: 1.6 }} style={{ ...alignCenter, justifyContent: 'flex-start', zIndex: -1  }}>
          <div style={{
            background: 'transparent',
            fontFamily: "'New Amsterdam', sans-serif",
            fontSize: "7rem",
            color: "white",
            width: '50%',
            marginLeft: '10px'
          }}>
            <p style={{ margin: 0}}>Why Skill Code?</p>
          </div>
        </ParallaxLayer>

        {/* Floating Card 1 */}
        <ParallaxLayer offset={1} speed={.1} style={{ ...alignCenter, justifyContent: 'flex-end', flexDirection: 'row' }}>
          <div style={{
            fontFamily: "'New Amsterdam', sans-serif",
            color: 'white',
            marginRight: '40px',
            display: 'flex',
            width: '50%',
            gap: '20px',
          }}>
            <div style={{ background: 'transparent', width: '50%', borderRadius: '16px', padding: '20px 30px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' ,
               textAlign: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center',
               flexDirection: 'column',}}>
              <h1 style={{ margin: 0 , width: '110%',fontSize:'2.2rem' }}>🚀 Structured Learning Roadmaps</h1>
              <p style={{ margin: 0 , width: '70%', marginTop: '10px', fontSize: '1.2rem' }}>Navigate your coding journey with clear, goal-oriented roadmaps—no more confusion about what to learn next.</p>
              <button style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#fcb045',
                 color: 'white', cursor: 'pointer'}}
                  onClick={() => window.location.href = '/roadmaps'}>Get Started</button>
            </div>
            <div style={{ background: 'transparent', width: '50%', borderRadius: '16px', padding: '20px 30px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' ,
               textAlign: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center',
               flexDirection: 'column',}}>
              <h1 style={{ margin: 0 , width: '100%',fontSize:'2.2rem' }}>🧩 Solve Coding Questions & Challenges</h1>
              <p style={{ margin: 0 , width: '70%', marginTop: '10px', fontSize: '1.2rem' }}>Practice real-world problems, build logic, and prepare for interviews with our ever-expanding coding question bank.</p>
              <button style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#fcb045',
                 color: 'white', cursor: 'pointer'}}
                  onClick={() => window.location.href = '/Problems'}>Get Started</button>
            </div>
          </div>
        </ParallaxLayer>

        {/* Floating Card 2 */}
        <ParallaxLayer offset={1.7} speed={.1} style={{ ...alignCenter, justifyContent: 'flex-end', flexDirection: 'row' }}>
          <div style={{
            fontFamily: "'New Amsterdam', sans-serif",
            color: 'white',
            marginRight: '40px',
            display: 'flex',
            width: '50%',
            gap: '20px',
          }}>
            <div style={{ background: 'transparent', width: '50%', borderRadius: '16px', padding: '20px 30px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' ,
               textAlign: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center',
               flexDirection: 'column',}}>
              <h1 style={{ margin: 0 , width: '110%',fontSize:'2.2rem' }}>💻 Built-in Online Compiler</h1>
              <p style={{ margin: 0 , width: '70%', marginTop: '10px', fontSize: '1.2rem' }}>No setup needed! Write, test, and debug your code right in your browser with our fast and powerful online compiler.</p>
              <button style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#fcb045',
                 color: 'white', cursor: 'pointer'}}
                  onClick={() => window.location.href = '/compiler'}>Get Started</button>
            </div>
            <div style={{ background: 'transparent', width: '50%', borderRadius: '16px', padding: '20px 30px', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)' ,
               textAlign: 'center', alignItems: 'center', display: 'flex', justifyContent: 'center',
               flexDirection: 'column', }}>
              <h1 style={{ margin: 0 , width: '100%',fontSize:'2.2rem' }}>📚 Smart Courses Tailored to You</h1>
              <p style={{ margin: 0 , width: '70%', marginTop: '10px', fontSize: '1.2rem' }}>Get access to premium courses that match your skill level and goals—pay only for what you need.</p>
              <button style={{ marginTop: '10px', padding: '10px 20px', borderRadius: '8px', border: 'none', background: '#fcb045',
                 color: 'white', cursor: 'pointer'}}
                  onClick={() => window.location.href = '/Courses'}>Get Started</button>
            </div>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  );
};

export default Home;
