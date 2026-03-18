import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import api from "../../services/api";

const CoursesPagePublic = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/teaching");
        setCourses(data);
      } catch (error) {
        console.error("Failed to fetch teaching courses", error);
      }
    };
    fetchCourses();
  }, []);

  return (
    <section
      id="courses"
      className="min-h-screen py-10 bg-dark-base px-5 md:px-10 lg:px-20 relative"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold leading-tight mb-2 tracking-wider text-center"
          style={{ color: "#5a5047" }}
        >
          COURSES TAUGHT
        </motion.h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "100px" }}
          viewport={{ once: true }}
          className="h-1 bg-[#a99899] mb-16 rounded-full"
        ></motion.div>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full z-10 justify-center">
          {courses.length > 0 ? (
            courses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (index % 6) * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="bg-[#ded6cc] rounded-2xl p-8 shadow-lg hover:shadow-[0_10px_30px_rgba(133,117,103,0.3)] transition-all flex flex-col justify-between group border-b-4 border-transparent border-[#5a5047] hover:border-[#857567] max-w-lg mx-auto w-full md:mx-0"
              >
                <div>
                  <div className="w-12 h-12 rounded-full bg-[#5a5047] text-[#f3eee6] flex justify-center items-center mb-6 group-hover:scale-110 transition-transform">
                    <BookOpen size={20} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#5a5047] mb-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-800 mb-6">
                    {course.year}
                  </p>
                  <p className="text-sm text-black mb-6 leading-relaxed line-clamp-5">
                    {course.description}
                  </p>
                </div>

                {course.link ? (
                  <a
                    href={course.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center w-full py-3 border border-[#857567] text-white font-bold rounded-full bg-[#857567] hover:bg-[#5a5047] transition-colors"
                  >
                    View Course Details
                  </a>
                ) : (
                  <div className="block text-center w-full py-3 border border-gray-400 text-gray-500 font-bold rounded-full bg-transparent opacity-60">
                    No Link Provided
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-red-500 font-bold py-20 text-xl">
              Currently, no courses taught are available to display.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursesPagePublic;
