import React from "react";
import { motion } from "framer-motion";
import MagicRings from "../../Backgrounds/MagicRings";
import { GridScan } from "../../Backgrounds/GridScan";
import { Link } from "react-router-dom";
import Threads from "../../Backgrounds/Threads";
import Strands from "../../Backgrounds/Strands";

const steps = [
    { title: "Beginner", x: "10%", y: "70%" },
    { title: "Intermediate", x: "35%", y: "40%" },
    { title: "Advanced", x: "60%", y: "60%" },
    { title: "Pro", x: "85%", y: "25%" },
];

const Landing1 = () => {
    return (
        <div className="relative min-h-screen w-full overflow-hidden text-white z-0 bg-black">

            {/* Animated Background */}
           {/*  <div className="absolute inset-0 -z-10 opacity-80">
                <GridScan
                    sensitivity={0.55}
                    lineThickness={1}
                    linesColor="#2F293A"
                    gridScale={0.091}
                    scanColor="#FF9FFC"
                    scanOpacity={0.4}
                    enablePost
                    bloomIntensity={0.6}
                    chromaticAberration={0.002}
                    noiseIntensity={0.01}
                />
            </div> */}

           

            <div className="absolute inset-0 -z-10 opacity-80">
                <Strands
                    colors={["#F97316", "#7C3AED", "#06B6D4"]}
                    count={3}
                    speed={0.5}
                    amplitude={1}
                    waviness={1}
                    thickness={0.7}
                    glow={2.6}
                    taper={3}
                    spread={1}
                    intensity={0.6}
                    saturation={2}
                    opacity={1}
                    scale={1.5}
                    glass={false}
                    refraction={1}
                    dispersion={1}
                    glassSize={1}
                    hueShift={0}
                />
            </div>

            {/* 
            <div  className="absolute inset-0 -z-10 opacity-80 ">
                <Threads
                    amplitude={1}
                    distance={0.2}
                    enableMouseInteraction
                    sensitivity={0.55}
                    lineThickness={1}
                    linesColor="#2F293A"
                    gridScale={0.1}
                    scanColor="#FF9FFC"
                    scanOpacity={0.4}
                    enablePost
                    bloomIntensity={0.6}
                    chromaticAberration={0.002}
                    noiseIntensity={0.01}
                />
            </div> */}
            {/* Navbar */}
            <nav className="relative z-20 flex items-center justify-between px-8 py-6">
                <h1 className="text-2xl font-bold tracking-wide">
                    TechMastery
                </h1>

                <div className="hidden md:flex gap-8 text-gray-300">
                    <Link to="/">Home</Link>
                    <Link to="/courses">Courses</Link>
                    <Link to="/roadmaps">Roadmaps</Link>
                    <Link to="/contact">Contact</Link>
                </div>

                <button className="bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-700 transition">
                    <Link to="/signup">Start Free</Link>
                </button>
            </nav>

            {/* Hero Section */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pt-10 pb-20">
                <div className="grid md:grid-cols-2 gap-14 items-center min-h-[85vh]">

                    {/* Left Content */}
                    <div>
                        <p className="text-blue-400 font-semibold mb-4">
                            Learn Smarter. Grow Faster.
                        </p>

                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Master Any <br />
                            Tech Stack <br />
                            From Zero 🚀
                        </h1>

                        <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-xl">
                            Search React, Python, AI, JavaScript, Data Structures and more.
                            Follow clear roadmaps from beginner to pro with projects,
                            practice and guided learning.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Search React, Python, AI..."
                                className="px-5 py-4 rounded-xl bg-white/10 border border-white/20 outline-none w-full sm:w-[320px]"
                            />

                            <button className="px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 transition font-semibold">
                                Search
                            </button>
                        </div>

                        <div className="mt-8 flex gap-8 text-sm text-gray-400">
                            <span>10K+ Students</span>
                            <span>200+ Roadmaps</span>
                            <span>100% Free Start</span>
                        </div>
                    </div>

                    {/* Right Animation */}
                    <div className="relative h-[520px] rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">

                        {/* Path SVG */}
                        <svg
                            className="absolute inset-0 w-full h-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <path
                                d="M10 70 C20 20, 40 20, 35 40 S55 80, 60 60 S75 15, 85 25"
                                fill="none"
                                stroke="rgba(255,255,255,0.15)"
                                strokeWidth="2"
                                strokeDasharray="4 4"
                            />
                        </svg>

                        {/* Step Points */}
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                className="absolute"
                                style={{
                                    left: step.x,
                                    top: step.y,
                                    transform: "translate(-50%, -50%)",
                                }}
                            >
                                <div className="w-5 h-5 rounded-full bg-blue-500 shadow-[0_0_25px_#3b82f6]" />
                                <p className="mt-3 text-sm text-white whitespace-nowrap">
                                    {step.title}
                                </p>
                            </div>
                        ))}

                        {/* Moving Student */}
                        <motion.div
                            className="absolute text-4xl"
                            animate={{
                                offsetDistance: [
                                    "0%",
                                    "33%",
                                    "66%",
                                    "100%",
                                ],
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            style={{
                                offsetPath:
                                    "path('M10 70 C20 20, 40 20, 35 40 S55 80, 60 60 S75 15, 85 25')",
                            }}
                        >
                            👨‍🎓
                        </motion.div>

                        {/* Floating Text */}
                        <div className="absolute bottom-8 left-8 right-8 p-5 rounded-2xl bg-black/40 border border-white/10">
                            <p className="text-gray-300 text-sm">
                                Every learner starts somewhere.
                            </p>
                            <h3 className="text-xl font-semibold mt-1">
                                Your journey to mastery begins today.
                            </h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
                <div className="grid md:grid-cols-3 gap-6">

                    {[
                        "Structured Learning Paths",
                        "Projects + Practice",
                        "Interview Ready Skills",
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-lg"
                        >
                            <h3 className="text-xl font-semibold mb-3">
                                {item}
                            </h3>

                            <p className="text-gray-400 leading-relaxed">
                                Learn step-by-step with clarity and real progress.
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Landing1;