import { useRef, useState } from "react";
import features from "../assets/features.png";
import roadmap from "../assets/roadmaps.png";
import compiler from "../assets/compiler.png";
import "./Home.css";
import lap3d from "../assets/3dlaptop.png";
import Button from "../common/Button.jsx";
import Magnet from "../common/Magnet.jsx";
import { motion } from "framer-motion";

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
    const scrollRef = useRef(null);

    return (
        <>
            {/* ---------- HERO SECTION ---------- */}
            <motion.div
                className="heroSection"
                ref={scrollRef}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <motion.h3
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="topBoxHead"
                >
                    Practice Your Coding Skills
                </motion.h3>

                <h1 className="welcome">
                    Welcome To <span className="high">Skill-Code </span>
                </h1>
                <h5 className="lower">Practice to Perfection</h5>

                <motion.div
                    className="img"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <img src={lap3d} alt="lap3d" />
                </motion.div>

                <div className="info">
                    <h5 className="infoHeading">
                        Build your coding future — Start Now
                    </h5>

                    <Magnet padding={70} disabled={false} magnetStrength={70}>
                        <div className="infoButtons">
                            <Button
                                type="button"
                                to="/Problems"
                                text="Start Coding"
                                className="btn infoProb"
                            />
                            <Button
                                type="button"
                                to="/signup"
                                text="Create a new Account"
                                className="btn infoSignup"
                            />
                        </div>
                    </Magnet>

                    <div className="links">
                        <a href="/compiler" className="scroll-link comp">
                            Try our online Compiler
                        </a>
                        <a href="/login" className="scroll-link">
                            Signin
                        </a>
                        <a href="#featuresSection" className="scroll-link">
                            Features
                        </a>
                    </div>
                </div>
            </motion.div>

            {/* ---------- FEATURES SECTION ---------- */}
            <motion.div
                className="featuresSection"
                id="featuresSection"
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
            >
                <h1 className="featureHead">
                    What makes <span className="high">Skill-Code</span> Different
                    <span className="high">?</span>
                </h1>

                <div className="featureBody">
                    <motion.div
                        className="imgSpace"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <motion.img
                            key={activeImg}
                            src={activeImg}
                            alt="features"
                            className="imgpos"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6 }}
                        />
                    </motion.div>

                    <div className="details">
                        {featuresArr.map((featurArr, index) => (
                            <motion.div
                                key={index}
                                className={`delBlock ${
                                    activeImg === featurArr.image ? "active" : ""
                                }`}
                                onMouseEnter={() => setActiveImg(featurArr.image)}
                                initial={{
                                    opacity: 0,
                                    x: index % 2 === 0 ? -80 : 80,
                                }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                viewport={{ once: true }}
                            >
                                <h3>{featurArr.title}</h3>
                                <p>{featurArr.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Home;
