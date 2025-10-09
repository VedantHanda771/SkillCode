import React from "react";
import "./Home.css"
import lap3d from  "../assets/3dlaptop.png"
import Button from  "../common/Button.jsx"
const Home = () => {

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

              </div>
          </div>





      </>
  );
};

export default Home;
