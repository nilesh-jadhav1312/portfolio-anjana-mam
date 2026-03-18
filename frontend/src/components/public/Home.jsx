import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import homeImage from "../../assets/home.jpg";

const Typewriter = ({ text, delay = 100 }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return (
    <span>
      {currentText}
      <span className="animate-pulse">|</span>
    </span>
  );
};

const Home = ({ profileData }) => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative bg-dark-base overflow-hidden px-4 md:px-10"
    >
      {/* Subtle background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#857567] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#a99888] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="z-10 w-full max-w-7xl pt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text Section / Left Column */}
        <div className="text-center lg:text-left flex flex-col justify-center order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-[#a99888] uppercase tracking-[0.3em] font-medium mb-4 text-sm md:text-base cursor-default"
          >
            Welcome to my portfolio
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-light-text mb-6 tracking-tight leading-tight"
          >
            {profileData?.name || (
              <Typewriter text="ANJANA R ARAKERIMATH" delay={120} />
            )}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="text-xl md:text-2xl text-light-text font-medium mb-10 h-8"
          >
            {profileData?.subtitle ||
              "Associate Professor "}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
          >
            <Link
              to="/research"
              className="px-8 py-4 bg-[#857567] text-white rounded-full font-medium tracking-wide hover:bg-[#a99888] hover:shadow-[0_0_20px_rgba(133,117,103,0.4)] transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              View Research
            </Link>
            <a
              href="#contact"
              className="px-8 py-4 bg-transparent border-2 border-[#857567] text-light-text rounded-full font-medium tracking-wide hover:bg-[#857567]/10 transition-all duration-300 transform hover:-translate-y-1 text-center"
            >
              Contact Me
            </a>
          </motion.div>
        </div>

        {/* Image Section / Right Column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
          className="flex justify-center items-center order-1 lg:order-2 mb-10 lg:mb-0"
        >
          {/* Outer container with the slow breathing/pop-up animation */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="w-64 h-64 md:w-80 md:h-80 lg:w-[450px] lg:h-[450px] rounded-full overflow-hidden border-4 border-[#857567] shadow-xl shadow-[#857567]/30"
          >
            <img
              src={homeImage}
              alt="Anjana R Arakerimath"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0}}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      ></motion.div>
    </section>
  );
};

export default Home;
