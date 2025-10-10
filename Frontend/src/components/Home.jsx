import {useState} from "react";
import features from "../assets/features.png"
import roadmap from "../assets/roadmaps.png"
import compiler from "../assets/compiler.png"
import "./Home.css"
import lap3d from  "../assets/3dlaptop.png"
import Button from  "../common/Button.jsx"

const featuresArr = [
    {
        title: "Solve Most Asked Interview Questions",
        description:
            "Access a curated collection of real interview problems from top tech companies. Strengthen your problem-solving and coding confidence with structured practice.",
        image: features,
    },
    {
        title: "Built-in Online Compiler",
        description:
            "Write, run, and debug your code directly in your browser. No setup needed — our integrated compiler supports multiple programming languages so you can focus purely on logic and learning.",
        image: compiler,
    },
    {
        title: "Structured Learning Roadmaps",
        description:
            "Follow clear, goal-oriented paths designed by industry experts. From DSA to full-stack development — our roadmaps guide you step by step to master every skill efficiently.",
        image: roadmap,
    },
];

const Home = () => {
    const [activeImg, setActiveImg] = useState(roadmap);
  return (
      < >
          <div className="heroSection">
              <h3 className="topBoxHead">Practice Your Coding Skills</h3>
              <h1 className="welcome">Welcome To <span className={"high"}>Skill-Code </span></h1>
              <h5 className="lower">Practice to Perfection</h5>
              <div className="img">
                  <img src={lap3d} alt="lap3d" />
              </div>
              <div className="info">
                  <h5 className="infoHeading">
                      Build your coding future - Start Now
                  </h5>
                  <div className="infoButtons">
                  <Button type="button" to="/Problems" text="Start Coding" className="btn infoProb"/>
                  <Button type="button" to="/signup" text="Create a new Account" className="btn infoSignup"/>
                  </div>

                  <div className="links">


                      {/* Scrolls smoothly to section in Home page */}
                      <a href="/compiler" className={"scroll-link comp"}>Try our online Compiler</a>
                      <a href="/login" className={"scroll-link"}>Signin</a>
                      <a href="#featuresSection" className={"scroll-link"}> Features</a>


                  </div>


              </div>
          </div>

          <div className="featuresSection" id={"featuresSection"}>
              <h1 className="featureHead"> What makes <span className="high">Skill-Code</span> Diffrent <span className="high">?</span></h1>
              <div className="featureBody">
                  <div className="imgSpace">
                      <img src={activeImg} alt="fatures" className={"imgpos"} />
                  </div>
                  <div className="details">
                      {featuresArr.map((featurArr, index) => (
                          <div className={`delBlock ${activeImg === featurArr.image? "active":""}`} key={index}
                               onMouseEnter={()=> setActiveImg(featurArr.image)}>
                              <h3>{featurArr.title}</h3>
                              <p>{featurArr.description}</p>
                          </div>
                      ))}
                  </div>

              </div>
          </div>





      </>
  );
};

export default Home;
